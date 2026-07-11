# CAPTURE — Cardiac And Pacing Training Using Realistic Emulation

A temporary transvenous pacing simulator for ICU/CCU medical and nursing staff.

**▶ Run it: https://ectope.github.io/capture/**

> ### ⚠️ Simulation for education only — not for guiding patient care
>
> This is **not a medical device** and is **not validated for clinical use**. It must
> not be used to guide the care of a real patient.
>
> - **Confirm everything locally.** Every threshold, interval, safety margin and
>   procedure here is a teaching approximation. Check it against your own unit's
>   policy and the manual of the generator you actually use. Devices differ. Where
>   this simulator and your local policy disagree, **your local policy is right.**
> - **It is an adjunct, not a replacement.** It is designed to be used alongside
>   experienced clinical instruction, with a supervisor in the room who can correct
>   it. It is not a standalone teaching aid.
> - **The device is generic**, modelled on a typical dual-chamber external pulse
>   generator rather than any particular manufacturer's. Some scenarios depend on
>   features a given box may not have — Scenario 10 (cross-talk) assumes no
>   ventricular safety pacing, which many temporary units lack but some do not.
> - **The physiology is simplified**: it simulates cardiac *timing and events*, which
>   is the level at which pacemaker behaviour operates. It is not a cellular model.
>
> The simulator can tell you what a box does. It cannot tell you what a patient needs.

`index.html` is entirely self-contained — no server, no build step, no network. It
can equally be downloaded and opened straight from disk, which is the point: it
runs on a locked-down ward machine with no internet.

The scenarios implement [`tvp_simulator_script.md`](tvp_simulator_script.md), a
structured teaching script that doubles as a validation checklist. Every
"Expected simulator behaviour (✓)" checkpoint in that script runs as an
automated assertion — see [Tests](#tests).

## Two modes

**Sandbox** — pick the underlying rhythm openly and play with the box.

**Teaching** — pick a *scenario* instead. The rhythm and the patient's capture
thresholds are hidden; the trainee has to work them out with the device, which
is the whole point. Each scenario carries its vignette, its objectives and an
instructor-only debrief. Some carry *clinical actions* — roll the patient, put the
pads on, treat the potassium — that are not dials on the box.

Scenarios follow `tvp_simulator_script.md`, and **all twelve are implemented**:
Tier 1 (1, 1b, 2, 3, 4), Tier 2 (5, 6, 7, 8) and Tier 3 (9, 10, 11, 12).

## Features
- VVI, AAI and DDD pacing, with an ASYNC switch (VOO / DOO / AOO)
- Simulated ECG with pacing spikes; arterial trace coupled to mechanical capture
- Underlying rhythms: sinus, heart blocks, asystole; junctional or
  idioventricular escape foci, or none at all (the pacing-dependent patient)
- Adjustable rate, upper rate limit, AV interval, PVARP, outputs and sensitivities
- Fault modelling: failure to capture (static, jittering, or rising in real time),
  under- and oversensing, output failure from a broken circuit, cross-talk,
  lead displacement with ectopy and septal perforation, retrograde VA conduction
  and pacemaker-mediated tachycardia
- Transcutaneous backup pacing as a rescue pathway
- Deterministic: scenarios use a seeded PRNG, so they look irregular but replay
  exactly — which is what makes them fair to assess against

## Local Development

```bash
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5000

`index.html` is self-contained and also works opened directly from disk, with
no server.

## Tests

```bash
node test_scenarios.js          # teaching scenarios; no browser, no deps
```

Runs each scenario's "Expected simulator behaviour (✓)" checkpoints from the
teaching script as assertions against the simulator's internal cardiac event
stream.

```bash
# sandbox rhythm x mode matrix (needs Playwright + a running server)
npm install playwright && npx playwright install chromium
flask --app app run --port 5050
BASE_URL=http://127.0.0.1:5050 node test_pacing_behaviour.js
```

## Deployment

Configured for Render.com deployment via `render.yaml`.

## Licence

[![Licence: CC BY-NC-SA 4.0](https://img.shields.io/badge/Licence-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

CAPTURE © 2026 Tim Bowles, licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**Please use it.** Copy it, run it on your unit, write your own scenarios, retune
the values to match your own generator, translate it. Three conditions:

- **Credit** — attribute it to Tim Bowles and link to the licence, and say if you
  changed anything.
- **Non-commercial** — teaching your own staff, running departmental or regional
  training, and using it in university courses are **not** commercial uses. Selling
  it, paywalling it, or bundling it into a commercial training product are.
- **ShareAlike** — if you build on it, release your version under the same licence,
  so improvements stay open.

If you adapt it, you take on responsibility for the clinical accuracy of your
adaptation, and you must not represent it as validated for clinical use. Please
keep the safety disclaimer.

See [LICENSE](LICENSE) for the full terms.
