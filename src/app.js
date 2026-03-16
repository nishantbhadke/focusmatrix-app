(function () {
  var analytics = window.FocusMatrixAnalytics;
  var dataStore = window.FocusMatrixData;
  var state = { data: dataStore.load(), currentView: "today" };

  var quadrantMeta = {
    Q1: { title: "Q1 - Do First", description: "Urgent and important", color: "#c45b4d" },
    Q2: { title: "Q2 - Schedule", description: "Important, not urgent", color: "#3d7a73" },
    Q3: { title: "Q3 - Delegate", description: "Urgent, less important", color: "#c49a3a" },
    Q4: { title: "Q4 - Eliminate", description: "Neither urgent nor important", color: "#7f8a98" }
  };

  function qs(id) { return document.getElementById(id); }

  function todayTasks() {
    var today = analytics.todayKey();
    return state.data.tasks
      .filter(function (task) { return task.date === today; })
      .sort(function (left, right) { return left.ts - right.ts; });
  }

  function persist() {
    var summary = analytics.buildDaySummary(todayTasks());
    state.data.history[analytics.todayKey()] = { score: summary.score, tasks: summary.totalTasks };
    dataStore.save(state.data);
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

  function renderTop() {
    var tasks = todayTasks();
    var summary = analytics.buildDaySummary(tasks);
    var radius = 2 * Math.PI * 48;
    var offset = radius - (summary.score / 100) * radius;

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
    qs("miniTaskCount").textContent = String(summary.totalTasks);
    qs("miniDoneCount").textContent = String(summary.doneTasks);
    qs("miniScore").textContent = summary.score + "%";
    qs("dailyPrompt").textContent = summary.strategicRatio < 25
      ? "Your notebook is reactive right now. Add one calmer Q2 task before anything else."
      : "You already have strategic work on the page. Protect it before the day fragments.";
  }

  function taskHtml(task) {
    return [
      '<article class="task-item', task.done ? ' done' : '', '">',
      '<input class="task-check" type="checkbox" aria-label="Toggle task" data-action="toggle" data-id="', task.id, '"', task.done ? ' checked' : '', '>',
      '<div class="task-content">',
      '<strong>', escapeHtml(task.text), '</strong>',
      '<div class="task-meta">',
      '<span>', quadrantMeta[task.q].title, '</span>',
      '<span>', escapeHtml(task.cat), '</span>',
      '<span>', escapeHtml(task.energy), ' energy</span>',
      '</div>',
      '</div>',
      '<div class="task-actions"><button class="task-action" type="button" data-action="delete" data-id="', task.id, '">Delete</button></div>',
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
    var streak = 0;
    for (var i = 0; i < 30; i += 1) {
      var date = new Date();
      date.setDate(date.getDate() - i);
      var key = date.toISOString().slice(0, 10);
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
      { label: "Do First", count: tasks.filter(function (task) { return task.q === "Q1"; }).length, color: "#c45b4d" },
      { label: "Schedule", count: tasks.filter(function (task) { return task.q === "Q2"; }).length, color: "#3d7a73" },
      { label: "Delegate", count: tasks.filter(function (task) { return task.q === "Q3"; }).length, color: "#c49a3a" },
      { label: "Eliminate", count: tasks.filter(function (task) { return task.q === "Q4"; }).length, color: "#7f8a98" }
    ];

    qs("metricCompletion").textContent = summary.completionRate + "%";
    qs("metricStrategic").textContent = summary.strategicRatio + "%";
    qs("metricDistraction").textContent = String(summary.distractionIndex);
    qs("metricStreak").textContent = calculateStreak() + "d";

    qs("quadrantBars").innerHTML = bars.map(function (bar) {
      var width = tasks.length ? Math.round((bar.count / tasks.length) * 100) : 0;
      return '<div class="meter-row"><div class="meter-head"><span>' + bar.label + '</span><strong>' + bar.count + '</strong></div><div class="meter-track"><div class="meter-fill" style="width:' + width + '%; background:' + bar.color + ';"></div></div></div>';
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
    var week = analytics.summarizeWeek(state.data.tasks, state.data.history, analytics.todayKey());
    qs("weeklyRange").textContent = week.start + " to " + week.end;
    qs("weeklyScore").textContent = week.averageScore + "%";
    qs("weekStrip").innerHTML = week.days.map(function (day) {
      return '<div class="day-card"><strong>' + (day.score || "-") + '</strong><span>' + day.label + ' • ' + day.taskCount + ' tasks</span></div>';
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
    persist();
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
    qs("pageTitle").textContent = titles[view];
  }

  function addTask(event) {
    event.preventDefault();
    var text = qs("taskText").value.replace(/\s+/g, " ").trim();
    if (!text) return;

    state.data.tasks.push({
      id: state.data.nextId++,
      text: text,
      q: qs("taskQuadrant").value,
      cat: qs("taskCategory").value,
      energy: qs("taskEnergy").value,
      done: false,
      date: analytics.todayKey(),
      ts: Date.now()
    });

    event.target.reset();
    qs("taskQuadrant").value = "Q1";
    qs("taskCategory").value = "work";
    qs("taskEnergy").value = "high";
    renderAll();
    showToast("Task added to the notebook.");
  }

  function handleTaskActions(event) {
    var target = event.target;
    var action = target.getAttribute("data-action");
    if (!action) return;

    var id = Number(target.getAttribute("data-id"));
    var task = state.data.tasks.find(function (item) { return item.id === id; });
    if (!task) return;

    if (action === "toggle") {
      task.done = !task.done;
      renderAll();
      showToast(task.done ? "Nice. Task marked complete." : "Task moved back to open loops.");
    }

    if (action === "delete") {
      state.data.tasks = state.data.tasks.filter(function (item) { return item.id !== id; });
      renderAll();
      showToast("Task removed.");
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

  Array.prototype.forEach.call(document.querySelectorAll(".nav-tab"), function (node) {
    node.addEventListener("click", function () { setView(node.getAttribute("data-view")); });
  });

  qs("taskForm").addEventListener("submit", addTask);
  qs("suggestButton").addEventListener("click", suggestQuadrant);
  qs("pendingList").addEventListener("click", handleTaskActions);
  qs("completedList").addEventListener("click", handleTaskActions);
  qs("resetDemoButton").addEventListener("click", function () {
    state.data = dataStore.reset();
    renderAll();
    showToast("Sample notebook restored.");
  });

  renderAll();
  setView("today");
}());
