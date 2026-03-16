(function (root) {
  function weekdayLabel(index) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];
  }

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function dateKey(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("-");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function scoreColor(score) {
    if (score >= 75) return "#3d7a73";
    if (score >= 50) return "#c49a3a";
    return "#c45b4d";
  }

  function calcScore(tasks) {
    if (!tasks || !tasks.length) return 0;

    var total = tasks.length;
    var done = 0;
    var q2All = 0;
    var q2Done = 0;
    var q1All = 0;
    var q1Done = 0;
    var q4 = 0;
    var i;
    var task;

    for (i = 0; i < tasks.length; i += 1) {
      task = tasks[i];
      if (task.done) done += 1;
      if (task.q === "Q2") {
        q2All += 1;
        if (task.done) q2Done += 1;
      }
      if (task.q === "Q1") {
        q1All += 1;
        if (task.done) q1Done += 1;
      }
      if (task.q === "Q4") q4 += 1;
    }

    var completion = (done / total) * 50;
    var strategic = q2All > 0 ? (q2Done / q2All) * 25 : 12;
    var urgent = q1All > 0 ? (q1Done / q1All) * 15 : 8;
    var penalty = Math.min((q4 / total) * 20, 15);

    return Math.round(clamp(completion + strategic + urgent - penalty, 0, 100));
  }

  function gradeChar(score) {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "C+";
    if (score >= 65) return "C";
    if (score >= 55) return "D";
    return "F";
  }

  function suggestQuadrant(text) {
    var value = String(text || "").toLowerCase();
    if (!value) return null;
    if (/(scroll|browse|netflix|reddit|instagram|twitter|tiktok)/.test(value)) return "Q4";
    if (/(urgent|asap|deadline|due today|emergency|critical|immediately)/.test(value) &&
        /(strategy|plan|learn|read|study|build|design|review|write|create|improve)/.test(value)) return "Q1";
    if (/(strategy|plan|learn|read|study|build|design|review|write|create|improve)/.test(value)) return "Q2";
    if (/(reply|email|call|meeting|ping|message)/.test(value)) return "Q3";
    return null;
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function startOfWeek(referenceDate) {
    var date = new Date(referenceDate || todayKey());
    var day = date.getDay();
    var mondayOffset = (day + 6) % 7;
    date.setDate(date.getDate() - mondayOffset);
    return date;
  }

  function buildDaySummary(tasks) {
    var total = tasks.length;
    var done = 0;
    var q2 = 0;
    var q4 = 0;
    var i;
    var task;

    for (i = 0; i < tasks.length; i += 1) {
      task = tasks[i];
      if (task.done) done += 1;
      if (task.q === "Q2") q2 += 1;
      if (task.q === "Q4") q4 += 1;
    }

    var score = calcScore(tasks);

    return {
      totalTasks: total,
      doneTasks: done,
      pendingTasks: total - done,
      completionRate: total ? Math.round((done / total) * 100) : 0,
      strategicRatio: total ? Math.round((q2 / total) * 100) : 0,
      distractionIndex: q4,
      score: score,
      grade: gradeChar(score),
      scoreColor: scoreColor(score)
    };
  }

  function summarizeWeek(tasks, history, referenceDate) {
    var start = startOfWeek(referenceDate);
    var days = [];
    var totalLogged = 0;
    var scoreCount = 0;
    var scoreTotal = 0;

    for (var i = 0; i < 7; i += 1) {
      var date = new Date(start);
      date.setDate(start.getDate() + i);
      var key = dateKey(date);
      var dayTasks = [];
      var j;
      for (j = 0; j < tasks.length; j += 1) {
        if (tasks[j].date === key) dayTasks.push(tasks[j]);
      }
      var snapshot = history[key];
      var taskCount = dayTasks.length ? dayTasks.length : (snapshot ? snapshot.tasks : 0);
      var score = snapshot ? snapshot.score : calcScore(dayTasks);

      if (taskCount > 0) {
        totalLogged += taskCount;
        scoreTotal += score;
        scoreCount += 1;
      }

      days.push({
        key: key,
        label: weekdayLabel(date.getDay()),
        taskCount: taskCount,
        score: taskCount ? score : 0
      });
    }

    return {
      start: days[0].key,
      end: days[6].key,
      averageScore: scoreCount ? Math.round(scoreTotal / scoreCount) : 0,
      grade: gradeChar(scoreCount ? Math.round(scoreTotal / scoreCount) : 0),
      totalLogged: totalLogged,
      days: days
    };
  }

  function buildDailyInsights(tasks) {
    var summary = buildDaySummary(tasks);
    var insights = [];

    if (!tasks.length) {
      return ["Start with one meaningful Q2 task to generate a useful signal."];
    }

    if (summary.strategicRatio < 25) {
      insights.push("Your Q2 ratio is low today. Protect one deeper-work block before reactive tasks take over.");
    } else {
      insights.push("You have a healthy share of strategic work in the notebook today.");
    }

    if (summary.distractionIndex > 0) {
      insights.push("You logged at least one Q4 distraction. That is useful signal, not failure.");
    }

    if (summary.completionRate >= 60) {
      insights.push("Execution is moving. Keep the list tight and finish the next open loop.");
    } else {
      insights.push("Reduce scope. A shorter list will improve follow-through and the score.");
    }

    return insights;
  }

  root.FocusMatrixAnalytics = {
    calcScore: calcScore,
    gradeChar: gradeChar,
    scoreColor: scoreColor,
    suggestQuadrant: suggestQuadrant,
    todayKey: todayKey,
    buildDaySummary: buildDaySummary,
    summarizeWeek: summarizeWeek,
    buildDailyInsights: buildDailyInsights
  };
}(this));
