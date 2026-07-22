# FocusMatrix

FocusMatrix is a lightweight productivity app built around the Eisenhower Matrix, daily execution tracking, and simple behavioral analytics.

The idea is straightforward: most productivity tools are good at collecting tasks, but not very good at showing whether you actually spent time on the right work. FocusMatrix tries to close that gap by combining planning, completion tracking, and a small feedback loop around execution quality.

## What it is

This repository currently contains:

- a stable static prototype route for demos
- a separate main app route for backend-connected evolution
- Swagger docs for the backend API contract
- a MongoDB-ready backend with JSON fallback
- optional Valkey caching support for hosted API reads

The current product direction is intentionally simple: make it fast to open, easy to understand, and honest about how your day was actually spent.

## Why it exists

The project started from a pretty common problem:

you can end a day with a full list, a lot of activity, and still have no clean sense of whether you made progress on the work that really mattered.

FocusMatrix is based on the belief that execution tells a more useful story than planning alone.

## Current stack

- HTML
- CSS
- vanilla JavaScript
- browser `localStorage` for the prototype route
- optional Node.js backend with MongoDB Community support for the main app route
- optional Valkey cache layer for hosted API acceleration
- GitHub Pages workflow for zero-cost deployment

There is also a backend MVP in [backend/](./backend/README.md) with MongoDB support for durable server-side storage, but the main usable GitHub Pages experience is still frontend-only.

## Architecture

- system architecture: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- hosted deployment plan: [docs/HOSTING.md](./docs/HOSTING.md)
- agent auth (A2A) personal learning log: [docs/AGENT-AUTH-LEARNING-LOG.md](./docs/AGENT-AUTH-LEARNING-LOG.md)

The repo now keeps architecture and deployment flow in versioned docs so the system stays easier to understand over time.

## Public routes

Once GitHub Pages is enabled, you can keep the routes separated:

- landing page: `https://nishantbhadke.github.io/focusmatrix-app/`
- prototype route: `https://nishantbhadke.github.io/focusmatrix-app/prototype/`
- app route: `https://nishantbhadke.github.io/focusmatrix-app/app/`
- swagger docs: `https://nishantbhadke.github.io/focusmatrix-app/swagger/`

This split is intentional so the demo-safe prototype does not get affected by backend or integration changes on the app route.

## Running it locally

No build step is required.

1. Clone the repository
2. Open [`prototype/index.html`](./prototype/index.html) for the stable demo route
3. Open [`app/index.html`](./app/index.html) for the separate app route

If you want the main app route to save into Mongo locally:

1. Start MongoDB
2. Run the backend from [`backend/run-local.cmd`](./backend/run-local.cmd)
3. Open [`app/index.html`](./app/index.html)

The app route prefers the local API automatically when it is available. If the backend is offline, it falls back to browser storage instead of breaking.

That is enough to use the app.

## Main files

```text
index.html                 # app entry
prototype/index.html       # stable demo route
app/index.html             # separate main app route
config/runtime-config.js   # hosted frontend API config
swagger/index.html         # Swagger UI
swagger/openapi.json       # API contract
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
- keep the prototype route isolated from app-route changes
- use Mongo-backed persistence in the main app route when the local backend is running

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

This repo is already set up to go live on GitHub Pages for the frontend.

The workflow is in [deploy-pages.yml](./.github/workflows/deploy-pages.yml).

To publish it:

1. Push to `main`
2. Open the repository on GitHub
3. Go to `Settings` -> `Pages`
4. Select `GitHub Actions` as the source

That is enough to deploy the static prototype without paying for any additional platform.

Important constraint:

- GitHub Pages can host the frontend routes and Swagger docs
- GitHub Pages cannot host the Node.js backend or MongoDB
- the recommended hosted stack is GitHub Pages + Koyeb + MongoDB Atlas + optional Valkey
- the backend will still need a separate runtime later if you want the app route to save server-side data

## Testing

For the current prototype, there is a small Node-based test runner:

```bat
tests\run-tests.cmd
```

It validates the analytics logic locally without adding extra test frameworks.

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
- point the app route at the hosted Mongo backend later

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
