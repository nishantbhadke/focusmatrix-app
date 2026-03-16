'use strict';

const fs = require('fs');
const path = require('path');
const { createSeedData, todayKey } = require('./seed');
const { calcScore } = require('./analytics');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'focusmatrix.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(createSeedData(), null, 2));
  }
}

function readStore() {
  ensureStore();
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

function writeStore(data) {
  const next = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(dataFile, JSON.stringify(next, null, 2));
  return next;
}

function normalizeDate(value) {
  if (!value) {
    return todayKey();
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date. Expected YYYY-MM-DD.');
  }

  return parsed.toISOString().slice(0, 10);
}

function sortTasks(tasks) {
  return [...tasks].sort((left, right) => left.ts - right.ts);
}

function getTasks(filters = {}) {
  const store = readStore();
  let tasks = store.tasks;

  if (filters.date) {
    const date = normalizeDate(filters.date);
    tasks = tasks.filter((task) => task.date === date);
  }

  if (filters.from) {
    const from = normalizeDate(filters.from);
    tasks = tasks.filter((task) => task.date >= from);
  }

  if (filters.to) {
    const to = normalizeDate(filters.to);
    tasks = tasks.filter((task) => task.date <= to);
  }

  if (filters.done === true || filters.done === false) {
    tasks = tasks.filter((task) => task.done === filters.done);
  }

  if (filters.q) {
    tasks = tasks.filter((task) => task.q === filters.q);
  }

  if (filters.cat) {
    tasks = tasks.filter((task) => task.cat === filters.cat);
  }

  return {
    store,
    tasks: sortTasks(tasks)
  };
}

function refreshHistory(store, date) {
  const dayTasks = store.tasks.filter((task) => task.date === date);
  if (!store.history) {
    store.history = {};
  }
  store.history[date] = {
    score: calcScore(dayTasks),
    tasks: dayTasks.length
  };
}

function validateTaskPayload(payload, { partial = false } = {}) {
  const errors = [];
  const allowedQuadrants = new Set(['Q1', 'Q2', 'Q3', 'Q4']);
  const allowedCategories = new Set(['work', 'personal', 'health', 'learning', 'admin', 'creative']);
  const allowedEnergy = new Set(['high', 'medium', 'low']);

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'text')) {
    if (typeof payload.text !== 'string' || payload.text.trim().length === 0) {
      errors.push('text is required');
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'q')) {
    if (!allowedQuadrants.has(payload.q)) {
      errors.push('q must be one of Q1, Q2, Q3, Q4');
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'cat')) {
    if (!allowedCategories.has(payload.cat)) {
      errors.push('cat must be a valid category');
    }
  }

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'energy')) {
    if (!allowedEnergy.has(payload.energy)) {
      errors.push('energy must be high, medium, or low');
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'done') && typeof payload.done !== 'boolean') {
    errors.push('done must be a boolean');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'date')) {
    try {
      normalizeDate(payload.date);
    } catch (error) {
      errors.push(error.message);
    }
  }

  return errors;
}

function createTask(payload) {
  const errors = validateTaskPayload(payload);
  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  const store = readStore();
  const date = normalizeDate(payload.date);
  const task = {
    id: store.nextTaskId,
    text: payload.text.trim(),
    q: payload.q,
    cat: payload.cat,
    energy: payload.energy,
    done: Boolean(payload.done),
    date,
    ts: Date.now()
  };

  store.tasks.push(task);
  store.nextTaskId += 1;
  refreshHistory(store, date);
  writeStore(store);

  return task;
}

function updateTask(id, payload) {
  const errors = validateTaskPayload(payload, { partial: true });
  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  const store = readStore();
  const task = store.tasks.find((entry) => entry.id === id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const previousDate = task.date;
  if (Object.prototype.hasOwnProperty.call(payload, 'text')) task.text = payload.text.trim();
  if (Object.prototype.hasOwnProperty.call(payload, 'q')) task.q = payload.q;
  if (Object.prototype.hasOwnProperty.call(payload, 'cat')) task.cat = payload.cat;
  if (Object.prototype.hasOwnProperty.call(payload, 'energy')) task.energy = payload.energy;
  if (Object.prototype.hasOwnProperty.call(payload, 'done')) task.done = payload.done;
  if (Object.prototype.hasOwnProperty.call(payload, 'date')) task.date = normalizeDate(payload.date);

  refreshHistory(store, previousDate);
  refreshHistory(store, task.date);
  writeStore(store);

  return task;
}

function deleteTask(id) {
  const store = readStore();
  const task = store.tasks.find((entry) => entry.id === id);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  store.tasks = store.tasks.filter((entry) => entry.id !== id);
  refreshHistory(store, task.date);
  writeStore(store);

  return task;
}

module.exports = {
  dataFile,
  getTasks,
  normalizeDate,
  readStore,
  createTask,
  updateTask,
  deleteTask
};
