# CAPTURE — Cardiac And Pacing Training Using Realistic Emulation

A temporary transvenous pacing simulator for ICU/CCU medical and nursing staff.

**▶ Run it: https://ectope.github.io/capture/**

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

## License

Educational use.
