(function (root) {
  var storageKey = "focusmatrix_notebook_v1";

  function seedHistory() {
    var history = {};
    var entries = [
      { ago: 6, score: 58, tasks: 5 },
      { ago: 5, score: 72, tasks: 6 },
      { ago: 4, score: 48, tasks: 4 },
      { ago: 3, score: 81, tasks: 7 },
      { ago: 2, score: 66, tasks: 5 },
      { ago: 1, score: 76, tasks: 6 }
    ];

    entries.forEach(function (entry) {
      var date = new Date();
      date.setDate(date.getDate() - entry.ago);
      history[date.toISOString().slice(0, 10)] = { score: entry.score, tasks: entry.tasks };
    });

    return history;
  }

  function seedData() {
    var today = root.FocusMatrixAnalytics.todayKey();
    var now = Date.now();
    return {
      nextId: 8,
      history: seedHistory(),
      tasks: [
        { id: 1, text: "Finalize landing page notes", q: "Q2", cat: "work", energy: "high", done: true, date: today, ts: now - 7200000 },
        { id: 2, text: "Reply to the client update", q: "Q3", cat: "work", energy: "medium", done: true, date: today, ts: now - 6200000 },
        { id: 3, text: "Plan onboarding flow", q: "Q2", cat: "work", energy: "high", done: false, date: today, ts: now - 5200000 },
        { id: 4, text: "Fix urgent homepage bug", q: "Q1", cat: "work", energy: "high", done: false, date: today, ts: now - 4200000 },
        { id: 5, text: "Read a product strategy chapter", q: "Q2", cat: "learning", energy: "medium", done: false, date: today, ts: now - 3200000 },
        { id: 6, text: "Plan tomorrow workout", q: "Q2", cat: "health", energy: "low", done: false, date: today, ts: now - 2200000 },
        { id: 7, text: "Scroll social feed", q: "Q4", cat: "personal", energy: "low", done: false, date: today, ts: now - 1200000 }
      ]
    };
  }

  function save(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function load() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) {
        var initial = seedData();
        save(initial);
        return initial;
      }
      return JSON.parse(raw);
    } catch (error) {
      var fallback = seedData();
      save(fallback);
      return fallback;
    }
  }

  function reset() {
    var initial = seedData();
    save(initial);
    return initial;
  }

  root.FocusMatrixData = {
    load: load,
    save: save,
    reset: reset
  };
}(this));
