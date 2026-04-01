'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const analyticsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'analytics.js'), 'utf8');
const context = { console };
context.window = context;
context.this = context;
vm.createContext(context);
vm.runInContext(analyticsSource, context);

const analytics = context.FocusMatrixAnalytics;
const failures = [];

function assertEqual(actual, expected, label) {
  if (actual !== expected) failures.push(`${label} | expected: ${expected} | actual: ${actual}`);
}

function assertTruthy(value, label) {
  if (!value) failures.push(`${label} | expected truthy value`);
}

const score = analytics.calcScore([
  { q: 'Q2', done: true },
  { q: 'Q1', done: true },
  { q: 'Q4', done: false },
  { q: 'Q2', done: false }
]);

assertEqual(score, 48, 'calcScore balances completion, strategic work, and distraction penalty');
assertEqual(analytics.gradeChar(86), 'A', 'gradeChar maps score bands correctly');
assertEqual(analytics.suggestQuadrant('Review product strategy memo'), 'Q2', 'suggestQuadrant detects strategic work');
assertEqual(analytics.suggestQuadrant('Reply to customer email'), 'Q3', 'suggestQuadrant detects reactive work');
assertEqual(analytics.suggestQuadrant('Scroll twitter feed'), 'Q4', 'suggestQuadrant detects distractions');

const week = analytics.summarizeWeek(
  [
    { date: analytics.todayKey(), q: 'Q2', done: true },
    { date: analytics.todayKey(), q: 'Q1', done: false }
  ],
  {},
  analytics.todayKey()
);

assertTruthy(week.days.length === 7, 'summarizeWeek returns seven days');
assertTruthy(typeof week.averageScore === 'number', 'summarizeWeek returns an average score');

if (failures.length) {
  console.error('FAILED');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log('PASS: analytics tests');
