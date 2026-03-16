# FocusMatrix

> **Know where your time actually goes.**

FocusMatrix is a behavioral productivity web app that combines task logging, the Eisenhower Matrix, and an analytics engine to show you the gap between what you *planned* to do and what you *actually* did.

---

## What Makes It Different

| Feature | Todoist / Notion | FocusMatrix |
|---|---|---|
| Task planning | ✅ | ✅ |
| Eisenhower classification | ❌ | ✅ |
| Actual behavior tracking | ❌ | ✅ |
| Plan vs. actual gap analysis | ❌ | ✅ |
| Discipline score | ❌ | ✅ |
| Weekly report card | ❌ | ✅ |
| Data moat (behavioral history) | ❌ | ✅ |

---

## Core Features

- **Smart Task Logging** — Quick-add tasks with auto-suggested Eisenhower quadrant based on keywords
- **Eisenhower Matrix View** — Visual 2×2 grid of all tasks by quadrant
- **Daily Dashboard** — Discipline score, distraction index, strategic work ratio, completion by category
- **Weekly Report Card** — 7-day trend, letter grade, personalized behavioral insights
- **Focus Timer** — Optional Pomodoro-style timer per task
- **Categories & Tags** — Work, Personal, Health, Learning, Admin — filterable across all views

---

## Tech Stack

- Pure HTML + CSS + Vanilla JS (zero dependencies, zero build step)
- `localStorage` for persistence (no backend required for prototype)
- Fully responsive — works on desktop, tablet, and mobile

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/focusmatrix-app.git
cd focusmatrix-app

# Open in browser — no server needed
open index.html
# or
npx serve .
```

---

## Project Structure

```
focusmatrix-app/
├── index.html          # Main app entry point
├── src/
│   ├── app.js          # Core logic, state, rendering
│   ├── data.js         # Data layer, localStorage, seeding
│   ├── analytics.js    # Score calculations, insights engine
│   └── ui.js           # UI helpers, toast, modals
├── styles/
│   └── main.css        # All styles (CSS variables + components)
├── docs/
│   └── PITCH.md        # Investor pitch & competitive analysis
└── README.md
```

---

## Competitive Moat — Why FocusMatrix Wins

### The Grass Is Greener Because We're Playing a Different Game

Most productivity apps are **planning tools** that reward *adding* tasks. FocusMatrix is a **behavioral intelligence tool** that rewards *completing the right tasks* and learns from the gap.

**Three defensible advantages:**

1. **Data moat** — Every week of use makes your behavioral profile more personalized. Switching cost grows with time, not just habit.

2. **Framework lock-in** — The Eisenhower Matrix is already embedded in corporate training, MBA programs, and leadership literature. We're the first tool to operationalize it with real behavioral data.

3. **B2B expansion path** — Once individual users prove ROI, the same engine can be sold to teams as a productivity intelligence layer. That's the enterprise story.

---

## Roadmap

- [x] V1 — Core task logging + Eisenhower tagging
- [x] V1 — Daily dashboard + discipline score
- [x] V1 — Weekly report card
- [ ] V2 — Smart auto-categorization (keyword detection)
- [ ] V2 — Focus timer (Pomodoro integration)
- [ ] V2 — Calendar sync (Google Calendar)
- [ ] V3 — Team mode (anonymized aggregate analytics)
- [ ] V3 — AI suggestions (behavioral pattern detection)
- [ ] V3 — Mobile app (PWA)

---

## License

MIT — build on it, fork it, improve it.
