# Temporary Transvenous Pacing Simulator: Teaching & Validation Script

**Target:** Junior ICU medical and nursing staff, beginner to advanced
**Device model:** Generic dual-chamber external pulse generator (device-agnostic; controls described generically)
**Dual purpose:** (1) structured teaching script, (2) validation checklist to confirm simulator capabilities

---

## How to use this document

Each scenario has the same skeleton so it doubles as a validation script:

- **Objectives** – what the trainee should be able to do
- **Simulator setup** – exact starting parameters. *If the simulator cannot reproduce these, that is a capability gap.*
- **Vignette** – what you say to the trainee
- **Correct actions** – the reference procedure (also the marking rubric)
- **Expected simulator behaviour** – validation checkpoints (✓)
- **Common errors** – what to watch for
- **Debrief pearls** – teaching points with references

A **simulator capability matrix** at the end maps every scenario to the features it exercises.

---

## Reference block (read before running any scenario)

### Generic control set assumed

| Control | Typical range | Notes |
|---|---|---|
| Rate | 30–180 bpm | Usually set 60–90 |
| Atrial output | 0–20 mA | |
| Ventricular output | 0–25 mA | |
| Atrial sensitivity | 0.5–5 mV | |
| Ventricular sensitivity | 1–10 mV | |
| AV interval | 100–250 ms | 100–200 ms usual |
| Mode | DDD / DDI / VVI / VOO / AOO / DOO | Asynchronous modes = "O" |
| Sense / pace indicators | per chamber | The key feedback the trainee reads |

### Normal / target values

- **Capture threshold:** ideally < 1 mA ventricular. Atrial slightly higher acceptable (atrial leads less stable). *Certainty: high – consistent across Kaplan's/ScienceDirect and Medscape.* [1,2]
- **Output safety margin:** set output at **2–3× capture threshold**. [1,2]
- **Sensitivity (normal sensed signal):** **2–5 mV**. [3]
- **AV delay:** 100–200 ms. [1]

### The sensitivity trap (teach this explicitly, every cohort gets it wrong)

Sensitivity is a **threshold in mV**, not a "how sensitive" dial in plain English. The numbers run backwards from intuition:

- **Lower mV number = MORE sensitive** (device reacts to smaller signals)
- **Higher mV number = LESS sensitive**

So "turning sensitivity down" is ambiguous and banned as a phrase on the unit. Trainees must say either "**more sensitive / lower the mV**" or "**less sensitive / raise the mV**".

- **Undersensing** (missing real beats) → make **more sensitive** → **lower the mV number**. [4]
- **Oversensing** (seeing noise) → make **less sensitive** → **raise the mV number**. [4]

*Certainty: high. Note the terminology in some sources (e.g. "increase sensitivity threshold") is operationally confusing; the mV-direction framing above is unambiguous and is what the trainee should verbalise.* [4]

### Sensing threshold procedure (the manoeuvre trainees fumble)

1. Confirm an intrinsic rhythm is present and faster than the set rate.
2. Set pacing rate **below** the intrinsic rate (so the box is watching, not pacing).
3. Start at a sensitive setting (low mV), confirm the **sense indicator** tracks each intrinsic beat.
4. Progressively **raise the mV** (less sensitive) until the sense indicator stops tracking and the box begins to pace asynchronously.
5. The mV value at which sensing is **just lost** = the **sensing threshold**.
6. Set the working sensitivity to roughly **half that mV** (i.e. more sensitive, a 2:1 margin). [2]

*Certainty: high for the method; the exact safety-margin ratio is convention rather than trial-derived – flagged.*

---

# TIER 1 — BEGINNER: isolate one core skill per scenario

> Design note: each Tier 1 scenario deliberately teaches **one** skill on a stable, non-dependent, cooperative "patient" so the trainee builds the motor pattern before any troubleshooting pressure.

---

## Scenario 1 — Establish pacing dependence & fail safely FIRST

**This is the safety gateway. No threshold testing in any later scenario is permitted until the trainee has done this.**

**Objectives**
- Determine whether the patient has an adequate underlying rhythm before touching thresholds
- Do it without causing haemodynamic compromise

**Simulator setup**
- Mode DDD (or VVI), rate 70, capturing normally
- Underlying rhythm on "reveal": **stable junctional escape ~45 bpm** (i.e. NOT dependent)
- BP stable

**Vignette**
> "Routine morning check. Before you test anything, I want to know: does this patient actually need the pacemaker right now?"

**Correct actions**
- Look at the monitor: is every beat paced? (spike-before-each-QRS)
- **Gradually** reduce rate (or briefly pause pacing if the box allows) while watching the monitor and arterial trace
- Identify the underlying escape rhythm and rate
- Restore pacing promptly
- State conclusion: "Not dependent, stable escape at 45. Safe to threshold test."

**Expected simulator behaviour (✓)**
- ✓ Reducing rate below 45 reveals a junctional escape, not asystole
- ✓ Arterial trace remains perfusing
- ✓ Restoring rate resumes 1:1 capture immediately

**Common errors**
- Abruptly switching the box off instead of down-rating
- Not watching the arterial trace while down-rating
- Forgetting to restore settings

**Debrief pearls**
- Underlying-rhythm assessment is *mechanically* trivial but *clinically* the riskiest routine manoeuvre, because if you'd done it on a **dependent** patient without a plan you'd have induced asystole. Establishing dependence is a prerequisite, not a formality. [1,4]
- Contrast with Scenario 1b.

---

## Scenario 1b — The dependent patient

Same drill, opposite patient. Run it straight after 1 so the contrast lands.

**Simulator setup**
- VVI, rate 70, capturing
- When they inhibit, there's a **long pause** before any escape appears, and what emerges is **slow (sub-20) and late**
- Model **overdrive suppression**, so the escape shows up on its own timeline rather than immediately
- *Requires a PAUSE / inhibit control: the rate dial floors at 30, so down-rating alone cannot reveal an escape this slow.*

**Vignette**
> "Same check, different patient."

**What good looks like**

They wind down, see the pause, recognise the patient is dependent, and **restore the rate promptly** rather than sitting on a pause waiting to see what turns up. They name it: *dependent, escape suppressed and slow.* Then the backup sentence out loud: *if I'm going to test thresholds here, I want pads on, drugs available, and a senior aware, in case something else fails while I'm in the middle of it.*

**Where they trip** — two opposite errors, and both are worth catching:
- **Panicking** at a 10–20 second pause and calling an arrest, when all they need to do is turn the box back up
- Or the reverse: leaving it inhibited too long *"to see the underlying rhythm"* while the escape is still suppressed

**Expected simulator behaviour (✓)**
- ✓ Escape focus arrives **already fully suppressed** (a chronically paced patient)
- ✓ Down-rating to the 30/min floor reveals nothing
- ✓ Holding PAUSE gives a pause of ~15–20 s before the first escape beat
- ✓ What emerges is slow (a few per minute) and takes a minute or two to settle towards ~18
- ✓ Releasing PAUSE **recaptures immediately**

**Debrief**

The point of this scenario is **not** that you might fail to restart pacing. On a working generator with a seated lead, winding the output back up recaptures instantly, essentially every time.

What actually happens is **overdrive suppression**: chronic pacing suppresses the escape focus, so when you inhibit, the escape appears late and slow, sometimes taking a couple of minutes to settle. **The pause you see is longer than the patient's true underlying rhythm, and it ends the moment you pace again.** So don't overreact to the pause, and don't wait it out either. Just restore and move on.

Genuine failure to recapture does happen, but it is **exit block** from hyperkalaemia, acidosis, ischaemia or drugs — and that pathology would have surfaced regardless of your test.

Dependence still dictates how hard you push everything that follows, which is why Scenario 1 comes first — just for a more honest reason than *"the box might not restart."*

---

## Scenario 2 — Ventricular capture threshold

**Objectives**
- Determine ventricular capture threshold
- Set output to a correct safety margin

**Simulator setup**
- Mode VVI, rate set 10 above intrinsic (so every beat is paced), output 5 mA, capturing
- True capture threshold programmed to **1.5 mA**

**Correct actions**
- Confirm 1:1 capture and that paced rate > intrinsic
- Slowly reduce output, watch for the beat where the spike no longer produces a QRS (loss of capture)
- Record threshold = last output that captured
- Set output to **2–3×** threshold

**Expected simulator behaviour (✓)**
- ✓ Capture lost cleanly at 1.5 mA
- ✓ Below threshold: spike present, no QRS, no pulse on art line
- ✓ Above threshold: 1:1 capture returns

**Common errors**
- Reading loss of capture as loss of *output* (spike still there = output fine)
- Setting output only marginally above threshold (no margin)
- Testing at a rate below intrinsic, so intrinsic beats mask loss of capture

**Debrief pearls**
- Threshold ideally < 1 mA; a rising threshold suggests lead-tissue interface problems (fibrosis, oedema, dislodgement). [1,2]
- Distinguish **electrical** capture (QRS on ECG) from **mechanical** capture (pulse on art line/SpO2). Confirm both. [3,5]

---

## Scenario 3 — Ventricular sensing threshold

**Objectives**
- Determine sensing threshold using the correct sequence
- Verbalise sensitivity changes in mV direction, not "up/down"

**Simulator setup**
- Intrinsic ventricular rhythm ~60 bpm, R-wave amplitude modelled at **4 mV**
- Mode VVI, rate set **below** intrinsic (e.g. 40)
- Sensitivity start 2 mV, sense indicator tracking each beat

**Correct actions**
- Confirm rate < intrinsic so box is sensing, not pacing
- Raise the mV number stepwise (less sensitive) until sense indicator stops tracking and asynchronous spikes appear
- Record sensing threshold (mV at which sensing just lost)
- Set working sensitivity to ~half that value

**Expected simulator behaviour (✓)**
- ✓ Sense indicator flashes with each intrinsic R wave while sensitive
- ✓ At ~4 mV the box stops sensing and paces asynchronously (spikes marching into intrinsic beats)
- ✓ Returning to a lower mV restores sensing

**Common errors**
- Leaving rate above intrinsic so there's nothing to sense
- Confusing the sense indicator with the pace indicator
- Saying "turn sensitivity up/down" without specifying mV direction

**Debrief pearls**
- Normal sensed R waves are 2–5 mV; a low-amplitude signal (post-MI, fibrosis) causes undersensing. [3,4]
- The safety margin is convention (roughly 2:1), not trial-derived. Flagged. [2]

---

## Scenario 4 — The integrated daily check

**Objectives**
- Perform a full structured daily pacing review end to end
- Include the atrial channel

**Simulator setup**
- Mode DDD, rate 70, AV 160 ms, A output 8 mA, V output 5 mA, sensitivities set
- All parameters normal; atrial threshold **2 mA**, ventricular threshold **1 mA**
- Intrinsic: sinus ~55 with intact AV conduction (non-dependent)

**Correct actions (structured sequence)**
1. Circuit & connections (patient → leads → correct ports → box → battery)
2. Mode and rate appropriate
3. Establish dependence (Scenario 1 method)
4. Capture threshold both chambers, set 2–3× margin
5. Sensing threshold both chambers, set margin
6. Document all values, confirm final settings, confirm capture restored

**Expected simulator behaviour (✓)**
- ✓ Independent atrial and ventricular threshold testing
- ✓ Atrial threshold higher than ventricular (as set)
- ✓ Correct AV-sequential pacing when both captured
- ✓ Full parameter documentation reflects programmed truth

**Common errors**
- Skipping the circuit/connection check and going straight to numbers
- Testing thresholds before establishing dependence
- Not documenting

**Debrief pearls**
- A **systematic** sequence (circuit → mode → rate → capture → sensitivity) prevents missed faults; this same sequence is the backbone of all troubleshooting later. [4]
- Atrial leads are less stable; a slightly higher/rising atrial threshold is common. [2]

---

# TIER 2 — INTERMEDIATE: basic troubleshooting (each scenario re-tests a Tier 1 skill under fault conditions)

> Design note: the spiral. Every Tier 2 fault can only be diagnosed by **re-running a Tier 1 skill**. The trainee is told the goal is "fix the problem", not "run test X" – they must choose the right test.

---

## Scenario 5 — Failure to capture *(re-tests Scenario 2)*

**Objectives**
- Recognise failure to capture vs failure to output
- Systematically restore capture

**Simulator setup**
- Mode VVI, rate 70, output set 3 mA
- Capture threshold has **risen to 4 mA** (spikes present, no QRS)
- Non-dependent, escape ~40 so patient tolerates it

**Vignette**
> "Nurse calls you: the monitor looks wrong. Sort it out."

**Correct actions**
- Recognise spikes present but no capture = **failure to capture** (not output failure)
- Check/tighten connections, confirm correct port and polarity
- **Re-run capture threshold** → find it has risen to 4 mA
- Increase output to 2–3× new threshold
- Look for reversible causes (electrolytes, ischaemia, drugs, acidosis, post-defib)

**Expected simulator behaviour (✓)**
- ✓ Visible spikes with no following QRS
- ✓ Raising output above 4 mA restores capture
- ✓ Simulator allows a "reversible cause" toggle (e.g. hyperkalaemia) if modelled

**Common errors**
- Calling it output failure (spikes are present → output is fine)
- Cranking output to max without recording the new threshold
- Ignoring the reversible-cause search

**Debrief pearls**
- Causes: mechanical (dislodgement, loose connection, low output) first; then fibrosis, MI, electrolyte imbalance, post-defibrillation, drugs (flecainide, sotalol, beta-blockers, lignocaine, verapamil). [4]
- In bipolar leads the negative electrode fibroses first; reversing leads or converting to unipolar can recapture. [4,6]

---

## Scenario 6 — Undersensing *(re-tests Scenario 3)*

**Objectives**
- Recognise undersensing on the ECG
- Correct it via the sensing threshold

**Simulator setup**
- Mode VVI, rate 50, sensitivity set too **high in mV** (too insensitive, e.g. 6 mV)
- Intrinsic R waves 3 mV → box can't see them
- Result: pacing spikes land inappropriately soon after intrinsic QRS

**Vignette**
> "Something's off with how the pacemaker is behaving around the patient's own beats."

**Correct actions**
- Recognise spikes falling too soon after intrinsic beats (ignoring native activity) = **undersensing**
- **Re-run sensing threshold**
- Make box **more sensitive → lower the mV** below the R-wave amplitude, with margin
- Confirm the box now inhibits appropriately on intrinsic beats

**Expected simulator behaviour (✓)**
- ✓ Spikes marching into/after native QRS while insensitive
- ✓ Lowering mV restores appropriate inhibition (demand behaviour)
- ✓ Sense indicator resumes tracking

**Common errors**
- Confusing undersensing with failure to capture
- Adjusting the wrong direction (raising mV, making it worse)
- Forgetting the R on T / competition risk

**Debrief pearls**
- Undersensing → overpacing, with risk of a spike on T and induced arrhythmia. [4,7]
- Causes: sensitivity set too insensitive, low signal amplitude, lead problem, electrolyte disturbance. [7]

---

## Scenario 7 — Oversensing causing inhibition *(re-tests Scenarios 1 & 3)*

**Objectives**
- Recognise oversensing as a cause of inappropriate pacing pauses
- Correct sensitivity and confirm the patient's safety net

**Simulator setup**
- Mode VVI, rate 60, sensitivity set too **low in mV** (too sensitive, e.g. 0.8 mV)
- Simulator injects oversensed signal (T waves or "muscle activity" artefact) → inappropriate inhibition → pauses
- Underlying rhythm slow (~40) so pauses are symptomatic

**Vignette**
> "Monitor shows intermittent long pauses. The output seems to keep cutting out."

**Correct actions**
- Recognise pauses = inhibition, and that **no spike appears** during them (output being withheld, not failing)
- Identify oversensing (device fooled into thinking there's native activity)
- Make box **less sensitive → raise the mV**
- Re-establish underlying rhythm safety (Scenario 1) — is the patient safe during pauses?
- Consider asynchronous mode (VOO) as a temporising bridge if unstable

**Expected simulator behaviour (✓)**
- ✓ Inappropriate inhibition/pauses with no output during oversensed events
- ✓ Raising mV abolishes the inhibition
- ✓ Switching to VOO paces regardless of sensed noise (validates asynchronous mode)

**Common errors**
- Treating pauses as output failure and chasing connections first
- Raising output (irrelevant to a sensing problem)
- Forgetting that VOO removes protection against R-on-T (only a bridge)

**Debrief pearls**
- Oversensed signals: large P or T waves, skeletal muscle activity, lead contact problems, external EMI. [4]
- Asynchronous mode defeats oversensing but paces blind to intrinsic beats — bridge only. [4]

---

## Scenario 8 — Output failure / no spikes *(re-tests circuit check + Scenario 1)*

**Objectives**
- Recognise true output failure (spikes absent)
- Work the circuit systematically and deploy a backup

**Simulator setup**
- Mode VVI, rate 70; a **loose connection / cable fault** injected → no pacing output at all, spikes absent
- Underlying rhythm ~35, symptomatic

**Vignette**
> "The pacemaker's not doing anything and the patient's heart rate is 35."

**Correct actions**
- Recognise **absent spikes** = output failure (distinct from failure to capture)
- Work patient → lead → ports → cable → box → battery
- Increase output to max, connect box directly to lead if cable suspect
- Switch to asynchronous mode if oversensing suspected as cause
- **Prepare transcutaneous pacing and chronotropes** while fixing

**Expected simulator behaviour (✓)**
- ✓ No spikes on ECG
- ✓ Correcting the injected fault restores output
- ✓ Max output (e.g. 20 mA A / 25 mA V) selectable
- ✓ Direct-to-lead / asynchronous options available

**Common errors**
- Confusing with failure to capture (there, spikes are present)
- No backup plan while troubleshooting
- Not checking the battery

**Debrief pearls**
- Output-failure causes: lead malfunction, unstable connection, insufficient power, cross-talk inhibition, oversensing. [4]
- Standard rescue sequence: power/battery/connections → max output → asynchronous mode → direct-to-lead → transcutaneous → CPR + chronotropes. [4]

---

# TIER 3 — ADVANCED: integrated, time-pressured, high-stakes

> Design note: Tier 3 scenarios are deliberately dependent patients and/or dual-chamber faults. Every one forces the trainee to spiral back through **multiple** Tier 1 skills under pressure, plus recognise a named syndrome.

---

## Scenario 9 — Lead displacement dysrhythmia *(spirals Scenarios 1, 2)*

**Objectives**
- Recognise intermittent capture + ectopy from a migrating lead
- Manage a mechanically unstable lead

**Simulator setup**
- Mode VVI, rate 70
- Intermittent capture: runs of capture alternating with failure to capture + **ventricular ectopics / short VT**
- Position-dependent: a "reposition/roll" input transiently improves capture

**Vignette**
> "Intermittent capture and now she's throwing ventricular ectopics. Rate's unreliable."

**Correct actions**
- Recognise intermittent capture + VE/VT pattern → **lead displacement**
- Re-check threshold (will be erratic/high)
- Try patient repositioning; increase output; consider reverse/unipolar
- Recognise this is a mechanical problem needing **lead repositioning/refloat**, escalate
- Prepare transcutaneous backup

**Expected simulator behaviour (✓)**
- ✓ Beat-to-beat variable capture
- ✓ Ectopy/VT triggered by the floating lead
- ✓ Positional input transiently changes capture
- ✓ QRS morphology change option (LBBB→RBBB) to flag septal perforation

**Common errors**
- Chasing sensitivity when the problem is mechanical
- Not escalating for definitive lead management
- Missing the perforation clue (morphology change)

**Debrief pearls**
- A dislodged wire "tickles" the RV → ectopy/VT alternating with capture failure. [4]
- Paced-QRS morphology shift from LBBB to RBBB suggests septal perforation into the LV; get a CXR and escalate. [4]

---

## Scenario 10 — Cross-talk → ventricular standstill in DDD *(spirals Scenarios 1, 3, 8; dependent patient)*

**Objectives**
- Recognise cross-talk inhibiting ventricular output
- Rescue a dependent patient fast

**Simulator setup**
- Mode DDD, rate 60, patient **pacing dependent**
- Ventricular channel over-sensitive → **atrial spike sensed by ventricular channel** → ventricular output inhibited → ventricular standstill

**Vignette**
> "Dual-chamber box, patient's dependent, and the ventricle has gone quiet. Move."

**Correct actions**
- Recognise atrial pacing present but ventricular output inhibited = **cross-talk**
- Immediate rescue: increase ventricular output and/or switch to asynchronous (DOO/VOO) to guarantee ventricular pacing
- Then correct: make ventricular channel **less sensitive → raise mV**, and/or reduce atrial output
- Confirm restored AV-sequential capture

**Expected simulator behaviour (✓)**
- ✓ Atrial spikes present, ventricular output inhibited, ventricular standstill
- ✓ Asynchronous mode immediately restores ventricular pacing
- ✓ Adjusting V-sensitivity (raise mV) or A-output fixes root cause
- ✓ Haemodynamic collapse modelled during standstill (dependent)

**Common errors**
- Freezing on diagnosis instead of securing output first (pace first, diagnose second in a dependent patient)
- Raising sensitivity (wrong direction)
- Not recognising the dependent-patient time pressure

**Debrief pearls**
- Cross-talk: atrial spike misread as a ventricular depolarisation, inhibiting ventricular output → ventricular standstill. Fix by reducing sensitivity of the ventricular channel and/or atrial output. [4]
- **Secure output first, refine settings second** when the patient is dependent. [1,4]

---

## Scenario 11 — Pacemaker-mediated tachycardia *(spirals Scenario 3, advanced sensing)*

**Objectives**
- Recognise PMT / endless-loop tachycardia
- Terminate it and prevent recurrence

**Simulator setup**
- Mode DDD, rate limit 160
- Retrograde VA conduction modelled → retrograde P sensed as native atrial activity → triggers ventricular pacing → endless loop
- Paced tachycardia at the upper rate limit

**Vignette**
> "Dual-chamber patient, suddenly paced at 160 and stuck there."

**Correct actions**
- Recognise a paced tachycardia capped at the programmed upper rate = **PMT**
- Terminate: apply magnet (→ asynchronous) or switch to a non-tracking mode (VVI/DVI/DDI)
- Prevent recurrence: extend PVARP; consider adenosine to break retrograde conduction
- Accept AV-synchrony trade-off if switching modes

**Expected simulator behaviour (✓)**
- ✓ Paced tachycardia at exactly the upper rate limit
- ✓ Magnet/asynchronous mode terminates it
- ✓ Mode switch to VVI/DVI/DDI terminates it
- ✓ PVARP adjustment prevents re-initiation

**Common errors**
- Treating as a primary tachyarrhythmia rather than a pacing loop
- Not recognising the upper-rate-limit ceiling as the clue
- Losing AV synchrony without realising the trade-off

**Debrief pearls**
- PMT: retrograde P wave sensed as native atrial activity drives repeated ventricular pacing; rate is capped at the programmed maximum. [4]
- Break the loop with magnet/asynchronous or non-tracking mode; extend PVARP to prevent recurrence. [4]

---

## Scenario 12 — Rising threshold to loss of capture in a dependent patient *(spirals ALL Tier 1 skills under crisis)*

**Objectives**
- Integrate the full skill set under genuine time pressure
- Prioritise: secure output, then diagnose, then correct reversible causes

**Simulator setup**
- Mode VVI, rate 70, output 5 mA, patient **dependent** (no escape)
- Threshold **rising in real time** (e.g. hyperkalaemia toggle) from 1 → 3 → 6 mA over the scenario
- Progresses toward capture loss if not acted on

**Vignette**
> "Dependent patient, and capture is starting to drop out. Clock's running."

**Correct actions**
- Recognise intermittent then progressive failure to capture
- **Immediately raise output** to restore capture (buy time)
- Confirm connections, correct port/polarity
- Search reversible causes: hyperkalaemia, acidosis, ischaemia, drugs
- Get transcutaneous pads on, senior called, drugs ready
- Treat the cause (e.g. hyperkalaemia) while maintaining capture; re-establish a safe margin

**Expected simulator behaviour (✓)**
- ✓ Threshold rises dynamically during the scenario
- ✓ Raising output re-captures at each step until ceiling
- ✓ Reversible-cause toggle (treating it lowers threshold again)
- ✓ Haemodynamic collapse if capture lost in a dependent patient
- ✓ Transcutaneous backup pathway available

**Common errors**
- Diagnosing before securing output in a dependent patient
- Reaching max output with no backup and no cause search
- Not re-testing/re-documenting the new threshold and margin once stable

**Debrief pearls**
- Reversible threshold-raising causes: hypoxia, acidosis, class I antiarrhythmics, electrolyte abnormality. Treat the cause while temporarily increasing output. [2]
- The crisis drill = the daily check, compressed: secure output → circuit → cause → margin, all the Tier 1 skills at speed. [1,2,4]

---

# Simulator capability matrix (validation checklist)

Use this to confirm the simulator can render every required behaviour. A gap here = a scenario the simulator cannot yet support.

| Capability | Scenarios exercising it |
|---|---|
| Adjustable rate with down-rating to reveal underlying rhythm | 1, 1b, 4, 12 |
| Programmable underlying/escape rhythm (junctional, asystole, sinus) | 1, 1b, 7, 8, 12 |
| Pacing-dependence modelling (asystole on capture loss) | 1b, 10, 12 |
| Independent A & V capture thresholds | 2, 4, 5, 9, 12 |
| Static + dynamically rising thresholds | 5, 12 |
| Electrical vs mechanical capture (ECG + arterial/SpO2) | 2, 5, 9 |
| Sense/pace indicators per chamber | 3, 6, 7, 10 |
| Programmable intrinsic signal amplitude (mV) | 3, 6 |
| Undersensing behaviour | 6 |
| Oversensing / injected noise (T wave, muscle, EMI) | 7, 10 |
| Output failure (absent spikes) vs failure to capture (spikes present) | 5, 8 |
| Circuit/connection/cable fault injection | 5, 8 |
| Asynchronous modes (VOO/DOO/AOO) | 7, 8, 10, 11 |
| Cross-talk in DDD | 10 |
| Lead displacement (intermittent capture + ectopy/VT, positional) | 9 |
| Paced-QRS morphology change (perforation) | 9 |
| Pacemaker-mediated tachycardia + magnet + PVARP | 11 |
| Reversible-cause toggles (e.g. hyperkalaemia) | 5, 12 |
| Haemodynamic coupling (art line responds to capture/rate) | 1, 1b, 7, 10, 12 |
| Transcutaneous backup pathway | 1b, 8, 9, 12 |

---

# References

1. Hensley N, Rozner MA, et al. Temporary pacing. In: *Kaplan's Essentials of Cardiac Anesthesia*, 2nd ed, 2018 (via ScienceDirect Topics: Transvenous Pacing). Capture threshold < 1 mA, output at 3× threshold, AV delay 100–200 ms. *Textbook chapter; standard reference.*
2. Medscape / eMedicine. *Transvenous Cardiac Pacing Technique* (Ludhwani D et al.; last update 2021). Output 2–3× threshold; sensing threshold method; reversible threshold-raising causes. *Reference article.*
3. Nickson C. *Temporary Pacemaker Troubleshooting.* LITFL CCC (rev. 2023). Normal sensitivity 2–5 mV; systematic review approach; max outputs. *FOAMed, CICM-standard educational resource.*
4. Nickson C, LITFL (as above) + ecgwaves.com *Assessment of Pacemaker Malfunction* (2025). Full malfunction taxonomy: failure to pace/capture, over/undersensing, cross-talk, PMT, lead displacement, runaway. *FOAMed; taxonomy consistent across both.*
5. ems12lead / ECG Stampede — electrical vs mechanical capture and false capture. *FOAMed; corroborative.*
6. Yartsev A. *A brief guide to troubleshooting the pacemaker circuit.* Deranged Physiology (2024). Reverse-lead/unipolar conversion; capture-threshold method. *CICM exam-oriented FOAMed.*
7. Nayak HM et al. *Pacemaker Troubleshooting: Common Clinical Scenarios.* PMC5067035. Causes of under/oversensing. *Peer-reviewed.*

**Landmark practical review (recommended primary reading for faculty):**
- Reade MC. *Temporary epicardial pacing after cardiac surgery: a practical review. Part 2: Selection of epicardial pacing modes and troubleshooting.* Anaesthesia. 2007;62(4):364–73. PMID 17381573. *Concerns epicardial pacing specifically, but the troubleshooting logic (capture, sensing, mode selection, cross-talk) transfers directly to transvenous. Certainty on citation: high (title, journal, year, PMID verified from LITFL reference list, not independently re-confirmed against PubMed).*

---

## Certainty & caveats (per your standing preference)

- **High certainty:** the procedures (threshold testing, sensing testing, troubleshooting taxonomy, mV-direction logic) and the normal-value ranges. These are consistent across multiple CICM-standard sources.
- **Convention, not trial-derived:** the exact safety-margin ratios (2–3× output; ~2:1 sensing). Flagged in-text. No RCT defines these; they are expert-consensus/textbook.
- **Device-dependent:** exact mA/mV ranges, control layout, and indicator behaviour vary by generator. All values here are generic; confirm against your specific device manual before finalising simulator defaults.
- **Not independently re-verified:** the Reade 2007 citation details were taken from the LITFL reference list, not re-pulled from PubMed. Title/year/PMID stated as "high confidence, not re-confirmed".
- **Scope note:** this is transvenous. If you later add an epicardial module, the atrial-wire behaviour, unipolar/bipolar options, and post-cardiac-surgery specifics differ and would need their own scenarios.
