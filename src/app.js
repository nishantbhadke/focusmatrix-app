(function () {
  var analytics = window.FocusMatrixAnalytics;
  var dataStore = window.FocusMatrixData;
  var config = window.FocusMatrixConfig || {};
  var state = { data: null, currentView: "today", busy: false };

  var quadrantMeta = {
    Q1: { title: "Q1 - Do First", description: "Urgent and important", color: "#d05f4d" },
    Q2: { title: "Q2 - Schedule", description: "Important, not urgent", color: "#2b7a69" },
    Q3: { title: "Q3 - Delegate", description: "Urgent, less important", color: "#b9871f" },
    Q4: { title: "Q4 - Eliminate", description: "Neither urgent nor important", color: "#708090" }
  };

  function qs(id) { return document.getElementById(id); }

  function currentDate() {
    return analytics.todayKey();
  }

  function todayTasks() {
    if (!state.data) return [];
    return state.data.tasks
      .filter(function (task) { return task.date === currentDate(); })
      .sort(function (left, right) { return left.ts - right.ts; });
  }

  function persistLocalHistory() {
    if (!state.data) return;
    if (dataStore.mode === "api" || dataStore.connected) return;

    var summary = analytics.buildDaySummary(todayTasks());
    state.data.history[currentDate()] = { score: summary.score, tasks: summary.totalTasks };
    if (typeof dataStore.saveSnapshot === "function") {
      dataStore.saveSnapshot(state.data);
    }
  }

  function showToast(message) {
    var toast = qs("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setConnectionBadge() {
    var node = qs("connectionMode");
    if (!node) return;

    if (dataStore.connected) {
      node.textContent = "Mongo API";
      node.className = "badge-pill badge-live";
      return;
    }

    node.textContent = dataStore.mode === "api" ? "Offline" : "Local only";
    node.className = "badge-pill";
  }

  function renderTop() {
    var tasks = todayTasks();
    var summary = analytics.buildDaySummary(tasks);
    var radius = 2 * Math.PI * 48;
    var offset = radius - (summary.score / 100) * radius;
    var miniTaskCount = qs("miniTaskCount");
    var miniDoneCount = qs("miniDoneCount");
    var miniScore = qs("miniScore");
    var dailyPrompt = qs("dailyPrompt");

    qs("todayBadge").textContent = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
    qs("heroScore").textContent = summary.score + "%";
    qs("heroGrade").textContent = summary.grade;
    qs("heroRing").style.stroke = summary.scoreColor;
    qs("heroRing").style.strokeDasharray = radius.toFixed(1);
    qs("heroRing").style.strokeDashoffset = offset.toFixed(1);

    if (miniTaskCount) miniTaskCount.textContent = String(summary.totalTasks);
    if (miniDoneCount) miniDoneCount.textContent = String(summary.doneTasks);
    if (miniScore) miniScore.textContent = summary.score + "%";

    if (dailyPrompt && !config.lockDailyPrompt) {
      dailyPrompt.textContent = summary.strategicRatio < 25
        ? "Your notebook is reactive right now. Add one calmer Q2 task before anything else."
        : "You already have strategic work on the page. Protect it before the day fragments.";
    }

    setConnectionBadge();
  }

  function taskHtml(task) {
    var hoverNote = task.done
      ? "Completed and counted in today's score"
      : (task.q === "Q2"
        ? "Strategic work. Protect focused time."
        : task.q === "Q1"
          ? "Urgent work. Try to close this early."
          : task.q === "Q3"
            ? "Reactive work. Keep this contained."
            : "Low-value work. Reduce or eliminate.");

    return [
      '<article class="task-item', task.done ? ' done' : '', '">',
      '<input class="task-check" type="checkbox" aria-label="Toggle task" data-action="toggle" data-id="', task.id, '"', task.done ? ' checked' : '', state.busy ? ' disabled' : '', '>',
      '<div class="task-content">',
      '<strong>', escapeHtml(task.text), '</strong>',
      '<div class="task-meta">',
      '<span>', quadrantMeta[task.q].title, '</span>',
      '<span>', escapeHtml(task.cat), '</span>',
      '<span>', escapeHtml(task.energy), ' energy</span>',
      '</div>',
      '</div>',
      '<div class="task-hover-info">',
      '<span class="task-hover-stat">', escapeHtml(task.q), '</span>',
      '<span class="task-hover-text">', escapeHtml(hoverNote), '</span>',
      '</div>',
      '<div class="task-actions"><button class="task-action" type="button" data-action="delete" data-id="', task.id, '"', state.busy ? ' disabled' : '', '>Delete</button></div>',
      '</article>'
    ].join("");
  }

  function renderLists() {
    var tasks = todayTasks();
    var pending = tasks.filter(function (task) { return !task.done; });
    var completed = tasks.filter(function (task) { return task.done; });

    qs("pendingCount").textContent = pending.length + " pending";
    qs("completedCount").textContent = completed.length + " done";
    qs("pendingList").innerHTML = pending.length ? pending.map(taskHtml).join("") : '<div class="empty-state">Everything is clear. Add the next meaningful task above.</div>';
    qs("completedList").innerHTML = completed.length ? completed.map(taskHtml).join("") : '<div class="empty-state">Nothing completed yet. The first finished task shifts the mood of the whole page.</div>';
  }

  function calculateStreak() {
    if (!state.data) return 0;
    var streak = 0;
    for (var i = 0; i < 30; i += 1) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      var key = [
        date.getFullYear(),
        (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1),
        (date.getDate() < 10 ? "0" : "") + date.getDate()
      ].join("-");
      if (state.data.history[key] && state.data.history[key].tasks > 0) streak += 1;
      else break;
    }
    return streak;
  }

  function renderDashboard() {
    var tasks = todayTasks();
    var summary = analytics.buildDaySummary(tasks);
    var insights = analytics.buildDailyInsights(tasks);
    var bars = [
      { label: "Do First", count: tasks.filter(function (task) { return task.q === "Q1"; }).length, color: "#d05f4d", note: "Urgent execution work" },
      { label: "Schedule", count: tasks.filter(function (task) { return task.q === "Q2"; }).length, color: "#2b7a69", note: "Important long-term work" },
      { label: "Delegate", count: tasks.filter(function (task) { return task.q === "Q3"; }).length, color: "#b9871f", note: "Reactive hand-off work" },
      { label: "Eliminate", count: tasks.filter(function (task) { return task.q === "Q4"; }).length, color: "#708090", note: "Noise and distractions" }
    ];

    qs("metricCompletion").textContent = summary.completionRate + "%";
    qs("metricStrategic").textContent = summary.strategicRatio + "%";
    qs("metricDistraction").textContent = String(summary.distractionIndex);
    qs("metricStreak").textContent = calculateStreak() + "d";

    qs("quadrantBars").innerHTML = bars.map(function (bar) {
      var width = tasks.length ? Math.round((bar.count / tasks.length) * 100) : 0;
      return '<div class="meter-row"><div class="meter-head"><span>' + bar.label + '</span><strong>' + bar.count + '</strong></div><div class="meter-track"><div class="meter-fill" style="width:' + width + '%; background:' + bar.color + ';"></div></div><div class="meter-note">' + bar.note + '</div></div>';
    }).join("");

    qs("dailyInsights").innerHTML = insights.map(function (insight) {
      return '<div class="insight-card">' + escapeHtml(insight) + '</div>';
    }).join("");
  }

  function renderMatrix() {
    var tasks = todayTasks();
    qs("matrixGrid").innerHTML = ["Q1", "Q2", "Q3", "Q4"].map(function (key) {
      var group = tasks.filter(function (task) { return task.q === key; });
      return '<section class="matrix-card"><h3>' + quadrantMeta[key].title + '</h3><p>' + quadrantMeta[key].description + '</p><div class="matrix-list">' +
        (group.length ? group.map(function (task) { return '<div class="matrix-note">' + escapeHtml(task.text) + '</div>'; }).join("") : '<div class="empty-state">No tasks here yet.</div>') +
        '</div></section>';
    }).join("");
  }

  function renderWeekly() {
    var week = analytics.summarizeWeek(state.data.tasks, state.data.history, currentDate());
    qs("weeklyRange").textContent = week.start + " to " + week.end;
    qs("weeklyScore").textContent = week.averageScore + "%";
    qs("weekStrip").innerHTML = week.days.map(function (day) {
      return '<div class="day-card"><strong>' + (day.score || "-") + '</strong><span>' + day.label + " • " + day.taskCount + ' tasks</span></div>';
    }).join("");
    qs("weeklyInsights").innerHTML = [
      "Average weekly score: " + week.averageScore + "% (" + week.grade + ").",
      "Total logged tasks this week: " + week.totalLogged + ".",
      week.averageScore >= 70 ? "You are building a visible pattern of execution. Keep the notebook focused." : "Narrow the list next week and prioritize one Q2 task earlier each day."
    ].map(function (insight) {
      return '<div class="insight-card">' + escapeHtml(insight) + '</div>';
    }).join("");
  }

  function renderAll() {
    if (!state.data) return;
    persistLocalHistory();
    renderTop();
    renderLists();
    renderDashboard();
    renderMatrix();
    renderWeekly();
  }

  function setView(view) {
    state.currentView = view;
    Array.prototype.forEach.call(document.querySelectorAll(".view"), function (node) {
      node.classList.toggle("active", node.id === "view-" + view);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".nav-tab"), function (node) {
      node.classList.toggle("active", node.getAttribute("data-view") === view);
    });
    var titles = {
      today: "Today at a glance",
      dashboard: "Behavior dashboard",
      matrix: "Eisenhower matrix",
      report: "Weekly notebook review",
      review: "Shipping checklist"
    };
    qs("pageTitle").textContent = (config.pageTitles && config.pageTitles[view]) || titles[view];
  }

  function withBusy(task) {
    if (state.busy) return Promise.resolve();
    state.busy = true;
    renderLists();

    return task().catch(function (error) {
      showToast(error.message || "Something went wrong.");
    }).finally(function () {
      state.busy = false;
      renderLists();
    });
  }

  function addTask(event) {
    event.preventDefault();
    var text = qs("taskText").value.replace(/\s+/g, " ").trim();
    if (!text) return;

    withBusy(function () {
      return dataStore.createTask({
        text: text,
        q: qs("taskQuadrant").value,
        cat: qs("taskCategory").value,
        energy: qs("taskEnergy").value,
        done: false,
        date: currentDate()
      }).then(function (result) {
        state.data = result.data;
        event.target.reset();
        qs("taskQuadrant").value = "Q1";
        qs("taskCategory").value = "work";
        qs("taskEnergy").value = "high";
        renderAll();
        showToast(dataStore.connected ? "Task saved to Mongo." : "Task added to the notebook.");
      });
    });
  }

  function handleTaskActions(event) {
    var target = event.target;
    var action = target.getAttribute("data-action");
    if (!action) return;

    var id = Number(target.getAttribute("data-id"));
    var task = state.data.tasks.find(function (item) { return item.id === id; });
    if (!task) return;

    if (action === "toggle") {
      withBusy(function () {
        return dataStore.updateTask(id, { done: !task.done }).then(function (result) {
          state.data = result.data;
          renderAll();
          showToast(task.done ? "Task moved back to open loops." : "Nice. Task marked complete.");
        });
      });
    }

    if (action === "delete") {
      withBusy(function () {
        return dataStore.deleteTask(id).then(function (result) {
          state.data = result.data;
          renderAll();
          showToast("Task removed.");
        });
      });
    }
  }

  function suggestQuadrant() {
    var text = qs("taskText").value;
    var suggestion = analytics.suggestQuadrant(text);
    if (!suggestion) {
      qs("suggestionText").textContent = "No strong signal yet. Choose the quadrant manually.";
      showToast("No clear quadrant suggestion for that text.");
      return;
    }

    qs("taskQuadrant").value = suggestion;
    qs("suggestionText").textContent = "Suggested " + quadrantMeta[suggestion].title + " based on your wording.";
    showToast("Suggested " + quadrantMeta[suggestion].title + ".");
  }

  function resetData() {
    withBusy(function () {
      return dataStore.reset().then(function (nextData) {
        state.data = nextData.data || nextData;
        renderAll();
        showToast(dataStore.connected ? "Mongo sample data restored." : "Sample notebook restored.");
      });
    });
  }

  function bindEvents() {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-tab"), function (node) {
      node.addEventListener("click", function () { setView(node.getAttribute("data-view")); });
    });

    qs("taskForm").addEventListener("submit", addTask);
    qs("suggestButton").addEventListener("click", suggestQuadrant);
    qs("pendingList").addEventListener("click", handleTaskActions);
    qs("completedList").addEventListener("click", handleTaskActions);
    qs("resetDemoButton").addEventListener("click", resetData);
  }

  function showBootState(message) {
    var pendingList = qs("pendingList");
    var completedList = qs("completedList");
    if (pendingList) pendingList.innerHTML = '<div class="empty-state">' + escapeHtml(message) + '</div>';
    if (completedList) completedList.innerHTML = '<div class="empty-state">The completed list will appear here.</div>';
  }

  function init() {
    bindEvents();
    setView("today");
    showBootState("Loading your notebook...");

    dataStore.load().then(function (data) {
      state.data = data;
      renderAll();
      if (dataStore.connected) {
        showToast("Connected to Mongo-backed API.");
      }
    }).catch(function (error) {
      showBootState("Unable to load the notebook.");
      showToast(error.message || "Unable to load the notebook.");
    });
  }

  init();
}());
