'use strict';

const { MongoClient } = require('mongodb');
const { createSeedData, todayKey } = require('../seed');
const { calcScore } = require('../analytics');

function normalizeDate(value) {
  if (!value) return todayKey();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date. Expected YYYY-MM-DD.');
  }
  return parsed.toISOString().slice(0, 10);
}

function createValidationError(errors) {
  const error = new Error('Validation failed');
  error.statusCode = 400;
  error.details = errors;
  return error;
}

function validateTaskPayload(payload, options) {
  const partial = options && options.partial;
  const errors = [];
  const allowedQuadrants = { Q1: true, Q2: true, Q3: true, Q4: true };
  const allowedCategories = { work: true, personal: true, health: true, learning: true, admin: true, creative: true };
  const allowedEnergy = { high: true, medium: true, low: true };

  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'text')) {
    if (typeof payload.text !== 'string' || payload.text.trim().length === 0) errors.push('text is required');
  }
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'q')) {
    if (!allowedQuadrants[payload.q]) errors.push('q must be one of Q1, Q2, Q3, Q4');
  }
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'cat')) {
    if (!allowedCategories[payload.cat]) errors.push('cat must be a valid category');
  }
  if (!partial || Object.prototype.hasOwnProperty.call(payload, 'energy')) {
    if (!allowedEnergy[payload.energy]) errors.push('energy must be high, medium, or low');
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

function mapTask(doc) {
  return {
    id: doc.id,
    text: doc.text,
    q: doc.q,
    cat: doc.cat,
    energy: doc.energy,
    done: doc.done,
    date: doc.date,
    ts: doc.ts
  };
}

async function createMongoStore() {
  const client = new MongoClient(process.env.MONGODB_URL);
  await client.connect();

  const dbName = process.env.MONGODB_DB || 'focusmatrix';
  const db = client.db(dbName);
  const tasks = db.collection('tasks');
  const history = db.collection('daily_history');
  const appState = db.collection('app_state');

  await tasks.createIndex({ id: 1 }, { unique: true });
  await tasks.createIndex({ date: 1 });
  await history.createIndex({ date: 1 }, { unique: true });
  await appState.createIndex({ singleton: 1 }, { unique: true });

  const existingState = await appState.findOne({ singleton: true });
  if (!existingState) {
    await resetCollections();
  }

  async function resetCollections() {
    const seed = createSeedData();
    await tasks.deleteMany({});
    await history.deleteMany({});
    await appState.deleteMany({});

    await appState.insertOne({
      singleton: true,
      nextTaskId: seed.nextTaskId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (seed.tasks.length) await tasks.insertMany(seed.tasks);

    const historyDocs = [];
    Object.keys(seed.history).forEach((date) => {
      historyDocs.push({ date: date, score: seed.history[date].score, taskCount: seed.history[date].tasks });
    });
    if (historyDocs.length) await history.insertMany(historyDocs);
  }

  async function refreshHistory(date) {
    const dayTasks = await tasks.find({ date: date }).sort({ ts: 1 }).toArray();
    await history.updateOne(
      { date: date },
      { $set: { date: date, score: calcScore(dayTasks), taskCount: dayTasks.length } },
      { upsert: true }
    );
  }

  return {
    kind: 'mongo',
    storageLabel: 'mongodb',
    normalizeDate,
    async getTasks(filters) {
      const query = {};
      if (filters && filters.date) query.date = normalizeDate(filters.date);
      if (filters && filters.from) query.date = Object.assign({}, query.date || {}, { $gte: normalizeDate(filters.from) });
      if (filters && filters.to) query.date = Object.assign({}, query.date || {}, { $lte: normalizeDate(filters.to) });
      if (filters && (filters.done === true || filters.done === false)) query.done = filters.done;
      if (filters && filters.q) query.q = filters.q;
      if (filters && filters.cat) query.cat = filters.cat;

      const result = await tasks.find(query).sort({ ts: 1 }).toArray();
      return {
        store: await this.readStore(),
        tasks: result.map(mapTask)
      };
    },
    async readStore() {
      const state = await appState.findOne({ singleton: true });
      const taskRows = await tasks.find({}).sort({ ts: 1 }).toArray();
      const historyRows = await history.find({}).sort({ date: 1 }).toArray();
      const historyMap = {};
      historyRows.forEach((row) => {
        historyMap[row.date] = { score: row.score, tasks: row.taskCount };
      });

      return {
        nextTaskId: state.nextTaskId,
        tasks: taskRows.map(mapTask),
        history: historyMap
      };
    },
    async createTask(payload) {
      const errors = validateTaskPayload(payload);
      if (errors.length) throw createValidationError(errors);

      const state = await appState.findOne({ singleton: true });
      const task = {
        id: state.nextTaskId,
        text: payload.text.trim(),
        q: payload.q,
        cat: payload.cat,
        energy: payload.energy,
        done: Boolean(payload.done),
        date: normalizeDate(payload.date),
        ts: Date.now()
      };

      await tasks.insertOne(task);
      await appState.updateOne(
        { singleton: true },
        { $set: { nextTaskId: state.nextTaskId + 1, updatedAt: new Date() } }
      );
      await refreshHistory(task.date);
      return task;
    },
    async updateTask(id, payload) {
      const errors = validateTaskPayload(payload, { partial: true });
      if (errors.length) throw createValidationError(errors);

      const current = await tasks.findOne({ id: id });
      if (!current) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }

      const next = {
        text: Object.prototype.hasOwnProperty.call(payload, 'text') ? payload.text.trim() : current.text,
        q: Object.prototype.hasOwnProperty.call(payload, 'q') ? payload.q : current.q,
        cat: Object.prototype.hasOwnProperty.call(payload, 'cat') ? payload.cat : current.cat,
        energy: Object.prototype.hasOwnProperty.call(payload, 'energy') ? payload.energy : current.energy,
        done: Object.prototype.hasOwnProperty.call(payload, 'done') ? payload.done : current.done,
        date: Object.prototype.hasOwnProperty.call(payload, 'date') ? normalizeDate(payload.date) : current.date
      };

      await tasks.updateOne({ id: id }, { $set: next });
      await refreshHistory(current.date);
      await refreshHistory(next.date);
      return mapTask(Object.assign({}, current, next));
    },
    async deleteTask(id) {
      const current = await tasks.findOne({ id: id });
      if (!current) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }
      await tasks.deleteOne({ id: id });
      await refreshHistory(current.date);
      return mapTask(current);
    },
    async resetStore() {
      await resetCollections();
      return this.readStore();
    }
  };
}

module.exports = {
  createMongoStore
};
