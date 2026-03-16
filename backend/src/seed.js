'use strict';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function seedHistory() {
  const history = {};
  const entries = [
    { ago: 6, score: 58, tasks: 5 },
    { ago: 5, score: 72, tasks: 7 },
    { ago: 4, score: 48, tasks: 4 },
    { ago: 3, score: 81, tasks: 8 },
    { ago: 2, score: 66, tasks: 6 },
    { ago: 1, score: 74, tasks: 6 }
  ];

  for (const entry of entries) {
    const date = new Date();
    date.setDate(date.getDate() - entry.ago);
    history[date.toISOString().slice(0, 10)] = {
      score: entry.score,
      tasks: entry.tasks
    };
  }

  return history;
}

function createSeedData() {
  const today = todayKey();
  const now = Date.now();

  return {
    version: 1,
    profile: {
      id: 'default-user',
      email: null,
      name: 'FocusMatrix User',
      timezone: 'Asia/Calcutta'
    },
    tasks: [
      { id: 1, text: 'Finalize Q2 product roadmap', q: 'Q2', cat: 'work', energy: 'high', done: true, date: today, ts: now - 3600000 },
      { id: 2, text: 'Fix critical login bug', q: 'Q1', cat: 'work', energy: 'high', done: true, date: today, ts: now - 3200000 },
      { id: 3, text: 'Reply to client emails', q: 'Q3', cat: 'work', energy: 'medium', done: true, date: today, ts: now - 2800000 },
      { id: 4, text: 'Read Deep Work chapter 3', q: 'Q2', cat: 'learning', energy: 'medium', done: false, date: today, ts: now - 2400000 },
      { id: 5, text: 'Prepare weekly team standup', q: 'Q1', cat: 'work', energy: 'medium', done: false, date: today, ts: now - 2000000 },
      { id: 6, text: 'Plan workout for this week', q: 'Q2', cat: 'health', energy: 'low', done: false, date: today, ts: now - 1600000 },
      { id: 7, text: 'Scroll Twitter feed', q: 'Q4', cat: 'personal', energy: 'low', done: false, date: today, ts: now - 1200000 }
    ],
    history: seedHistory(),
    nextTaskId: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  createSeedData,
  todayKey
};
