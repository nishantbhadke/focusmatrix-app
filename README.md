# FocusMatrix

FocusMatrix is an execution-first productivity notebook built around the Eisenhower Matrix.

Most task apps are good at helping you plan. FocusMatrix is about helping you see whether you actually finished the right work, how your day was distributed across urgent vs. important tasks, and what that pattern says about your habits over time.

## Why this project exists

The original idea behind FocusMatrix came from a simple frustration:

people often end the day with a full task list, a tired brain, and no clear answer to one honest question:

**"Did I spend my time on the work that actually mattered?"**

That is the gap this project is trying to solve.

FocusMatrix takes the familiar Eisenhower Matrix and turns it into a lightweight behavioral tool. Instead of only storing tasks, it helps track:

- what you planned
- what you completed
- what kind of work filled your day
- how much of your time went to strategic work vs. reactive work

## What the app does

The current prototype lets you:

- add tasks with quadrant, category, and energy tags
- auto-suggest a quadrant from the task wording
- mark tasks complete and remove them
- view a daily discipline score
- see your task distribution across the Eisenhower Matrix
- review a simple weekly summary
- keep everything stored locally in the browser with no backend required

## What this is right now

This repository currently contains a polished static prototype.

It is designed to be:

- easy to run locally
- easy to understand for collaborators
- easy to publish with GitHub Pages
- easy to extend later into a real full-stack product

The static app lives at [index.html](/C:/Users/nisha/Downloads/files/index.html).

There is also an older prototype file at [focusmatrix_v2.html](/C:/Users/nisha/Downloads/files/focusmatrix_v2.html), and an early backend MVP kept in [backend/](/C:/Users/nisha/Downloads/files/backend/README.md) for future work.

## Core product idea

FocusMatrix is not trying to be "just another to-do app."

Its core point of view is:

> planning is easy to overvalue; execution is what tells the truth.

The project is built around three ideas:

1. The Eisenhower Matrix is simple enough that almost anyone already understands it.
2. Productivity is more useful when it shows behavior, not just intention.
3. A small daily feedback loop is often more helpful than a heavy system.

## Features in the current prototype

### Daily notebook

- quick task entry
- category and energy tagging
- task completion and deletion
- local persistence with browser `localStorage`

### Behavioral dashboard

- daily discipline score
- completion rate
- strategic work ratio
- distraction index
- simple streak tracking

### Weekly review

- seven-day score summary
- weekly average
- lightweight written insights

### UI direction

- notebook-inspired visual style
- minimal layout
- subtle animations
- reduced-motion support

## Project structure

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

## Running the project locally

No build step is required for the current prototype.

1. Clone the repository.
2. Open [index.html](/C:/Users/nisha/Downloads/files/index.html) in a browser.

That is enough to use the app.

All prototype data is stored in your browser, so nothing else needs to be installed for the static version.

## Running the tests

This repo includes a small analytics test runner for Windows:

```bat
tests\run-tests.cmd
```

The test file validates the score logic and weekly summary behavior using built-in Windows scripting tools.

## Publishing with GitHub only

This project does not require any paid platform to go live as a prototype.

The repository already includes a GitHub Pages workflow at [deploy-pages.yml](/C:/Users/nisha/Downloads/files/.github/workflows/deploy-pages.yml).

To publish it:

1. Push your changes to `main`
2. Open the repository on GitHub
3. Go to `Settings` -> `Pages`
4. Set the source to `GitHub Actions`

After that, GitHub can deploy the site directly from the repository.

## Areas to check before shipping changes

Use the checklist in [docs/QA-CHECKLIST.md](/C:/Users/nisha/Downloads/files/docs/QA-CHECKLIST.md).

The most important areas are:

- task creation, completion, and deletion
- score calculation and weekly summary logic
- layout on smaller screens
- reset behavior and local data persistence
- documentation accuracy

## Roadmap

Near-term:

- connect the static UI to the backend MVP
- add edit-in-place for tasks
- improve weekly insight quality
- add clearer onboarding and empty states

Later:

- authenticated user accounts
- cloud sync
- richer analytics
- focus sessions
- calendar integration
- team and manager views

## Initial idea based on

This project is based on a mix of:

- the **Eisenhower Matrix** for prioritization
- the broader idea of **behavioral productivity** rather than simple task collection
- the practical need for a tool that shows the gap between planning and execution

It is especially influenced by the observation that most people do not struggle to write down tasks.

They struggle to consistently finish the right ones.

## About the project owner

**Nishant Bhadke**  
GitHub: [nishantbhadke](https://github.com/nishantbhadke)  
Email: [nishantbhadke118@gmail.com](mailto:nishantbhadke118@gmail.com)

## Notes on the README style

This README was restructured to follow the kind of layout that good developer-facing repositories usually use:

- clear first paragraph
- direct explanation of the problem
- concrete feature summary
- simple local setup
- real project status
- practical next steps

The structure was informed by examples and guidance such as:

- GitHub's repository README best-practice guidance
- the `mhucka/readmine` README structure example

## License

MIT
