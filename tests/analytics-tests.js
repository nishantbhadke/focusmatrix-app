var fso = new ActiveXObject("Scripting.FileSystemObject");
var analyticsSource = fso.OpenTextFile("src\\analytics.js", 1).ReadAll();
eval(analyticsSource);

var analytics = this.FocusMatrixAnalytics;
var failures = [];

function assertEqual(actual, expected, label) {
  if (actual !== expected) failures.push(label + " | expected: " + expected + " | actual: " + actual);
}

function assertTruthy(value, label) {
  if (!value) failures.push(label + " | expected truthy value");
}

var score = analytics.calcScore([
  { q: "Q2", done: true },
  { q: "Q1", done: true },
  { q: "Q4", done: false },
  { q: "Q2", done: false }
]);

assertEqual(score, 48, "calcScore balances completion, strategic work, and distraction penalty");
assertEqual(analytics.gradeChar(86), "A", "gradeChar maps score bands correctly");
assertEqual(analytics.suggestQuadrant("Review product strategy memo"), "Q2", "suggestQuadrant detects strategic work");
assertEqual(analytics.suggestQuadrant("Reply to customer email"), "Q3", "suggestQuadrant detects reactive work");
assertEqual(analytics.suggestQuadrant("Scroll twitter feed"), "Q4", "suggestQuadrant detects distractions");

var week = analytics.summarizeWeek(
  [
    { date: analytics.todayKey(), q: "Q2", done: true },
    { date: analytics.todayKey(), q: "Q1", done: false }
  ],
  {},
  analytics.todayKey()
);

assertTruthy(week.days.length === 7, "summarizeWeek returns seven days");
assertTruthy(typeof week.averageScore === "number", "summarizeWeek returns an average score");

if (failures.length) {
  WScript.Echo("FAILED");
  for (var i = 0; i < failures.length; i += 1) WScript.Echo("- " + failures[i]);
  WScript.Quit(1);
}

WScript.Echo("PASS: analytics tests");
