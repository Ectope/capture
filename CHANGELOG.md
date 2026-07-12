# Changelog — Temporary Pacing Simulator

All changes below are to `index.html` (the file Flask serves) unless noted.

---

# 2026-07-12 (v2026-07-12.6) — Add and link the instructor guide

New `tvp_instructor_guide.md`: a simplified instructor-facing version of the
teaching script, with the simulator setup values and validation checks taken
out. The in-app links (top of the Teaching panel, and the footer) point at
it rather than the full simulator script, which stays in the repo for
development and validation use.

---

# 2026-07-12 (v2026-07-12.5) — Link the teaching guide from the app

The teaching guide (`tvp_simulator_script.md`) was only findable by people
who know their way around a GitHub repository. It is now linked from the
top of the Teaching panel ("📖 Teaching guide — full script and marking
rubrics for these scenarios") and from the footer next to the source link.

---

# 2026-07-12 (v2026-07-12.4) — Scenarios lead with the brief alone

The objectives list no longer prints under the vignette. A printed objective
is a prompt that answers the question being asked ("decide whether this
patient has an adequate underlying rhythm" hands over the whole task). The
trainee now leads from the brief alone; the objectives moved into the
collapsed instructor pane — which now always appears, even for scenarios
with no clinical actions — for the instructor to voice as needed.

---

# 2026-07-12 (v2026-07-12.3) — Freeze key on the monitor

Hold-to-freeze button in the monitor header, following the same
hold-not-toggle contract as the pacemaker's PAUSE key: holding stills both
traces so an interval can be measured or a spike pointed at; the patient,
the pacemaker and the numerics run on underneath, exactly like the freeze
key on a bedside monitor. Releasing — or leaving the button, or the window
losing focus — snaps the display back to live.

---

# 2026-07-12 (v2026-07-12.2) — Fix: controls could disagree with the simulation after reload

On reload the browser restores every form control's last value (rhythm menu,
lead checkboxes, sliders), but the simulation always boots from its JS
defaults — so the menu could say Complete Heart Block while the patient was
in sinus at 80. `syncControlsToState()` now also covers the rhythm menu and
runs at boot and on `pageshow`, so the controls always show what the box is
actually doing.

---

# 2026-07-12 — Layout compaction and user-testing plumbing

Preparation for putting the simulator in front of testers.

- **Header in one row.** Title and subtitle left-justified, Sandbox/Teaching
  tabs on the right of the same row; the disclaimer moved to the empty space
  under the patient monitor (still always visible, still not dismissible).
  Together this stops the controls scrolling off a laptop screen.
- **Visible version stamp** (`v2026-07-12`, in the footer) so feedback can be
  tied to the build the tester actually saw. Bump it on every push.
- **Feedback email pre-fill.** Clicking the QR now pre-fills the email body
  with the version, active tab (and scenario, if one is running) and the
  pacer's dial positions. The QR pattern itself still encodes the bare
  address, so scanning from a phone is unchanged. Footer caption now reads
  "Click or scan for feedback, bugs, errors".

---

# 2026-07-12 — Scenario 1b rewritten: overdrive suppression

Scenario 1b was honest about *dependence* but dishonest about *why it matters*. It
modelled the dependent patient as simply having no escape focus, so inhibiting
produced flat asystole. That teaches the wrong fear.

The rewrite models what actually happens.

## Physiology: overdrive suppression
- **`escape.overdriveSuppression`** — an escape focus that has been overdriven by
  chronic pacing does not switch on the moment you stop pacing. Its automaticity
  is suppressed, so the first escape beat comes **late** (~15–20 s), the beats
  after it come **very slowly** (a few per minute), and the focus takes a minute
  or two to wake up towards its own rate. Recovery begins the instant the
  overdrive stops; every non-escape beat re-suppresses it. A chronically paced
  patient therefore *arrives* with the focus already fully suppressed — which is
  the state the trainee inherits, and the reason the pause looks how it does.
- Tunable per focus (`suppressionFactor`, `suppressionRecovery`) and **opt-in**, so
  Scenario 1's prompt, stable junctional escape at 45 is unchanged — which is
  exactly the contrast the pair of scenarios exists to draw.

## Device: a PAUSE key
The rate dial floors at 30/min, so a suppressed 18/min escape could never have
been revealed by down-rating — the manoeuvre the scenario asks for was literally
impossible on this box. Added a **hold-to-inhibit PAUSE key**: output is withheld
while held, sensing continues, and releasing restores pacing on the next cycle.

Deliberately a *hold*, not a toggle. Letting go — or moving the pointer off it, or
the window losing focus — restores pacing, so a trainee cannot accidentally leave
a dependent patient inhibited. The mode badge reads PAUSED while held.

## The teaching point that changed
The old scenario implied the danger is *"the box might not restart."* It isn't. On
a working generator with a seated lead, recapture is essentially immediate, every
time. The real phenomenon is that **the pause is longer and uglier than the
patient's true underlying rhythm, and it ends the moment you pace again** — so the
two errors to catch are *panicking at the pause* and *waiting it out*. Genuine
failure to recapture is exit block (hyperkalaemia, acidosis, ischaemia, drugs),
and that pathology would have surfaced regardless of the test.

Dependence still dictates how hard you push everything downstream — just for an
honest reason.

`tvp_simulator_script.md` updated to match. Suite now 113 checks, all passing;
the new ones assert the pause length, the slowness of what emerges, the recovery
towards ~18/min if left inhibited, and immediate recapture on release.

---

# 2026-07-11 — Teaching mode (Phase 3: Tier 3 scenarios) — script complete

Adds scenarios 9–12. **Every scenario in `tvp_simulator_script.md` is now
implemented**, and every "Expected simulator behaviour (✓)" checkpoint in the
script runs as an automated assertion. 101 checks, all passing.

Scenario 12 — the threshold that rises in real time, which was the original
motivating question — needed **no engine work at all**. It is three `timeline`
entries. That was the whole point of the Phase 1 architecture.

## Physiology: six new patient properties
- **`thresholdJitter`** (mA) — beat-to-beat variation in the capture threshold. A
  lead resting against myocardium has none; a floating lead has a lot. This is
  why a displaced lead shows *intermittent* capture rather than none, and (at a
  smaller amplitude) why a rising threshold announces itself as intermittent
  capture before it becomes total loss of capture.
- **`ectopyRate`** (per min) — ventricular ectopics and short runs of VT from a
  lead mechanically irritating the endocardium. Deliberately *mechanical*: no
  setting on the front panel can hold a lead still, and the tests assert exactly
  that (a high output restores capture and does nothing whatever to the ectopy).
- **`pacedQrs`** (`'lbbb' | 'rbbb'`) — paced-QRS morphology. RV apical pacing gives
  LBBB; a flip to RBBB means the stimulus now arises from the *left* ventricle,
  i.e. the lead has perforated the septum. New waveform, and the T wave flips
  with it (discordant repolarisation).
- **`crosstalkGain`** (mV per mA) — far-field signal from the *atrial* stimulus
  seen by the *ventricular* sense amplifier. It arrives at 30 ms, just outside
  the 20 ms post-atrial-pace ventricular blanking, which is precisely how
  cross-talk happens in a real device. Because it scales with atrial output,
  both textbook cures work and both are tested: raise the V sensitivity in mV,
  or turn the atrial output down.
- **`retrogradeVA`** (ms) — ventriculo-atrial conduction. Antegrade block does not
  imply retrograde block. Produces an inverted P the atrial channel cannot
  distinguish from a native one — the engine of PMT.
- **`transcutaneous`** (bool) — external backup at 60/min that always captures,
  set below the transvenous rate so it only fires when the transvenous system
  fails.

## Device: two new dials
- **Upper rate limit** (100–180, default 160) — caps *tracked* ventricular pacing.
  This is the ceiling that makes a PMT sit at exactly the programmed number.
  Turning it down and watching the tachycardia obediently follow is a free proof
  that the tachycardia belongs to the box, not the patient — and it's a test.
- **PVARP** (150–500 ms, default 300) — was a fixed constant. It decides whether a
  retrograde P is seen and tracked, which is to say it decides whether PMT is
  possible at all. Extending it past the VA conduction time is the definitive cure.

## Determinism
Jitter and ectopy need randomness, but a scenario that behaves differently every
run cannot be validated or used to assess two trainees fairly. A seeded PRNG,
re-seeded identically at every scenario start, gives a rhythm that looks
irregular and replays exactly. The test suite asserts byte-identical output
across runs.

## Scenario engine: clinical actions
The timeline became a general **patch queue**, and scenarios can now declare
`actions` — interventions that are *not* dials on the box (roll the patient, put
the pads on, treat the potassium). Their effects schedule into the same queue, so
a treatment that takes 30 s to work and a disease that progresses on its own are
the same mechanism. An action may `cancelTimeline`, which is how "treating the
cause" stops the deterioration — and nothing else does.

## Scenarios
- **9 — Lead displacement**: jittery threshold + ectopy from one cause. Repositioning
  transiently helps (proving it's positional); a high output buys capture and does
  nothing for the ectopy. At 75 s the paced QRS flips LBBB→RBBB: septal perforation.
- **10 — Cross-talk → ventricular standstill**: dependent patient, atrial spikes
  capturing, ventricle silent. Teaches *secure output first, diagnose second* —
  ASYNC rescues instantly; the V output dial does nothing.
- **11 — PMT**: paced tachycardia locked to the upper rate limit. Terminated by
  ASYNC or a non-tracking mode; *prevented* only by extending PVARP.
- **12 — Rising threshold, dependent**: 1 → 3 → 5 → 7 mA in real time. Intermittent
  capture is the warning; asystole is the consequence. Pads carry the patient;
  treating the hyperkalaemia is the only thing that actually reverses it.

---

# 2026-07-11 — Teaching mode (Phase 2: Tier 2 scenarios)

Adds scenarios 5–8 (failure to capture, undersensing, oversensing, output
failure). Scenarios 5 and 6 needed no engine work at all — they are pure data on
the Phase 1 patient model, which is the payoff from that refactor. Scenarios 7
and 8 needed one new patient property each.

## Physiology: two new patient properties
- **`patient.noise`** = `{channel, amplitude (mV), rate/min}` — the substrate for
  **oversensing**. A real signal on the wire that is *not* a depolarisation: it
  moves no myocardium and makes no pulse. The device is fooled when the
  sensitivity number is at or below the *noise* amplitude — which is a smaller
  signal than the real R wave, so there is a window (above the noise, below the
  R wave) in which the box ignores the artefact but still sees genuine beats.
  Finding that window is the exercise. The artefact is drawn on the ECG whether
  or not the device reacts to it: raising the mV does not stop the noise, it
  stops the box *believing* it.
- **`patient.connectionFault`** = `'A' | 'V' | 'both'` — the substrate for
  **output failure**. A broken circuit between generator and myocardium. The box
  goes on running its cycles and its PACE LED goes on flashing, but no spike
  reaches the patient, nothing comes back, and that channel cannot sense. This is
  what separates output failure (spikes *absent*) from failure to capture (spikes
  *present* but ineffective). Neither raising the output nor an asynchronous mode
  can push current through a fractured cable — only re-seating the connection.

Both are listed as `null` in `PATIENT_DEFAULTS`, so both front doors (scenario
start and the sandbox rhythm menu) reset them and a fault cannot leak into the
next scenario. There is a regression test for exactly that.

## Device: the ASYNC switch
- New **Async** switch on the device header: DDD→DOO, VVI→VOO, AAI→AOO. The box
  stops listening and paces blind on its timers. This *defeats oversensing* (a
  box that senses nothing cannot be fooled by noise), does *not* fix a broken
  circuit, and removes all protection against R-on-T — a bridge, never a
  destination. Scenarios 7 and 8 both turn on whether the trainee knows which of
  those three things is true. The engine already supported DOO/VOO; there was no
  control for them, and AOO was missing.
- The **lead switches are now the circuit**: re-connecting a lead re-seats that
  channel's connector and clears a connection fault on it. That is the fix for
  Scenario 8, and it is deliberately the *only* fix.

## Scenarios
- **5 — Failure to capture**: threshold risen to 4 mA with the output still at 3.
  Spikes present, nothing captured, escape at 40 carrying the patient.
- **6 — Undersensing**: R wave of only 3 mV (a small signal — infarct, fibrosis)
  with the box set at 6 mV, so it is blind and paces through a perfectly good
  intrinsic rhythm at 75. Some blind spikes capture: competitive pacing, R-on-T.
- **7 — Oversensing**: a 1.5 mV artefact with the box at 0.5 mV. Pauses with no
  spike in them; the patient falls back to an escape of 40. The sense LED
  flashing to nothing is the clue.
- **8 — Output failure**: fractured V cable. Not one spike, patient on an escape
  of 35 — but the pace LED still flashes at 70. Believe the ECG, not the LED.

## Testing
- `test_scenarios.js` extended to 64 checks, all passing. Tier 2's assertions
  deliberately include the *wrong* actions as well as the right ones — turning
  the output up during oversensing, raising the mV during undersensing, reaching
  for ASYNC during a cable fault — so the simulator is verified to be
  unforgiving in the same places the trainee is.

---

# 2026-07-11 — Teaching mode (Phase 1: Tier 1 scenarios)

Adds a scenario system alongside the existing sandbox, per
`tvp_simulator_script.md`. Tier 1 (scenarios 1, 1b, 2, 3, 4) is implemented;
Tiers 2 and 3 are additive from here.

## Architecture: the patient became an object
- The patient's ground truth — capture thresholds, sensed signal amplitudes,
  rhythm, escape focus — moved out of the frozen `CONFIG` constants into a
  mutable `patient` object that the physics engine reads each tick. Device
  timing constants (PVARP, blanking, refractory windows) stay in `CONFIG`,
  because they belong to the box, not the patient.
- The sandbox rhythm menu and the teaching scenarios are now two front doors
  writing into that one object, so there is no forked simulation path.
- **A scenario is data, not code**: `deviceSetup` (how the box is found),
  `patientSetup` (the truth to be discovered), and `timeline` (patches applied
  to the patient N ms after the scenario starts). A static scenario is just one
  whose timeline is empty — so the time-varying scenarios of Tier 3 need no new
  machinery, only data. Timeline entries are keyed to a scenario clock, not the
  wall clock, so a scenario is reproducible.

## Physiology
- **Escape focus is now first-class and independent of AV conduction**:
  `{focus: 'junctional' | 'ventricular', rate}`, or `null`. Junctional escape
  (narrow QRS, no P) is new and is what makes Scenario 1 possible. `escape:
  null` models the pacing-dependent patient — lose capture and there is nothing
  underneath.
- **Fixed**: a ventricular pace cancelled an in-flight conducted QRS even when
  it failed to capture, which falsely flattened the trace during loss of
  capture. The conducted beat is no longer cancelled; if the pace captures, the
  beat is blocked by the refractory check anyway, and if it does not, the
  conducted QRS correctly still arrives. This is exactly what loss of capture
  looks like in a patient with intact AV conduction.

## Device
- **AV interval is now operator-programmable** (100–250 ms, default 200), which
  the training script's control set requires and Scenario 4 depends on. Was
  hard-coded PAV 200 / SAV 180; the sensed AV interval now derives as
  `AV − 20 ms`, preserving the previous defaults exactly. Setting the AV
  interval longer than the patient's PR lets the conducted beat arrive first and
  inhibit the pace — the manoeuvre that unmasks intact AV conduction.

## UI
- Sandbox / Teaching tabs. In teaching mode the rhythm menu is hidden (the
  trainee must infer the rhythm from the device), and the panel shows the
  vignette, the objectives, a scenario clock, and an instructor-only debrief.
- Returning to the sandbox restores a normal patient, so a scenario's
  abnormality cannot leak out.

## Testing
- New `test_scenarios.js`: runs each scenario's "Expected simulator behaviour
  (✓)" checkpoints from the teaching script as machine-checkable assertions. It
  extracts the engine from `index.html` and drives it in a Node VM against the
  internal cardiac event stream — no browser, no server, no dependencies.
  `node test_scenarios.js`. 33 checks, all passing.
- `test_pacing_behaviour.js` (Playwright, sandbox matrix) updated: setting
  `state.rhythm` no longer changes the rhythm on its own, so it now calls
  `applyRhythmPreset()` to write through to the patient.

## Known gaps (for later phases)
- Scenario 4's "establish dependence by down-rating" does not work in DDD when
  the AV interval is shorter than the patient's PR: the box goes on tracking the
  atrium and pacing the ventricle. This is correct device behaviour, not a bug,
  and the debrief now teaches the AV-lengthening manoeuvre instead. Worth
  knowing before writing Tier 3's DDD scenarios.
- DDD uses atrial-based lower-rate timing rather than a true ventricular-based
  atrial escape interval (AEI = LRI − AVI). This is invisible in every scenario
  so far, but Scenario 10 (cross-talk in a dependent patient) will need it.
- No "pause pacing" control. Scenario 1 mentions it as an alternative to
  down-rating; down-rating alone is sufficient for the current scenarios.

---

# 2026-07-02 — Earlier work

## Startup crashes (buttons/controls dead)
- Declared missing `ventEventTimes` and `lastEventWasAtrialPace`; removed a
  reference to a non-existent `modeDisplay` element. The script had been
  throwing before the sim loop started, so nothing responded.
- Added `updateDisplay()` to the animation loop; aligned initial rhythm with
  the dropdown default.

## Simulation engine rewrite (event-driven state machine)
- Replaced the rate-plus-inhibition model with a unified "chamber activation"
  engine: native impulses and captured paces both activate tissue and reset
  that chamber's timers.
- Overdrive suppression (no stray native beat after a pace) and proper demand
  inhibition (a conducted QRS cancels the pending ventricular pace).
- ABP: now a held systolic/diastolic (peak/trough over recent beats) instead
  of tracking the instantaneous waveform.
- ECG timebase: advances in real time via a wall-clock accumulator (was ~1.8x).
- SAV/PAV set above the native PR so intact conduction inhibits V pacing.
- Atrial-based lower-rate timing → paced rate is now exact (set 60 = 60 bpm).
- An uncaptured pace no longer resets the escape focus (escape rhythm now
  emerges during loss of capture).

## ECG display
- Calibrated the sweep to a true 25 mm/s; background is now ECG graph paper
  (1 mm minor / 5 mm major boxes = 0.2 s).
- Removed the flat buffer pre-fill (clean startup, correct ABP immediately).

## Waveform morphology
- Added T waves: upright for native/conducted beats, discordant (inverted)
  for wide paced beats.
- Fixed a spurious pre-systolic bump on the arterial trace (pre-ejection now
  holds at diastole; upstroke rises cleanly to the systolic peak).
- Rate-corrected QT (Bazett): T-wave timing scales with the preceding R-R, so
  QT shortens with rate and no longer collides with the next complex
  (false R-on-T). QTc ~420 ms at rest.

## Physiology / rhythms
- Asystole now models sinus arrest with intact AV conduction, so atrial
  (AAI/DDD) pacing conducts and restores output. (AV-block case remains CHB.)
- Added a myocardial refractory period against capture: a spike on refractory
  tissue is ineffective (pseudofusion) rather than wrongly re-capturing.
  (Surfaced by the test harness in competitive-pacing cases.)
- AV conduction is now gated at the P wave, not just at QRS firing: a native P
  arriving within the AV-node refractory period after a ventricular event
  (retrograde concealment) is blocked, so a conducted beat can no longer appear
  in the refractory period just after a paced beat (seen in VVI near the
  intrinsic rate).

## Teaching UX
- Removed all diagnostic alert banners ("V lead disconnected", "Failure to
  capture", "Undersensing", etc.) — recognising these from the traces is the
  learning objective. LEDs and vitals retained.
- Pacing spikes now render as distinct white marker ticks (visible even with
  no capture), sized small and grid-relative: atrial ~1.25 mm, ventricular
  ~1.67 mm (tunable via `SPIKE_ATRIAL_MM` / `SPIKE_VENT_MM`).

## Testing
- Added `test_pacing_behaviour.js`: a Playwright harness that drives the app
  and asserts on the internal event stream. 19 cases covering every rhythm ×
  mode plus loss of capture, undersensing, and pseudofusion. All passing.

## Known / not addressed
- No mode selector in the UI (only DDD, demoted via lead switches); the test
  harness sets modes programmatically to reach AAI/VVI/DOO/VOO.
- Advanced spec behaviours not yet modelled: VSP/crosstalk, pseudo-Wenckebach
  / upper-rate 2:1, PMT, true fusion morphology.
- `templates/index.html` is stale/unused dead code (Flask serves the root
  `index.html`).
