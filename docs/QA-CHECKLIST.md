# FocusMatrix QA Checklist

## Functional

1. Add a task and confirm it appears in the Today list immediately.
2. Toggle a task complete and confirm counts, score, and dashboard cards update.
3. Delete a task and confirm it disappears without breaking analytics.
4. Use "Suggest quadrant" and confirm text like "Reply to customer email" maps to Q3.
5. Reset sample data and confirm the seeded notebook is restored.

## Analytics

1. Discipline score changes when Q2 and Q1 tasks are completed.
2. Q4 tasks lower the score and raise distraction index.
3. Weekly report shows seven days and a weekly average.
4. Streak only increases for consecutive logged days.

## UI

1. Sidebar tabs switch views without layout jumps.
2. Mobile layout stacks cleanly with readable spacing.
3. Reduced motion mode respects OS preferences.
4. Toast messages appear and disappear without blocking input.

## Release

1. `index.html` loads directly from the filesystem.
2. `tests\run-tests.cmd` passes.
3. README instructions match the real repo layout.
4. GitHub Pages workflow exists before publishing.
