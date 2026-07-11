/**
 * Behavioural test harness for the Temporary Pacing Simulator.
 * ============================================================
 *
 * WHAT THIS DOES
 *   Drives the running simulator in a headless browser and, for each
 *   (rhythm x pacing mode) case, sets a defined starting state, lets the
 *   engine run, reads the *internal event stream* (not pixels), and asserts
 *   the emergent behaviour matches the expected pacing physiology.
 *
 *   Each case declares:
 *     - start:  the underlying rhythm + device programming
 *     - expect: a plain-English description of the correct behaviour
 *     - assert: the machine-checkable version of `expect`
 *
 * WHY IT READS THE EVENT STREAM
 *   The simulator exposes its state as script-scope variables (`ecgEvents`,
 *   `ventEventTimes`, `state`, the timing registers). Playwright's
 *   page.evaluate runs in the same realm, so we can read those directly and
 *   assert on ground truth instead of trying to interpret the canvas.
 *
 * HOW TO RUN
 *   1. Start the app:
 *        cd pacing-sim-flask_1 && flask --app app run --port 5050
 *      (port 5000 is taken by AirPlay on macOS; any free port is fine)
 *   2. Install Playwright + a browser somewhere on NODE_PATH:
 *        npm install playwright && npx playwright install chromium
 *   3. Run:
 *        BASE_URL=http://127.0.0.1:5050 node test_pacing_behaviour.js
 *
 *   Exit code 0 = all pass, 1 = one or more failures.
 *
 * NOTE ON MODES
 *   The current UI only exposes DDD, with the lead switches demoting it to
 *   AAI / VVI / OFF. There is no on-screen mode selector, so this harness
 *   sets `state.mode` programmatically to exercise every mode (incl. the
 *   asynchronous DOO / VOO). If a mode selector is added later, these cases
 *   map 1:1 onto it.
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5050';
const SETTLE_MS = 2600;   // let device timers stabilise after (re)configuring
const CAPTURE_MS = 6500;  // observation window per case
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- Default device programming; each case overrides what it needs. ----
const DEFAULTS = {
  mode: 'DDD', rhythm: 'sinus80', rate: 60,
  aLead: true, vLead: true,
  aOutput: 5, vOutput: 5,   // both above capture threshold (A>=2, V>=3 mA)
  aSensing: 2, vSensing: 2   // both below native signal (A 3 mV, V 8 mV) => can sense
};

/**
 * Test matrix. `assert` keys:
 *   ventRate: [min,max] bpm of mechanical ventricular beats (null = skip)
 *   aPace,vPace: 'none' | 'some'  (atrial / ventricular pacing spikes)
 *   aCap,vCap:   'none' | 'some'  (captured atrial / ventricular paces)
 *   nP,nQRS,esc: 'none' | 'some'  (native P / conducted QRS / escape QRS)
 *   pseudofusion: true      (some spikes fire but do NOT capture: paces > captures)
 * 'none' => count 0; 'some' => count >= 2 (ignores a lone settling event).
 */
const CASES = [
  // ---------------- DDD ----------------
  { name: 'DDD / Sinus 80 / rate 60',
    cfg: { mode: 'DDD', rhythm: 'sinus80', rate: 60 },
    expect: 'Intrinsic rate (80) exceeds set rate (60): device fully inhibited, pure native rhythm, no spikes.',
    assert: { ventRate: [74, 86], aPace: 'none', vPace: 'none', nQRS: 'some' } },

  { name: 'DDD / Sinus 40 / rate 70',
    cfg: { mode: 'DDD', rhythm: 'sinus40', rate: 70 },
    expect: 'Set rate (70) > intrinsic (40): atrial overdrive pacing; the paced atrium conducts, so the ventricular pace is inhibited (narrow conducted QRS).',
    assert: { ventRate: [64, 76], aPace: 'some', vPace: 'none', nQRS: 'some' } },

  { name: 'DDD / Sinus 120 / rate 60',
    cfg: { mode: 'DDD', rhythm: 'sinus120', rate: 60 },
    expect: 'Fast intrinsic rate, conduction intact: fully inhibited, ventricle follows the native atrium at ~120.',
    assert: { ventRate: [112, 128], aPace: 'none', vPace: 'none', nQRS: 'some' } },

  { name: 'DDD / Complete Heart Block / rate 60',
    cfg: { mode: 'DDD', rhythm: 'chb', rate: 60 },
    expect: 'Native atria (~75) above set rate and dissociated: device tracks each P and paces the ventricle (AV synchrony restored) at ~75; no atrial pacing.',
    assert: { ventRate: [66, 84], aPace: 'none', vPace: 'some', vCap: 'some', nP: 'some' } },

  { name: 'DDD / 2nd Degree 2:1 / rate 50',
    cfg: { mode: 'DDD', rhythm: 'seconddegree21', rate: 50 },
    expect: 'Native atria ~70 with 2:1 block: DDD tracks EVERY P (SAV shorter than the native PR) and paces the ventricle 1:1 at ~70, bypassing the block.',
    assert: { ventRate: [62, 78], vPace: 'some', nP: 'some' } },

  { name: 'DDD / Asystole / rate 70',
    cfg: { mode: 'DDD', rhythm: 'asystole', rate: 70 },
    expect: 'No intrinsic activity but AV conduction intact (sinus arrest): atrial pacing conducts to a narrow QRS; ventricular pace inhibited. Output restored at 70.',
    assert: { ventRate: [64, 76], aPace: 'some', aCap: 'some', vPace: 'none', nQRS: 'some' } },

  // ---------------- AAI ----------------
  { name: 'AAI / Sinus 80 / rate 60',
    cfg: { mode: 'AAI', rhythm: 'sinus80', rate: 60 },
    expect: 'Intrinsic atrial rate above set rate: atrial channel inhibited, native conducted rhythm at ~80.',
    assert: { ventRate: [74, 86], aPace: 'none', nQRS: 'some' } },

  { name: 'AAI / Sinus 40 / rate 70',
    cfg: { mode: 'AAI', rhythm: 'sinus40', rate: 70 },
    expect: 'Atrial pacing at 70; each paced beat conducts to a narrow QRS. Rate ~70.',
    assert: { ventRate: [64, 76], aPace: 'some', aCap: 'some', nQRS: 'some' } },

  { name: 'AAI / Complete Heart Block / rate 90  [MODE-INAPPROPRIATE]',
    cfg: { mode: 'AAI', rhythm: 'chb', rate: 90 },
    expect: 'Classic error: atria paced at 90 but conduction is blocked, so the ventricle relies on its escape (~30). Atrial pacing with dropped ventricular beats -> profound bradycardia despite "pacing".',
    assert: { ventRate: [22, 40], aPace: 'some', vPace: 'none', vCap: 'none', esc: 'some' } },

  { name: 'AAI / Asystole / rate 70',
    cfg: { mode: 'AAI', rhythm: 'asystole', rate: 70 },
    expect: 'Sinus arrest with intact conduction: atrial pacing conducts and rescues output at 70.',
    assert: { ventRate: [64, 76], aPace: 'some', nQRS: 'some' } },

  // ---------------- VVI ----------------
  { name: 'VVI / Sinus 80 / rate 60',
    cfg: { mode: 'VVI', rhythm: 'sinus80', rate: 60 },
    expect: 'Intrinsic ventricular rate above set rate: ventricular pacing inhibited, native rhythm at ~80.',
    assert: { ventRate: [74, 86], vPace: 'none', nQRS: 'some' } },

  { name: 'VVI / Complete Heart Block / rate 60',
    cfg: { mode: 'VVI', rhythm: 'chb', rate: 60 },
    expect: 'Ventricular escape (~30) below set rate: ventricle paced at 60 (no AV synchrony). Captured wide QRS.',
    assert: { ventRate: [54, 66], vPace: 'some', vCap: 'some' } },

  { name: 'VVI / First Degree HB / rate 40',
    cfg: { mode: 'VVI', rhythm: 'firstdegree', rate: 40 },
    expect: 'Native ventricular rate (~55, long PR) above set rate: inhibited. Rate ~55.',
    assert: { ventRate: [48, 62], vPace: 'none', nQRS: 'some' } },

  { name: 'VVI / Asystole / rate 60',
    cfg: { mode: 'VVI', rhythm: 'asystole', rate: 60 },
    expect: 'No intrinsic activity: ventricle paced at 60. Captured wide QRS.',
    assert: { ventRate: [54, 66], vPace: 'some', vCap: 'some' } },

  // ---------------- Asynchronous ----------------
  { name: 'DOO / Sinus 80 / rate 70  [ASYNC]',
    cfg: { mode: 'DOO', rhythm: 'sinus80', rate: 70 },
    expect: 'No sensing: device paces A and V at 70 regardless of the native rhythm -> competitive pacing (paced spikes AND native complexes present). Spikes landing on refractory tissue are ineffective (pseudofusion).',
    assert: { aPace: 'some', vPace: 'some', nP: 'some', pseudofusion: true } },

  { name: 'VOO / Asystole / rate 80  [ASYNC]',
    cfg: { mode: 'VOO', rhythm: 'asystole', rate: 80 },
    expect: 'Asynchronous ventricular pacing at 80; captured wide QRS.',
    assert: { ventRate: [74, 86], vPace: 'some', vCap: 'some' } },

  // ---------------- Failure modes (must be recognisable, not announced) ----------------
  { name: 'FAILURE: Loss of capture  (VVI / CHB / rate 70 / V output 1 mA)',
    cfg: { mode: 'VVI', rhythm: 'chb', rate: 70, vOutput: 1 },
    expect: 'Output below threshold: ventricular spikes present but none capture; underlying escape (~30) shows through. Spikes marching with no following QRS.',
    assert: { ventRate: [22, 40], vPace: 'some', vCap: 'none', esc: 'some' } },

  { name: 'FAILURE: Atrial loss of capture (DDD / Asystole / rate 70 / A output 1 mA)',
    cfg: { mode: 'DDD', rhythm: 'asystole', rate: 70, aOutput: 1 },
    expect: 'Atrial spikes do not capture (no P, no conduction); the ventricular safety pace still maintains rate. Atrial spikes without P; V pacing carries output.',
    assert: { ventRate: [64, 76], aPace: 'some', aCap: 'none', vPace: 'some', vCap: 'some' } },

  { name: 'FAILURE: Undersensing (VVI / Sinus 80 / rate 50 / V sensitivity 15 mV)',
    cfg: { mode: 'VVI', rhythm: 'sinus80', rate: 50, vSensing: 15 },
    expect: 'Sensitivity number set above the native signal (blind): device paces at 50 through the intrinsic rhythm -> competitive pacing, spikes landing on native beats (R-on-T risk).',
    assert: { vPace: 'some', nQRS: 'some' } },
];

// ---- Configure the running simulator into a known state. ----
async function configure(page, cfg) {
  const c = Object.assign({}, DEFAULTS, cfg);
  await page.evaluate((c) => {
    state.mode = c.mode;
    state.rhythm = c.rhythm;
    // The patient's ground truth (rhythm, escape focus, capture thresholds,
    // signal amplitudes) lives in `patient`, not in `state`. Setting
    // state.rhythm alone only renames the menu selection -- this writes the
    // rhythm through to the patient the physics engine actually reads.
    applyRhythmPreset(c.rhythm);
    state.rate = c.rate;
    state.atrialLead = c.aLead;
    state.ventLead = c.vLead;
    state.aOutput = c.aOutput;
    state.vOutput = c.vOutput;
    state.aSensing = c.aSensing;
    state.vSensing = c.vSensing;

    // Reflect into the visible controls (so the UI matches the test state).
    document.getElementById('rate').value = c.rate;
    document.getElementById('aOutput').value = c.aOutput;
    document.getElementById('vOutput').value = c.vOutput;
    document.getElementById('aSensing').value = c.aSensing;
    document.getElementById('vSensing').value = c.vSensing;
    document.getElementById('atrialLead').checked = c.aLead;
    document.getElementById('ventLead').checked = c.vLead;
    document.getElementById('rhythmSelect').value = c.rhythm;

    // Re-seed physiology and device timers for a clean start.
    lastAtrialActivation = simTime;
    lastVentActivation = simTime;
    escapeRef = simTime;
    lastAtrialEvent = simTime;
    aviStart = null;
    aviWasPaced = false;
    scheduledQRS = null;
    avConductCounter = 0;
    ventEventTimes = [];
    ecgEvents = [];
    atrialBlankUntil = ventBlankUntil = 0;
    atrialRefractoryUntil = ventRefractoryUntil = pvarpUntil = 0;
  }, c);
}

// ---- Observe the internal event stream for a window and summarise it. ----
async function observe(page, ms) {
  await page.evaluate(() => {
    window.__cap = [];
    window.__seen = new Set();
    window.__iv = setInterval(() => {
      for (const e of ecgEvents) {
        const k = e.type + '@' + e.time;
        if (!window.__seen.has(k)) { window.__seen.add(k); window.__cap.push({ t: e.time, type: e.type }); }
      }
    }, 5);
  });
  await sleep(ms);
  const events = await page.evaluate(() => { clearInterval(window.__iv); return window.__cap.slice().sort((a, b) => a.t - b.t); });

  const count = t => events.filter(e => e.type === t).length;
  const ventTimes = events.filter(e => ['vent_capture', 'native_qrs', 'native_qrs_escape'].includes(e.type)).map(e => e.t);
  const intervals = [];
  for (let i = 1; i < ventTimes.length; i++) intervals.push(ventTimes[i] - ventTimes[i - 1]);
  intervals.sort((a, b) => a - b);
  const median = intervals.length ? intervals[Math.floor(intervals.length / 2)] : null;
  const ventRate = median ? Math.round(60000 / median) : 0;

  return {
    ventRate,
    metrics: {
      aPace: count('atrial_spike'), aCap: count('atrial_capture'),
      vPace: count('vent_spike'), vCap: count('vent_capture'),
      nP: count('native_p'), nQRS: count('native_qrs'), esc: count('native_qrs_escape')
    }
  };
}

// ---- Check observation against a case's assertions. ----
function check(assert, obs) {
  const fails = [];
  const want = (key, kind) => {
    const n = obs.metrics[key];
    if (kind === 'none' && n !== 0) fails.push(`${key}=${n} expected none`);
    if (kind === 'some' && n < 2) fails.push(`${key}=${n} expected some(>=2)`);
  };
  for (const [k, v] of Object.entries(assert)) {
    if (k === 'ventRate') {
      if (v && (obs.ventRate < v[0] || obs.ventRate > v[1])) fails.push(`ventRate=${obs.ventRate} expected ${v[0]}-${v[1]}`);
    } else if (k === 'pseudofusion') {
      const m = obs.metrics;
      const someIneffective = (m.aPace > m.aCap) || (m.vPace > m.vCap);
      if (v && !someIneffective) fails.push('expected pseudofusion (paces > captures) but every spike captured');
    } else {
      want(k, v);
    }
  }
  return fails;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(String(e.message)));
  page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });

  await page.goto(BASE_URL, { waitUntil: 'load' });
  await sleep(500);

  let passed = 0, failed = 0;
  for (const c of CASES) {
    await configure(page, c.cfg);
    await sleep(SETTLE_MS);
    const obs = await observe(page, CAPTURE_MS);
    const fails = check(c.assert, obs);
    const ok = fails.length === 0;
    ok ? passed++ : failed++;

    console.log(`\n${ok ? '✅ PASS' : '❌ FAIL'}  ${c.name}`);
    console.log(`   expect : ${c.expect}`);
    console.log(`   measured: ventRate=${obs.ventRate}  ` +
      Object.entries(obs.metrics).map(([k, v]) => `${k}:${v}`).join(' '));
    if (!ok) console.log(`   ✗ ${fails.join('; ')}`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`RESULT: ${passed}/${CASES.length} passed, ${failed} failed.`);
  if (jsErrors.length) console.log(`JS ERRORS: ${JSON.stringify([...new Set(jsErrors)])}`);
  else console.log('JS ERRORS: none');

  await browser.close();
  process.exit(failed === 0 && jsErrors.length === 0 ? 0 : 1);
})().catch(e => { console.error('HARNESS FAILED:', e); process.exit(2); });
