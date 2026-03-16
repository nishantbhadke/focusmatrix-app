# FocusMatrix

FocusMatrix is a lightweight productivity app built around the Eisenhower Matrix, daily execution tracking, and simple behavioral analytics.

The idea is straightforward: most productivity tools are good at collecting tasks, but not very good at showing whether you actually spent time on the right work. FocusMatrix tries to close that gap by combining planning, completion tracking, and a small feedback loop around execution quality.

## What it is

This repository currently contains a static web app prototype with:

- task capture with quadrant, category, and energy tagging
- automatic quadrant suggestions based on task wording
- a daily dashboard with a discipline score and work-distribution metrics
- a weekly summary view
- browser-based local persistence with no backend required to use the prototype

The current product direction is intentionally simple: make it fast to open, easy to understand, and honest about how your day was actually spent.

## Why it exists

The project started from a pretty common problem:

you can end a day with a full list, a lot of activity, and still have no clean sense of whether you made progress on the work that really mattered.

FocusMatrix is based on the belief that execution tells a more useful story than planning alone.

## Current stack

- HTML
- CSS
- vanilla JavaScript
- browser `localStorage` for persistence
- GitHub Pages workflow for zero-cost deployment

There is also an early backend MVP in [backend/](./backend/README.md), but the main usable version today is the static app.

## Running it locally

No build step is required.

1. Clone the repository
2. Open [`index.html`](./index.html) in a browser

That is enough to use the app.

## Main files

```text
index.html                 # app entry
styles/main.css            # notebook-style UI
src/app.js                 # UI behavior and rendering
src/data.js                # local persistence + seed data
src/analytics.js           # score and weekly summary logic
docs/QA-CHECKLIST.md       # manual validation checklist
tests/run-tests.cmd        # lightweight Windows test runner
```

## What works today

### Daily notebook

- add tasks
- assign quadrant, category, and energy
- complete tasks
- delete tasks
- reset demo data

### Behavior layer

- daily discipline score
- completion rate
- strategic work ratio
- distraction index
- simple streak tracking

### Weekly review

- seven-day summary
- average score
- lightweight textual insights

## Deployment

This repo is already set up to go live through GitHub only.

The workflow is in [deploy-pages.yml](./.github/workflows/deploy-pages.yml).

To publish it:

1. Push to `main`
2. Open the repository on GitHub
3. Go to `Settings` -> `Pages`
4. Select `GitHub Actions` as the source

That is enough to deploy the static prototype without paying for any additional platform.

Once GitHub Pages is enabled, the live site URL will be:

`https://nishantbhadke.github.io/focusmatrix-app/`

## Testing

For the current prototype, there is a small Windows-based test runner:

```bat
tests\run-tests.cmd
```

It validates the analytics logic using built-in Windows scripting tools.

For manual checks, use [docs/QA-CHECKLIST.md](./docs/QA-CHECKLIST.md).

## Product direction

FocusMatrix is not trying to become a bloated task manager.

The stronger direction for the product is:

- a fast daily planning surface
- better execution visibility
- clearer separation between strategic work and reactive work
- lightweight personal analytics that stay useful without becoming noisy

## Roadmap

Near-term:

- connect the UI to the backend MVP
- support editing existing tasks
- improve the weekly insight layer
- tighten onboarding and empty states

Later:

- user accounts
- synced history
- focus sessions
- calendar integration
- richer behavior reporting
- team features

## Initial idea based on

FocusMatrix is influenced by:

- the Eisenhower Matrix as a prioritization framework
- the broader idea of behavioral productivity
- the practical gap between planning work and actually finishing it

In simple terms: most people do not need more ways to write down tasks. They need a better way to see whether they are consistently finishing the right ones.

## Project owner

**Nishant Bhadke**  
GitHub: [nishantbhadke](https://github.com/nishantbhadke)  
Email: [nishantbhadke118@gmail.com](mailto:nishantbhadke118@gmail.com)

## Additional notes

- [focusmatrix_v2.html](./focusmatrix_v2.html) is the earlier single-file prototype and is still kept in the repo for reference.
- [backend/](./backend/README.md) contains an early backend MVP for future expansion.
- The current primary entry point is [`index.html`](./index.html).

## License

MIT
