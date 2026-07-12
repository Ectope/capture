# Temporary Transvenous Pacing: Instructor Guide

A simulator-based teaching pack for junior ICU staff. Twelve scenariosbuilt to run in order to take a novice through basic to intermediate checks and scenarios. The early scenarios teach one skill at a time. The later ones break things, and the only way to fix them is to go back and use a skill you learned earlier. That repetition is the point, so resist the urge to skip the "easy" ones.

Device is a generic dual-chamber external generator. Controls are described generically. Sub in your unit's actual values before you run it.

---

## Before you start: Things to teach on day one

**This simulation only covers the actual pacing box** Please stress during teaching the checking of the physical circuit- the connections at each end of the lead, wire position, batteries etc.

**Dependence decides everything.** Before anyone touches a threshold, they establish whether the patient has an underlying rhythm. It is important that learners not panic in the event iof establishing pacemaker dependence, and knows the implications of this, both for further checks, and for management of the patient on an ongoing basis.

**The sensitivity numbers run backwards.** Sensitivity is a threshold in millivolts, not a "how keen is it" dial.

- Lower mV = more sensitive (reacts to smaller signals)
- Higher mV = less sensitive

So "turn the sensitivity down" means nothing useful. Make people say "more sensitive, lower the mV" or "less sensitive, raise the mV". Undersensing (missing real beats) needs more sensitivity, a lower mV. Oversensing (reacting to noise) needs less, a higher mV. Many learners get this wrong, and sloppy language around it is unhelpful- establish this early and keep stressing it.

## Numbers to have in your head

- Ventricular capture threshold should sit under 1 mA. Set output at 2 to 3 times threshold.
- Atrial thresholds run a bit higher and drift more; the leads are less stable.
- A normally sensed R wave is 2 to 5 mV.
- AV delay 100 to 200 ms.

The 2 to 3x output margin and the roughly 2:1 sensing margin are convention, not trial-derived. 

---

# Tier 1: one skill at a time

Tier 1 is basic checks in a stable patient. No troubleshooting yet. You're building the motor pattern.

## 1. Establish dependence, and fail safely

This is the gateway. Nobody threshold-tests in later scenarios until they've shown you they can do this.

**Set up:** DDD or VVI, rate 70, capturing normally. Underlying rhythm is a stable junctional escape around 45. BP fine.

**Brief them:** "Before you test anything, tell me whether this patient actually needs the pacemaker right now."

**What good looks like:** They read the monitor (is every beat paced?), then wind the rate down gradually while watching the arterial trace, find the escape, and put the settings back. Conclusion stated plainly: not dependent, stable escape at 45, safe to test.

**Where they trip:** switching the box off instead of winding it down. Not watching the art line while they do it. Walking away without restoring the settings.

**Debrief:** the manoeuvre is mechanically nothing and clinically, if not managed correctly, the most dangerous routine thing on the list. On a dependent patient, done carelessly, you've just caused asystole. Establishing dependence is a prerequisite, not a box to tick.

## 1b. The dependent patient

Same drill, opposite patient. Run it straight after 1 so the contrast lands.

**Set up:** VVI, rate 70, capturing. When they inhibit, there's a long pause before any escape appears, and what emerges is slow (sub-20) and late. Model overdrive suppression, so the escape shows up on its own timeline rather than immediately.

**Brief them:** "Same check, different patient."

**What good looks like:** they wind down, see the pause, recognise the patient is dependent, and restore the rate promptly rather than sitting on a pause waiting to see what turns up. They name it: dependent, escape suppressed and slow. They should understand the implications of this in terms of emergency planning, and consideration of whether backup is required for testing threshold etc.

**Where they trip:** two opposite errors, and both are worth catching. Panicking at a 10 to 20 second pause and calling an arrest when all they need to do is turn the box back up. Or the reverse, leaving it inhibited too long "to see the underlying rhythm" while the escape is still suppressed.

**Debrief:** the point of this scenario is not that you might fail to restart pacing. On a working generator with a seated lead, winding the output back up recaptures instantly, essentially every time. What actually happens is overdrive suppression: chronic pacing suppresses the escape focus, so when you inhibit, the escape appears late and slow, sometimes taking a couple of minutes to settle. The pause you see is longer than the patient's true underlying rhythm, and it ends the moment you pace again. So don't overreact to the pause, and don't wait it out either. Just restore and move on. Genuine failure to recapture does happen, but it is exit block from hyperkalaemia, acidosis, ischaemia or drugs, and that pathology would have surfaced regardless of your test. Dependence still dictates how hard you push everything that follows, which is why Scenario 1 comes first, just for a more honest reason than "the box might not restart."

## 2. Ventricular capture threshold

**Set up:** VVI, rate 10 above intrinsic so every beat is paced, output 5 mA. True threshold sits at 1.5 mA.

**What good looks like:** they confirm 1:1 capture with the paced rate above intrinsic, wind the output down until the spike stops producing a QRS, note that number as the threshold, then set output to 2 to 3 times it.

**Where they trip:** calling loss of capture "loss of output" (the spike is still there, so output is fine). Setting output barely above threshold with no margin. Testing at a rate below intrinsic, so the patient's own beats hide the loss of capture. This stresses the difference between failure to pace (seen by the absence of pacing spike or pace light on box) and failure to capture (absent QRS) or mechanical failure (absence of arterial pulse wave).

**Debrief:** threshold should be under 1 mA. A rising one points to either trouble at the lead-tissue interface: oedema, fibrosis, dislodgement, or alterations in patient electro-physiology: ischaemia, electrolyte disturbance (particularly hyperkalaemia), acidosis, hypoxia. Also remember anti-arrythmic drugs can alter the threshold, as can recent cardioversion. And separate electrical capture (a QRS) from mechanical capture (a pulse on the art line). Confirm both.

## 3. Ventricular sensing threshold

**Set up:** intrinsic ventricular rhythm around 60 with R waves modelled at 4 mV. VVI, rate set below intrinsic (40), sensitivity starting at 2 mV with the sense indicator tracking.

**What good looks like:** they make sure the rate is below intrinsic so the box is watching rather than pacing, then raise the mV step by step (less sensitive) until the box stops tracking and starts firing asynchronously. That crossover is the sensing threshold. They set the working sensitivity to about half that mV.

**Where they trip:** leaving the rate above intrinsic, so there's nothing to sense. Reading the pace indicator when they mean the sense indicator. Saying "up" and "down" instead of naming the mV direction.

**Debrief:** normal sensed R waves are 2 to 5 mV. A small signal, post-MI or over fibrosis, is what sets you up for undersensing later.

## 4. The full daily check

Now string it together, both chambers.

**Set up:** DDD, rate 70, AV 160 ms, atrial output 8 mA, ventricular 5 mA. Atrial threshold 2 mA, ventricular 1 mA. Underlying sinus around 55 with intact conduction, not dependent.

**What good looks like, in order:** Verbalise checking circuit and connections first (patient, leads, correct ports, box, battery), then mode and rate, then dependence, then capture thresholds both chambers with margins set, then sensing both chambers, then document everything and confirm you've left it capturing.

**Where they trip:** diving straight to the numbers without checking the circuit. Testing thresholds before establishing dependence. Not documenting.

**Debrief:** the sequence is the whole game: circuit, mode, rate, capture, sensitivity. It's the same order you'll use to troubleshoot every fault from here on, so make it automatic now.

---

# Tier 2: something's broken, work out what

Each of these can only be solved by going back and running a Tier 1 skill. Tell them "fix it", not which test to run. Making them choose the tool is the exercise.

## 5. Failure to capture

**Set up:** VVI, rate 70, output 3 mA. Threshold has climbed to 4 mA, so you've got spikes and no QRS. Escape around 40, so the patient tolerates it while they work.

**Brief them:** "The nurse says the monitor looks wrong. Sort it out."

**What good looks like:** they clock spikes-present-no-capture as failure to capture, not output failure. Check and tighten connections, confirm port and polarity, re-run the capture threshold, find it's risen to 4, and set output to 2 to 3 times the new number. Then they go looking for why: electrolytes, ischaemia, drugs, acidosis, recent defibrillation.

**Where they trip:** calling it output failure when the spikes are right there. Cranking to max without ever recording the new threshold. Skipping the reversible-cause hunt.

**Debrief:** mechanical causes first (dislodgement, loose connection, low output), then fibrosis, MI, electrolytes, post-defib, and the usual drug suspects (flecainide, sotalol, beta-blockers, lignocaine, verapamil). In bipolar leads the negative electrode fibroses first, so reversing the leads or going unipolar can buy you capture.

## 6. Undersensing

**Set up:** VVI, rate 50, sensitivity set too high in mV (too insensitive, say 6 mV). Intrinsic R waves are 3 mV, so the box can't see them and drops spikes in too soon after the patient's own beats.

**Brief them:** "Something's off with how it's behaving around the patient's own beats."

**What good looks like:** they recognise spikes landing on top of native beats as undersensing, re-run the sensing threshold, and make the box more sensitive by lowering the mV below the R-wave amplitude with a margin. Then confirm it's inhibiting properly on intrinsic beats.

**Where they trip:** mixing it up with failure to capture. Adjusting the wrong way and making it worse. Forgetting the R-on-T risk that makes this dangerous rather than cosmetic.

**Debrief:** undersensing means overpacing, and a spike on a T wave can start something you don't want. Usual causes are an insensitive setting, a low-amplitude signal, a lead problem, or electrolytes.

## 7. Oversensing

**Set up:** VVI, rate 60, sensitivity set too low in mV (too sensitive, 0.8 mV). Feed in oversensed signal, T waves or muscle artefact, so the box inhibits inappropriately and drops pauses. Underlying rhythm slow, around 40, so the pauses matter — and the patient is hypotensive (around 80 systolic) until an effective rate near 60 is back.

**Brief them:** "Intermittent long pauses, the output keeps cutting out, and the pressure is soft."

**What good looks like:** they notice there's no spike during the pauses, so the box is withholding output, not failing to produce it. They name oversensing, make the box less sensitive by raising the mV, and check whether the patient is safe during pauses. If unstable, they know VOO is a bridge to buy time. Either fix restores the rate, and they watch the pressure come back up with it — the haemodynamic recovery is the confirmation.

**Where they trip:** treating pauses as output failure and chasing connections. Raising the output, which does nothing for a sensing problem. Forgetting that VOO throws away R-on-T protection, so it's a bridge and not a fix.

**Debrief:** the box gets fooled by big P or T waves, muscle activity, lead contact, or outside interference. Asynchronous mode beats oversensing but paces blind, so only reach for it as a bridge.

## 8. Output failure, no spikes at all

**Set up:** VVI, rate 70, inject a loose connection or cable fault so there's no output and no spikes. Underlying rhythm around 35, symptomatic.

**Brief them:** "It's doing nothing and the rate's 35. Patient is feeling faint and clammy."

**What good looks like:** absent spikes tells them output failure, not failure to capture. They work the circuit end to end (patient, lead, ports, cable, box, battery), take output to max, and connect the box straight to the lead if they suspect the cable. Asynchronous mode if oversensing is the culprit. Crucially, they get transcutaneous pacing and chronotropes ready while they work rather than after.

**Where they trip:** confusing it with failure to capture, where the spikes are present. No backup running in parallel. Not checking the battery.

**Debrief:** output failure is lead malfunction, a dodgy connection, flat battery, cross-talk, or oversensing. The rescue ladder is worth memorising: power and connections, max output, asynchronous mode, box direct to lead, transcutaneous, then CPR and drugs.

---

# Tier 3: everything at once, and the clock's running

Dependent patients and dual-chamber faults. These force several basic skills together under pressure, plus a named syndrome to recognise.

## 9. Lead displacement

**Set up:** VVI, rate 70. Intermittent capture, runs of capture alternating with failure to capture and ventricular ectopics or short VT. Make it positional, so a "roll the patient" input transiently improves things.

**Brief them:** "Intermittent capture, and now she's throwing ectopics. Rate's all over the place."

**What good looks like:** they put the intermittent capture and the ectopy together and land on a displaced lead. Threshold checks come back erratic. They try repositioning, more output, reverse or unipolar, and recognise this is mechanical and needs the lead repositioned or refloated, so they escalate. Pads on as backup.

**Where they trip:** chasing sensitivity when the problem is mechanical. Not escalating for definitive lead management. Missing the perforation clue.

**Debrief:** a loose wire tickles the RV and gives you ectopy and VT between failures to capture. If the paced QRS flips from LBBB to RBBB, the electrode has gone through the septum into the LV. Get a chest film and escalate.

## 10. Cross-talk and ventricular standstill

Dependent patient. This one moves fast.

**Set up:** DDD, rate 60, patient dependent. Ventricular channel over-sensitive, so it senses the atrial spike, reads it as a ventricular beat, and inhibits ventricular output. Ventricle goes quiet.

**Brief them:** "Dual-chamber box, dependent patient, ventricle's gone silent. Go."

**What good looks like:** atrial spikes present, ventricular output inhibited, and they call cross-talk. First move is to secure output: more ventricular output or straight to asynchronous, DOO or VOO, so the ventricle is guaranteed to pace. Then fix the cause, make the ventricular channel less sensitive by raising the mV, and back off the atrial output. Confirm AV-sequential capture is back.

**Where they trip:** freezing on the diagnosis instead of securing output first. Raising sensitivity, the wrong way. Not registering that a dependent patient means seconds, not minutes.

**Debrief:** cross-talk is the atrial spike being read as a ventricular event and shutting down ventricular output. On a dependent patient the rule is simple: secure output first, refine the settings second.

## 11. Pacemaker-mediated tachycardia

**Set up:** DDD, upper rate limit 160. Model retrograde VA conduction so a retrograde P gets sensed as atrial activity and triggers another ventricular beat, round and round. Paced tachycardia sitting at the upper limit.

**Brief them:** "Dual-chamber patient, suddenly paced at 160 and stuck there."

**What good looks like:** they spot a paced tachycardia pinned at the programmed ceiling and call PMT. They break it with a magnet or by switching to a non-tracking mode (VVI, DVI, DDI), then prevent recurrence by extending the PVARP, with adenosine as an option to interrupt the retrograde conduction. They know switching mode may cost AV synchrony and accept the trade.

**Where they trip:** treating it as a primary tachyarrhythmia. Missing that the rate parking exactly at the upper limit is the clue. Losing AV synchrony without realising it.

**Debrief:** the loop is a retrograde P sensed as native atrial activity driving repeated ventricular pacing, capped at the programmed max. Magnet or non-tracking mode breaks it; a longer PVARP keeps it broken.

## 12. Rising threshold in a dependent patient

The capstone. Everything from Tier 1, compressed into a crisis.

**Set up:** VVI, rate 70, output 5 mA, dependent, no escape. Threshold rising in real time, 1 to 3 to 6 mA over the scenario, heading for loss of capture if they don't act. A reversible-cause toggle, hyperkalaemia, drives it.

**Brief them:** "Dependent patient, capture's starting to drop out. Clock's running."

**What good looks like:** intermittent then progressive failure to capture. First move is to raise output and recapture, buying time. Confirm connections, port, polarity. Hunt the reversible cause: potassium, acidosis, ischaemia, drugs. Pads on, senior called, drugs ready. Then treat the cause while holding capture, and re-establish a safe margin once stable.

**Where they trip:** diagnosing before securing output on a dependent patient. Hitting max output with no backup and no cause hunt. Not re-testing and re-documenting the new threshold once things settle.

**Debrief:** things that push the threshold up are hypoxia, acidosis, class I antiarrhythmics, and electrolytes. Treat the cause while you hold capture with extra output. Notice that the crisis is just the daily check at speed: secure output, work the circuit, find the cause, reset the margin.

---

# References

1. *Kaplan's Essentials of Cardiac Anesthesia*, 2nd ed, 2018 (via ScienceDirect: Transvenous Pacing). Threshold under 1 mA, output at 3x, AV delay 100 to 200 ms.
2. Medscape / eMedicine, *Transvenous Cardiac Pacing Technique* (updated 2021). Output 2 to 3x threshold, sensing-threshold method, reversible causes of a rising threshold.
3. Nickson C, *Temporary Pacemaker Troubleshooting*, LITFL Critical Care Compendium (rev. 2023). Normal sensitivity 2 to 5 mV, systematic review approach, maximum outputs, full malfunction taxonomy.
4. ecgwaves.com, *Assessment of Pacemaker Malfunction* (2025). Malfunction taxonomy: failure to pace and capture, over- and undersensing, cross-talk, PMT.
5. Yartsev A, *Troubleshooting the pacemaker circuit*, Deranged Physiology (2024). Reverse-lead and unipolar conversion, capture-threshold method.
6. Nayak HM et al, *Pacemaker Troubleshooting: Common Clinical Scenarios*, PMC5067035. Causes of under- and oversensing.
