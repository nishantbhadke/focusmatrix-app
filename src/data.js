(function (root) {
  var config = root.FocusMatrixConfig || {};
  var analytics = root.FocusMatrixAnalytics;
  var storageKey = config.storageKey || ("focusmatrix_" + (config.mode || "default") + "_v1");
  var requestedMode = config.storageMode || "local";
  var apiBaseUrl = (config.apiBaseUrl || "").replace(/\/$/, "");

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
    var today = analytics.todayKey();
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

  function clone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function loadLocal() {
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) {
        var initial = seedData();
        localStorage.setItem(storageKey, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch (error) {
      var fallback = seedData();
      localStorage.setItem(storageKey, JSON.stringify(fallback));
      return fallback;
    }
  }

  function saveLocal(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return clone(data);
  }

  function resetLocal() {
    var initial = seedData();
    localStorage.setItem(storageKey, JSON.stringify(initial));
    return clone(initial);
  }

  function sanitizeExport(payload) {
    return {
      nextId: payload.nextTaskId || payload.nextId || 1,
      history: payload.history || {},
      tasks: payload.tasks || []
    };
  }

  function apiRequest(path, options) {
    if (!apiBaseUrl || typeof root.fetch !== "function") {
      return Promise.reject(new Error("API unavailable"));
    }

    return root.fetch(apiBaseUrl + path, options).then(function (response) {
      if (!response.ok) {
        return response.text().then(function (text) {
          var message = text || ("Request failed with status " + response.status);
          try {
            var payload = JSON.parse(text);
            message = payload.error || message;
          } catch (error) {}
          throw new Error(message);
        });
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    });
  }

  function buildLocalAdapter() {
    return {
      mode: "local",
      label: "Browser storage",
      connected: true,
      load: function () {
        return Promise.resolve(clone(loadLocal()));
      },
      createTask: function (payload) {
        var data = loadLocal();
        var task = {
          id: data.nextId++,
          text: payload.text,
          q: payload.q,
          cat: payload.cat,
          energy: payload.energy,
          done: Boolean(payload.done),
          date: payload.date || analytics.todayKey(),
          ts: Date.now()
        };
        data.tasks.push(task);
        saveLocal(data);
        return Promise.resolve({ data: clone(data), task: clone(task) });
      },
      updateTask: function (id, payload) {
        var data = loadLocal();
        var task = data.tasks.find(function (item) { return item.id === id; });
        if (!task) {
          return Promise.reject(new Error("Task not found"));
        }

        Object.keys(payload).forEach(function (key) {
          task[key] = payload[key];
        });

        saveLocal(data);
        return Promise.resolve({ data: clone(data), task: clone(task) });
      },
      deleteTask: function (id) {
        var data = loadLocal();
        data.tasks = data.tasks.filter(function (item) { return item.id !== id; });
        saveLocal(data);
        return Promise.resolve({ data: clone(data) });
      },
      reset: function () {
        return Promise.resolve(clone(resetLocal()));
      },
      saveSnapshot: function (data) {
        saveLocal(data);
      }
    };
  }

  function buildApiAdapter() {
    return {
      mode: "api",
      label: apiBaseUrl,
      connected: false,
      load: function () {
        var adapter = this;
        return Promise.all([
          apiRequest("/api/export"),
          apiRequest("/health")
        ]).then(function (responses) {
          adapter.connected = true;
          adapter.label = responses[1].storage || apiBaseUrl;
          return sanitizeExport(responses[0]);
        });
      },
      createTask: function (payload) {
        var adapter = this;
        return apiRequest("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function () {
          return adapter.load().then(function (data) {
            return { data: data };
          });
        });
      },
      updateTask: function (id, payload) {
        var adapter = this;
        return apiRequest("/api/tasks/" + id, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(function () {
          return adapter.load().then(function (data) {
            return { data: data };
          });
        });
      },
      deleteTask: function (id) {
        var adapter = this;
        return apiRequest("/api/tasks/" + id, {
          method: "DELETE"
        }).then(function () {
          return adapter.load().then(function (data) {
            return { data: data };
          });
        });
      },
      reset: function () {
        var adapter = this;
        return apiRequest("/api/dev/reset", {
          method: "POST"
        }).then(function () {
          return adapter.load();
        });
      },
      saveSnapshot: function () {}
    };
  }

  function buildHybridAdapter() {
    var apiAdapter = buildApiAdapter();
    var localAdapter = buildLocalAdapter();

    return {
      mode: "hybrid",
      label: apiBaseUrl,
      connected: false,
      load: function () {
        var store = this;
        return apiAdapter.load().then(function (data) {
          store.connected = true;
          store.mode = "api";
          store.label = apiAdapter.label;
          return data;
        }).catch(function () {
          store.connected = false;
          store.mode = "local";
          store.label = "Browser storage fallback";
          return localAdapter.load();
        });
      },
      createTask: function (payload) {
        return (this.connected ? apiAdapter : localAdapter).createTask(payload);
      },
      updateTask: function (id, payload) {
        return (this.connected ? apiAdapter : localAdapter).updateTask(id, payload);
      },
      deleteTask: function (id) {
        return (this.connected ? apiAdapter : localAdapter).deleteTask(id);
      },
      reset: function () {
        return (this.connected ? apiAdapter : localAdapter).reset();
      },
      saveSnapshot: function (data) {
        if (!this.connected) {
          localAdapter.saveSnapshot(data);
        }
      }
    };
  }

  function buildStore() {
    if (requestedMode !== "api" && requestedMode !== "hybrid") {
      return buildLocalAdapter();
    }

    if (!apiBaseUrl) {
      return buildLocalAdapter();
    }

    if (requestedMode === "api") {
      return buildApiAdapter();
    }

    return buildHybridAdapter();
  }

  root.FocusMatrixData = buildStore();
}(this));
