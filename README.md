# FocusMatrix

FocusMatrix is now a static, notebook-style web app prototype that runs directly from this repository with no paid platform, no build step, and no extra runtime needed beyond a browser.

## What Changed

- Reworked the prototype into a cleaner static app entry at `index.html`
- Added a minimal notebook-inspired UI with paper textures and subtle motion
- Kept browser `localStorage` for persistence so the app is runnable immediately
- Added lightweight analytics tests that run with Windows Script Host
- Added a GitHub Pages workflow so the repo can publish itself

## Project Structure

```text
focusmatrix-app/
|- index.html
|- styles/main.css
|- src/analytics.js
|- src/data.js
|- src/app.js
|- docs/QA-CHECKLIST.md
|- tests/run-tests.cmd
|- .github/workflows/deploy-pages.yml
|- focusmatrix_v2.html
`- backend/
```

## Run Locally

1. Clone the repo.
2. Open `index.html` in your browser.

That is enough for the prototype. It stores notebook data in your browser with `localStorage`.

## Run Tests

On Windows, run:

```bat
tests\run-tests.cmd
```

This executes the analytics test cases using `cscript`, which is available in this environment.

## Make It Live With GitHub Only

The repository includes [deploy-pages.yml](/C:/Users/nisha/Downloads/files/.github/workflows/deploy-pages.yml), so you can publish the app using GitHub Pages only.

### Steps

1. Push the latest code to `main`.
2. In GitHub, open the repository settings.
3. Go to `Pages`.
4. Set the source to `GitHub Actions`.
5. The `Deploy Static Site` workflow will publish the repo automatically on push.

No paid service is required for this prototype path.

## Areas To Check In Code

Use [QA-CHECKLIST.md](/C:/Users/nisha/Downloads/files/docs/QA-CHECKLIST.md) before each push. The highest-signal areas are:

1. Task add, complete, and delete flows
2. Daily score and weekly report calculations
3. Responsive layout and reduced-motion behavior
4. Reset behavior and local persistence safety
5. Documentation and deployment workflow correctness

## Notes

- `focusmatrix_v2.html` is kept as the older single-file prototype.
- `backend/` remains in the repo for future API work, but the current usable prototype is the static app at `index.html`.
