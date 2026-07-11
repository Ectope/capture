/**
 * Scenario validation harness for the Temporary Pacing Simulator.
 * ==============================================================
 *
 * WHAT THIS DOES
 *   Runs each teaching scenario's "Expected simulator behaviour (✓)"
 *   checkpoints from tvp_simulator_script.md as machine-checkable assertions.
 *   The teaching script doubles as a validation script; this file is that
 *   validation script, executable.
 *
 *   It extracts the simulator engine straight out of index.html and drives it
 *   in a Node VM with a DOM stub, then reads the internal cardiac event stream
 *   (native_p, native_qrs, atrial_spike, vent_capture, ...) rather than pixels.
 *   Asserting on events rather than the canvas is only possible because the
 *   rhythm is genuinely simulated.
 *
 * HOW TO RUN
 *   node test_scenarios.js          (no dependencies, no browser, no server)
 *
 *   Exit code 0 = all pass, 1 = one or more failures.
 *
 * RELATIONSHIP TO test_pacing_behaviour.js
 *   That harness drives the SANDBOX (rhythm x mode matrix) through a real
 *   browser via Playwright. This one drives the TEACHING SCENARIOS headlessly.
 *   They are complementary; both should pass.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---- Pull the engine out of index.html, so it can never drift from the app.
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!blocks.length) { console.error('No <script> block found in index.html'); process.exit(1); }
const SRC = blocks[blocks.length - 1] + `
;globalThis.__sim = {
  get state()   { return state; },
  get patient() { return patient; },
  get simTime() { return simTime; },
  get lastVentSenseTime() { return lastVentSenseTime; },
  get lastVentPaceTime()  { return lastVentPaceTime; },
  get SCENARIOS()         { return SCENARIOS; },
  get ecgEvents()         { return ecgEvents; },
  get EVENT_RETENTION()   { return EVENT_RETENTION; },
  get BUFFER_LENGTH()     { return BUFFER_LENGTH; },
  get DT()                { return DT; },
  get PX_PER_MM()         { return PX_PER_MM; },
  get SWEEP_SPEED()       { return SWEEP_SPEED; }
};`;

// ---- Minimal DOM stub: enough for the app to boot and wire itself up.
const ctx2d = {
  canvas: { width: 1600, height: 300, offsetWidth: 800 },
  fillStyle: '', strokeStyle: '', lineWidth: 1,
  fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}
};
function makeEl() {
  const el = {
    value: '', textContent: '', innerHTML: '', checked: false, label: '',
    style: {}, width: 0, height: 0, offsetWidth: 800, offsetHeight: 150,
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {}, appendChild() {}, getContext: () => ctx2d
  };
  el.parentElement = { classList: { toggle() {}, add() {}, remove() {} } };
  return el;
}
const els = {};
const sandbox = {
  document: {
    getElementById(id) { return (els[id] || (els[id] = makeEl())); },
    createElement() { return makeEl(); },
    addEventListener() {}
  },
  window: { addEventListener() {} },
  requestAnimationFrame() {},          // never start the render loop
  Math, JSON, console, String, Object, Array, Number
};
vm.createContext(sandbox);
vm.runInContext(SRC, sandbox);
const S = sandbox.__sim;

// ---- Tap the cardiac event stream.
let log = [];
const originalAddEcgEvent = sandbox.addEcgEvent;
sandbox.addEcgEvent = function (type, time, extra) {
  log.push(Object.assign({ type, time }, extra || {}));   // keep `morph` etc.
  return originalAddEcgEvent(type, time, extra);
};

const W = 20000;                                   // 20 s observation window
const run = ms => { for (let i = 0, n = Math.round(ms / 10); i < n; i++) sandbox.simulateTick(); };
const observe = (ms = W) => { run(3000); log = []; run(ms); };   // settle, then watch
const count = type => log.filter(e => e.type === type).length;
const perMin = (type, ms = W) => count(type) / (ms / 60000);
const near = (v, lo, hi) => v >= lo && v <= hi;

let failures = 0;
function check(label, condition, detail) {
  if (!condition) failures++;
  console.log(`  ${condition ? '✓ PASS' : '✗ FAIL'}  ${label}${detail ? `   [${detail}]` : ''}`);
}

// Fire one of a scenario's clinical-action buttons, by a fragment of its label.
function act(scenarioId, labelFragment) {
  const scenario = S.SCENARIOS.find(s => s.id === scenarioId);
  const action = scenario.actions.find(a => a.label.includes(labelFragment));
  if (!action) throw new Error(`no action matching "${labelFragment}" in ${scenarioId}`);
  sandbox.runAction(action);
}

// =====================================================================
console.log('\nScenario 1 — Establish pacing dependence  (junctional escape 45)');
sandbox.startScenario('sc1');
observe();
check('Every beat paced at the set rate of 70, capturing',
  near(perMin('vent_capture'), 66, 74) && count('native_qrs') === 0,
  `${perMin('vent_capture').toFixed(0)}/min captured`);

S.state.rate = 40;                                  // the trainee down-rates
observe();
check('Reducing rate below 45 reveals a junctional escape, not asystole',
  near(perMin('native_qrs'), 42, 48), `escape ${perMin('native_qrs').toFixed(0)}/min`);
check('The escape is narrow (junctional), not a wide idioventricular beat',
  count('native_qrs_escape') === 0);
check('The box is inhibited by the escape (no competitive pacing)',
  count('vent_spike') <= 1);
check('Arterial trace remains perfusing',
  sandbox.getMeasuredHR() >= 40, `HR ${sandbox.getMeasuredHR()}`);

S.state.rate = 70;
observe();
check('Restoring the rate resumes 1:1 capture immediately',
  near(perMin('vent_capture'), 66, 74));

// =====================================================================
console.log('\nScenario 1b — The dependent patient  (no escape focus)');
sandbox.startScenario('sc1b');
observe();
check('Every beat paced at 70, capturing', near(perMin('vent_capture'), 66, 74));

S.state.rate = 30;
observe();
check('Down-rating never reveals an intrinsic beat — patient is dependent',
  count('native_qrs') === 0 && count('native_qrs_escape') === 0);
check('Rate follows the dial all the way down: profound bradycardia',
  near(sandbox.getMeasuredHR(), 28, 32), `HR ${sandbox.getMeasuredHR()}`);

S.state.ventLead = false;                           // the error: disconnect the box
run(4000); log = []; run(4000);
check('Disconnecting the lead produces asystole (haemodynamic collapse)',
  count('vent_capture') === 0 && count('native_qrs') === 0);
S.state.ventLead = true;
S.state.rate = 70;
observe();
check('Restoring rate rescues immediately', near(perMin('vent_capture'), 66, 74));

// =====================================================================
console.log('\nScenario 2 — Ventricular capture threshold  (true threshold 1.5 mA)');
sandbox.startScenario('sc2');
observe();
check('1:1 capture, paced rate (60) above the intrinsic rate (45)',
  near(perMin('vent_capture'), 56, 64));

S.state.vOutput = 1.5;
observe();
check('Capture holds at exactly 1.5 mA (the threshold)',
  near(perMin('vent_capture'), 56, 64));

S.state.vOutput = 1.4;
observe();
check('Capture lost cleanly below 1.5 mA: spike present, no QRS',
  count('vent_capture') === 0 && count('vent_spike') > 0,
  `${count('vent_spike')} spikes, ${count('vent_capture')} captures`);
check('No pulse from the failed spikes; the escape at 45 carries the output',
  near(perMin('native_qrs'), 42, 48));

S.state.vOutput = 4.5;                              // 3x threshold
observe();
check('Above threshold: 1:1 capture returns', near(perMin('vent_capture'), 56, 64));

// =====================================================================
console.log('\nScenario 3 — Ventricular sensing threshold  (R wave 4 mV)');
sandbox.startScenario('sc3');
observe();
check('Rate (40) below intrinsic (60): the box senses and does not pace',
  count('vent_spike') === 0 && near(perMin('native_qrs'), 56, 64));
check('Sense indicator tracks each intrinsic R wave',
  S.simTime - S.lastVentSenseTime < 1200);

S.state.vSensing = 4.0;
observe();
check('Still sensing at 4.0 mV (equal to the signal amplitude)',
  count('vent_spike') === 0);

S.state.vSensing = 4.5;
observe();
check('Above ~4 mV sensing is lost: the box paces asynchronously at 40',
  near(perMin('vent_spike'), 36, 44), `${perMin('vent_spike').toFixed(0)} spikes/min`);
check('Spikes march into the intrinsic beats (competitive pacing)',
  count('native_qrs') > 0 && count('vent_capture') > 0);

S.state.vSensing = 2.0;                             // half the threshold: 2:1 margin
observe();
check('Returning to a lower mV restores sensing and inhibition',
  count('vent_spike') === 0);

// =====================================================================
console.log('\nScenario 4 — The integrated daily check  (A thr 2 mA, V thr 1 mA)');
sandbox.startScenario('sc4');
observe();
check('Correct AV-sequential pacing at 70: both chambers captured',
  near(perMin('atrial_capture'), 66, 74) && near(perMin('vent_capture'), 66, 74),
  `A ${perMin('atrial_capture').toFixed(0)}, V ${perMin('vent_capture').toFixed(0)}`);

S.state.rate = 40;
observe();
check('Down-rating: atrial pacing stops, the patient\'s own sinus (55) appears',
  count('atrial_spike') === 0 && near(perMin('native_p'), 52, 58));
check('...but the ventricle is still paced — AV (160) is shorter than the PR (220)',
  near(perMin('vent_capture'), 52, 58) && count('native_qrs') === 0);

S.state.avInterval = 250;                           // unmask AV conduction
observe();
check('Lengthening AV past the native PR unmasks conduction: not dependent',
  near(perMin('native_qrs'), 52, 58) && count('vent_spike') === 0,
  `conducted ${perMin('native_qrs').toFixed(0)}/min`);

S.state.avInterval = 160; S.state.rate = 70;
observe();
check('Restoring rate and AV resumes AV-sequential pacing',
  near(perMin('atrial_capture'), 66, 74) && near(perMin('vent_capture'), 66, 74));

S.state.aOutput = 1.9;                              // below the atrial threshold
observe();
check('Independent atrial threshold: below 2 mA the spike produces no P wave',
  count('atrial_spike') > 0 && count('atrial_capture') === 0);
S.state.aOutput = 6;

S.state.vOutput = 0.9;                              // below the ventricular threshold
observe();
check('Independent ventricular threshold: below 1 mA the spike produces no paced QRS',
  count('vent_spike') > 0 && count('vent_capture') === 0);
check('...and a narrow conducted QRS still follows — intact AV conduction',
  count('native_qrs') > 0);
check('Atrial threshold (2 mA) is higher than ventricular (1 mA), as programmed',
  S.patient.aThreshold > S.patient.vThreshold);

S.state.vOutput = 3;
observe();
check('Restoring a 2-3x margin restores AV-sequential capture',
  near(perMin('vent_capture'), 66, 74));

// =====================================================================
console.log('\nScenario 5 — Failure to capture  (threshold risen to 4 mA, output 3 mA)');
sandbox.startScenario('sc5');
observe();
check('Visible spikes with no following QRS (failure to capture, not output)',
  count('vent_spike') > 0 && count('vent_capture') === 0,
  `${count('vent_spike')} spikes, ${count('vent_capture')} captures`);
check('The escape at 40 is carrying the patient, so they tolerate it',
  near(sandbox.getMeasuredHR(), 36, 44), `HR ${sandbox.getMeasuredHR()}`);

S.state.vOutput = 4;
observe();
check('Raising the output above the new 4 mA threshold restores capture',
  near(perMin('vent_capture'), 66, 74), `${perMin('vent_capture').toFixed(0)}/min`);

S.state.vOutput = 10;                               // 2-3x the new threshold
observe();
check('A 2-3x margin on the new threshold holds 1:1 capture at 70',
  near(perMin('vent_capture'), 66, 74) && near(sandbox.getMeasuredHR(), 66, 74));

// =====================================================================
console.log('\nScenario 6 — Undersensing  (R wave only 3 mV, box set to 6 mV)');
sandbox.startScenario('sc6');
observe();
check('The box is blind to the intrinsic beats and paces through them',
  count('vent_spike') > 0 && count('native_qrs') > 0,
  `${count('vent_spike')} spikes into ${count('native_qrs')} native beats`);
check('Sense LED is NOT tracking (nothing is being sensed)',
  S.simTime - S.lastVentSenseTime > 5000);
check('Competitive pacing: some blind spikes capture (R-on-T risk)',
  count('vent_capture') > 0, `${count('vent_capture')} competitive captures`);

S.state.vSensing = 6;                               // the wrong direction
observe();
check('Raising the mV further (wrong direction) does not help',
  count('vent_spike') > 0);

S.state.vSensing = 1.5;                             // more sensitive, below 3 mV
observe();
check('Lowering the mV below the 3 mV R wave restores inhibition',
  count('vent_spike') === 0, `${count('vent_spike')} spikes`);
check('Sense indicator resumes tracking; the patient is left alone at 75',
  S.simTime - S.lastVentSenseTime < 1200 && near(sandbox.getMeasuredHR(), 71, 79),
  `HR ${sandbox.getMeasuredHR()}`);

// =====================================================================
console.log('\nScenario 7 — Oversensing  (1.5 mV artefact, box set to 0.5 mV)');
sandbox.startScenario('sc7');
observe();
check('Artefact is present on the trace',
  count('noise') > 0, `${count('noise')} artefact bursts`);
check('Inappropriate inhibition: pauses with NO output during the artefact',
  count('vent_spike') === 0, `${count('vent_spike')} spikes (box set to pace at 60)`);
check('The patient drops to their own escape rate of 40',
  near(sandbox.getMeasuredHR(), 36, 44), `HR ${sandbox.getMeasuredHR()}`);
check('The sense LED is flashing to the artefact (the clue)',
  S.simTime - S.lastVentSenseTime < 1200);

S.state.vOutput = 15;                               // the wrong lever
observe();
check('Turning the OUTPUT up does nothing — it is a sensing problem',
  count('vent_spike') === 0);
S.state.vOutput = 5;

S.state.async = true;                               // the bridge
observe();
check('ASYNC (VOO) paces regardless of the noise — a bridge if unstable',
  near(perMin('vent_spike'), 56, 64) && near(sandbox.getMeasuredHR(), 56, 64),
  `HR ${sandbox.getMeasuredHR()}, mode ${sandbox.getMode()}`);
S.state.async = false;

S.state.vSensing = 3;                               // above noise (1.5), below R (8)
observe();
check('Raising the mV above the artefact abolishes the inhibition',
  near(perMin('vent_capture'), 56, 64) && near(sandbox.getMeasuredHR(), 56, 64),
  `HR ${sandbox.getMeasuredHR()}`);
check('...and the box can still see real beats (mV is below the 8 mV R wave)',
  S.state.vSensing < S.patient.vAmplitude);
check('The artefact is still on the trace — the box just no longer believes it',
  count('noise') > 0);

// =====================================================================
console.log('\nScenario 8 — Output failure  (fractured V cable)');
sandbox.startScenario('sc8');
observe();
check('NO spikes on the ECG at all (output failure, not failure to capture)',
  count('vent_spike') === 0 && count('atrial_spike') === 0);
check('The pace LED still flashes — the generator believes it is pacing',
  S.simTime - S.lastVentPaceTime < 1000,
  `last pace attempt ${S.simTime - S.lastVentPaceTime} ms ago`);
check('The patient is on their own escape at 35, symptomatic',
  near(sandbox.getMeasuredHR(), 31, 39), `HR ${sandbox.getMeasuredHR()}`);

S.state.vOutput = 25;                               // maximum output
observe();
check('Maximum output pushes no current through a broken circuit',
  count('vent_spike') === 0 && near(sandbox.getMeasuredHR(), 31, 39));

S.state.async = true;                               // async is not the fix either
observe();
check('ASYNC does not fix a true cable fault (it only defeats oversensing)',
  count('vent_spike') === 0);
S.state.async = false;
S.state.vOutput = 5;

// The circuit fix: re-seat the ventricular connection.
S.state.ventLead = false; sandbox.reseatChannel('V');   // unplug...
S.state.ventLead = true;  sandbox.reseatChannel('V');   // ...and plug back in
observe();
check('Re-seating the V connection restores output immediately',
  near(perMin('vent_spike'), 66, 74) && near(perMin('vent_capture'), 66, 74),
  `${perMin('vent_spike').toFixed(0)} spikes/min`);
check('Capture restored, rate back to the programmed 70',
  near(sandbox.getMeasuredHR(), 66, 74), `HR ${sandbox.getMeasuredHR()}`);

// =====================================================================
console.log('\nScenario 9 — Lead displacement  (jittery threshold + ectopy)');
sandbox.startScenario('sc9');
observe(30000);
const cap9 = count('vent_capture'), spk9 = count('vent_spike');
check('Beat-to-beat variable capture at an unchanged output',
  cap9 > 0 && cap9 < spk9, `${cap9} captures from ${spk9} spikes`);
check('Ectopy: ventricular ectopics thrown by the irritable lead',
  count('ectopic_qrs') > 0, `${count('ectopic_qrs')} ectopics`);
check('Paced QRS is LBBB while the lead is in the RV',
  log.filter(e => e.type === 'vent_capture').length > 0 && S.patient.pacedQrs === 'lbbb');

// The positional manoeuvre: capture should transiently improve.
act('sc9', 'Reposition');
observe(15000);
check('Repositioning the patient transiently improves capture',
  count('vent_capture') === count('vent_spike') && count('vent_spike') > 0,
  `${count('vent_capture')}/${count('vent_spike')} spikes captured`);
check('...and the ectopy settles with it (mechanical, not electrical)',
  count('ectopic_qrs') <= 2, `${count('ectopic_qrs')} ectopics`);

// It wears off.
run(20000); observe();
check('The lead drifts off again — the improvement was temporary',
  count('vent_capture') < count('vent_spike') && count('ectopic_qrs') > 0,
  `${count('vent_capture')}/${count('vent_spike')} captured, ${count('ectopic_qrs')} ectopics`);

// Raising the output buys capture but cannot stop the ectopy.
S.state.vOutput = 12;
observe();
check('A high output restores reliable capture (every spike now captures)...',
  count('vent_spike') > 0 && count('vent_capture') === count('vent_spike'),
  `${count('vent_capture')}/${count('vent_spike')} spikes captured`);
check('...but the ectopy continues — you cannot hold a lead still with current',
  count('ectopic_qrs') > 0, `${count('ectopic_qrs')} ectopics`);
check('...and the ectopics steal beats from the pacer, so the rate is still not the set rate',
  near(perMin('vent_capture') + perMin('ectopic_qrs'), 62, 82),
  `${perMin('vent_capture').toFixed(0)} paced + ${perMin('ectopic_qrs').toFixed(0)} ectopic/min`);

// Septal perforation: the morphology flips.
sandbox.startScenario('sc9');
run(76000); log = []; run(W);
check('At 75 s the paced QRS flips LBBB → RBBB (septal perforation)',
  S.patient.pacedQrs === 'rbbb' &&
  log.filter(e => e.type === 'vent_capture').every(e => e.morph === 'rbbb'),
  `morph now ${S.patient.pacedQrs}`);

// =====================================================================
console.log('\nScenario 10 — Cross-talk → ventricular standstill  (dependent)');
sandbox.startScenario('sc10');
observe();
check('Atrial spikes present and capturing',
  perMin('atrial_spike') > 50 && perMin('atrial_capture') > 50,
  `${perMin('atrial_capture').toFixed(0)}/min A captured`);
check('Cross-talk: the V channel is sensing the atrial stimulus',
  count('crosstalk') > 0, `${count('crosstalk')} cross-talk events`);
check('Ventricular output INHIBITED: no V spike, no QRS — standstill',
  count('vent_spike') === 0 && count('vent_capture') === 0);
check('Haemodynamic collapse: no cardiac output at all (dependent patient)',
  sandbox.getMeasuredHR() === 0, `HR ${sandbox.getMeasuredHR()}`);

S.state.vOutput = 20;                               // the wrong lever
observe();
check('Turning the V output up does nothing — output is withheld, not failing',
  count('vent_spike') === 0);
S.state.vOutput = 5;

S.state.async = true;                               // SECURE OUTPUT FIRST
observe();
check('ASYNC (DOO) immediately restores ventricular pacing — the rescue',
  near(perMin('vent_capture'), 56, 64) && near(sandbox.getMeasuredHR(), 56, 64),
  `HR ${sandbox.getMeasuredHR()}, mode ${sandbox.getMode()}`);
S.state.async = false;

S.state.vSensing = 3;                               // fix 1: less sensitive
observe();
check('Fix 1 — raising the V mV above the artefact restores AV-sequential pacing',
  near(perMin('vent_capture'), 56, 64) && count('crosstalk') === 0,
  `HR ${sandbox.getMeasuredHR()}`);

sandbox.startScenario('sc10');                      // back to the fault
S.state.aOutput = 3;                                // fix 2: smaller atrial stimulus
observe();
check('Fix 2 — turning the atrial output down shrinks the artefact below the setting',
  near(perMin('vent_capture'), 56, 64) && count('crosstalk') === 0,
  `HR ${sandbox.getMeasuredHR()}`);
check('...and the atrium still captures (3 mA vs a 1.5 mA threshold)',
  perMin('atrial_capture') > 50);

// =====================================================================
console.log('\nScenario 11 — Pacemaker-mediated tachycardia');
sandbox.startScenario('sc11');
observe();
check('Retrograde P waves: the paced beat conducts backwards to the atrium',
  count('retrograde_p') > 0, `${count('retrograde_p')} retrograde P waves`);
check('Endless loop: a paced tachycardia at EXACTLY the upper rate limit (160)',
  near(sandbox.getMeasuredHR(), 158, 162) && perMin('vent_spike') > 150,
  `HR ${sandbox.getMeasuredHR()}`);

S.state.upperRate = 120;                            // the diagnostic proof
observe();
check('Lowering the upper rate limit drags the tachycardia down with it — proof it is the box',
  near(sandbox.getMeasuredHR(), 118, 122), `HR ${sandbox.getMeasuredHR()}`);
S.state.upperRate = 160;
observe();

S.state.async = true;                               // magnet equivalent
observe();
check('ASYNC (DOO) terminates it — the box stops listening, the loop dies',
  near(sandbox.getMeasuredHR(), 56, 64), `HR ${sandbox.getMeasuredHR()}`);
S.state.async = false;
observe();
check('Coming out of ASYNC, the loop restarts (nothing has been fixed)',
  near(sandbox.getMeasuredHR(), 158, 162));

S.state.atrialLead = false;                         // non-tracking mode = VVI
observe();
check('Switching to a non-tracking mode (VVI) also terminates it (back to the set 60)',
  near(sandbox.getMeasuredHR(), 56, 64) && sandbox.getMode() === 'VVI',
  `HR ${sandbox.getMeasuredHR()}, mode ${sandbox.getMode()}`);
S.state.atrialLead = true;
observe();

S.state.pvarp = 300;                                // the definitive fix (VA = 250 ms)
observe();
check('Extending PVARP past the 250 ms VA time prevents re-initiation',
  near(sandbox.getMeasuredHR(), 56, 64) && sandbox.getMode() === 'DDD',
  `HR ${sandbox.getMeasuredHR()}, mode ${sandbox.getMode()}`);
check('The retrograde P is still there — it is simply no longer tracked',
  count('retrograde_p') > 0, `${count('retrograde_p')} retrograde P waves, ignored`);

// =====================================================================
console.log('\nScenario 12 — Rising threshold, dependent patient  (time-varying)');
sandbox.startScenario('sc12');
observe(20000);
check('t=0-20 s: threshold 1 mA, output 5 mA — 1:1 capture at 70',
  near(perMin('vent_capture'), 66, 74) && S.patient.vThreshold === 1,
  `HR ${sandbox.getMeasuredHR()}`);

run(20000); log = []; run(20000);                   // now past t=30 s
check('t=30 s: threshold rises to 3 mA on its own — still capturing at 5 mA',
  S.patient.vThreshold === 3 && near(perMin('vent_capture', 20000), 66, 74));

run(30000); log = []; run(20000);                   // now past t=75 s
check('t=75 s: threshold 5 mA = the output. Capture goes INTERMITTENT (the warning)',
  S.patient.vThreshold === 5 &&
  count('vent_capture') > 0 && count('vent_capture') < count('vent_spike'),
  `${count('vent_capture')} captures from ${count('vent_spike')} spikes`);

run(30000); log = []; run(20000);                   // now past t=120 s
check('t=120 s: threshold 7 mA. Capture LOST — spikes only',
  S.patient.vThreshold === 7 && count('vent_capture') === 0 && count('vent_spike') > 0);
check('Dependent patient with no escape: ASYSTOLE',
  sandbox.getMeasuredHR() === 0, `HR ${sandbox.getMeasuredHR()}`);

S.state.vOutput = 18;                               // SECURE OUTPUT
observe();
check('Raising the output above the risen threshold recaptures — buying time',
  near(perMin('vent_capture'), 66, 74) && near(sandbox.getMeasuredHR(), 66, 74),
  `HR ${sandbox.getMeasuredHR()}`);

// Replay, and this time treat the cause instead of chasing it.
sandbox.startScenario('sc12');
act('sc12', 'hyperkalaemia');
run(35000); log = []; run(W);
check('Treating the hyperkalaemia pulls the threshold back DOWN (1.5 mA)',
  S.patient.vThreshold === 1.5, `threshold now ${S.patient.vThreshold} mA`);
check('...and cancels the scripted rise: it does not climb again',
  near(perMin('vent_capture'), 66, 74));
run(120000); log = []; run(W);
check('Two minutes later the threshold is still 1.5 mA — the cause was treated',
  S.patient.vThreshold === 1.5 && near(perMin('vent_capture'), 66, 74),
  `threshold ${S.patient.vThreshold} mA, HR ${sandbox.getMeasuredHR()}`);

// The backup pathway: pads on, then let it deteriorate untreated.
sandbox.startScenario('sc12');
act('sc12', 'transcutaneous pads');
run(125000); log = []; run(W);
check('Transcutaneous backup captures when the transvenous system fails',
  count('tcp_spike') > 0 && near(sandbox.getMeasuredHR(), 56, 64),
  `${count('tcp_spike')} TCP beats, HR ${sandbox.getMeasuredHR()}`);
check('The patient is NOT in asystole — the pads are carrying them',
  sandbox.getMeasuredHR() > 50);

// =====================================================================
console.log('\nCross-scenario: no fault leaks between scenarios');
sandbox.startScenario('sc8');                       // sets connectionFault + escape
sandbox.startScenario('sc2');                       // a clean-circuit scenario
observe();
check('Starting a new scenario clears the previous one\'s connection fault',
  S.patient.connectionFault === null && count('vent_spike') > 0);
sandbox.startScenario('sc7');                       // sets noise
sandbox.startScenario('sc5');
observe();
check('Starting a new scenario clears the previous one\'s lead noise',
  S.patient.noise === null && count('noise') === 0);

// =====================================================================
// Rendering integrity. The green trace is baked into the sample buffer as it is
// generated, but pacing spikes are overlaid live from `ecgEvents` on every
// frame. If events are pruned sooner than the buffer scrolls off, spikes vanish
// partway along the strip while the complexes they produced remain -- which
// looks exactly like the pacemaker stopping. It must not happen.
console.log('\nRendering integrity — spikes must survive the whole visible strip');
{
  // Widest panel we could plausibly render into, in CSS px.
  const WIDEST_PANEL_CSS_PX = 1400;
  const secondsOnScreen = (WIDEST_PANEL_CSS_PX / S.PX_PER_MM) / S.SWEEP_SPEED * 1000;

  check('Event retention covers the full sample buffer',
    S.EVENT_RETENTION >= S.BUFFER_LENGTH * S.DT,
    `retain ${S.EVENT_RETENTION} ms, buffer ${S.BUFFER_LENGTH * S.DT} ms`);
  check('Event retention covers the widest drawable strip',
    S.EVENT_RETENTION >= secondsOnScreen,
    `retain ${S.EVENT_RETENTION} ms, strip ${Math.round(secondsOnScreen)} ms`);

  // And prove it end to end: pace for a while, then confirm the surviving spike
  // events actually span the whole strip rather than only its right-hand half.
  sandbox.startScenario('sc1b');          // VVI, every beat paced, nothing intrinsic
  run(25000);
  const spikes = S.ecgEvents.filter(e => e.type === 'vent_spike');
  const oldest = Math.min(...spikes.map(e => S.simTime - e.time));
  const span = Math.max(...spikes.map(e => S.simTime - e.time));
  check('Spikes are retained right back to the left-hand edge of the strip',
    span >= secondsOnScreen,
    `oldest surviving spike is ${Math.round(span)} ms old; strip is ${Math.round(secondsOnScreen)} ms`);
  check('Every paced beat on the strip still has its spike (none silently dropped)',
    spikes.length >= Math.floor(secondsOnScreen / 1000) * (70 / 60) - 1,
    `${spikes.length} spikes retained`);
}

// =====================================================================
console.log('\nSandbox regression — the original rhythms still behave');
sandbox.setAppMode('sandbox');
for (const [rhythm, lo, hi] of [['sinus80', 76, 84], ['chb', 26, 34]]) {
  S.state.rhythm = rhythm;
  sandbox.applyRhythmPreset(rhythm);
  S.state.mode = 'OFF';                             // watch the native rhythm alone
  sandbox.resetForScenario();
  observe();
  check(`${rhythm}: intrinsic ventricular rate correct with the box off`,
    near(sandbox.getMeasuredHR(), lo, hi), `HR ${sandbox.getMeasuredHR()}`);
}
S.state.mode = 'DDD';
S.state.rhythm = 'asystole';
sandbox.applyRhythmPreset('asystole');
Object.assign(S.state, { rate: 80, avInterval: 200, aOutput: 5, vOutput: 5 });
sandbox.resetForScenario();
observe();
check('asystole + DDD 80: atrial pacing captures and conducts, output restored',
  near(sandbox.getMeasuredHR(), 76, 84), `HR ${sandbox.getMeasuredHR()}`);

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
