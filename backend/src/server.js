'use strict';

const http = require('http');
const { URL } = require('url');
const {
  CATEGORIES,
  ENERGY_LEVELS,
  QUADRANTS,
  summarizeDay,
  summarizeWeek,
  suggestQuadrant
} = require('./analytics');
const {
  normalizeDate,
  getStore
} = require('./store');
const { getCache } = require('./cache');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendNoContent(response) {
  response.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end();
}

function sendError(response, error) {
  const statusCode = error.statusCode || 500;
  sendJson(response, statusCode, {
    error: error.message || 'Internal server error',
    details: error.details || undefined
  });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        const parseError = new Error('Request body must be valid JSON');
        parseError.statusCode = 400;
        reject(parseError);
      }
    });
    request.on('error', reject);
  });
}

function parseBoolean(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

async function router(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const cache = await getCache();

  if (request.method === 'OPTIONS') {
    sendNoContent(response);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    const store = await getStore();
    sendJson(response, 200, {
      status: 'ok',
      service: 'focusmatrix-backend',
      storage: store.storageLabel,
      driver: store.kind,
      cache: {
        driver: cache.kind,
        connected: cache.connected
      },
      now: new Date().toISOString()
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/meta') {
    const cacheKey = 'meta';
    const cached = await cache.get(cacheKey);
    if (cached) {
      sendJson(response, 200, cached);
      return;
    }

    const payload = {
      quadrants: QUADRANTS,
      categories: CATEGORIES,
      energyLevels: ENERGY_LEVELS
    };
    await cache.set(cacheKey, payload, 3600);
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/tasks') {
    const store = await getStore();
    const filters = {
      date: url.searchParams.get('date') || undefined,
      from: url.searchParams.get('from') || undefined,
      to: url.searchParams.get('to') || undefined,
      q: url.searchParams.get('q') || undefined,
      cat: url.searchParams.get('cat') || undefined,
      done: parseBoolean(url.searchParams.get('done'))
    };
    const cacheKey = 'tasks:' + JSON.stringify(filters);
    const cached = await cache.get(cacheKey);
    if (cached) {
      sendJson(response, 200, cached);
      return;
    }

    const { tasks } = await store.getTasks(filters);
    const payload = {
      items: tasks,
      count: tasks.length
    };

    await cache.set(cacheKey, payload);
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/tasks') {
    const store = await getStore();
    const payload = await readJsonBody(request);
    const task = await store.createTask(payload);
    await cache.invalidateViews();
    sendJson(response, 201, { item: task });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/dashboard') {
    const store = await getStore();
    const date = await normalizeDate(url.searchParams.get('date') || undefined);
    const cacheKey = 'dashboard:' + date;
    const cached = await cache.get(cacheKey);
    if (cached) {
      sendJson(response, 200, cached);
      return;
    }

    const { tasks } = await store.getTasks({ date });
    const payload = {
      date,
      summary: summarizeDay(tasks),
      items: tasks
    };
    await cache.set(cacheKey, payload);
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/report/weekly') {
    const store = await getStore();
    const referenceDate = await normalizeDate(url.searchParams.get('date') || undefined);
    const cacheKey = 'weekly:' + referenceDate;
    const cached = await cache.get(cacheKey);
    if (cached) {
      sendJson(response, 200, cached);
      return;
    }

    const snapshot = await store.readStore();
    const payload = summarizeWeek(referenceDate, snapshot.tasks, snapshot.history || {});
    await cache.set(cacheKey, payload);
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/suggestions/quadrant') {
    const text = url.searchParams.get('text') || '';
    sendJson(response, 200, {
      text,
      suggestedQuadrant: suggestQuadrant(text)
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/export') {
    const store = await getStore();
    const cacheKey = 'export';
    const cached = await cache.get(cacheKey);
    if (cached) {
      sendJson(response, 200, cached);
      return;
    }

    const payload = await store.readStore();
    await cache.set(cacheKey, payload);
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/dev/reset') {
    const store = await getStore();
    const payload = await store.resetStore();
    await cache.invalidateViews();
    sendJson(response, 200, payload);
    return;
  }

  const taskIdMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskIdMatch && request.method === 'PATCH') {
    const store = await getStore();
    const payload = await readJsonBody(request);
    const task = await store.updateTask(Number(taskIdMatch[1]), payload);
    await cache.invalidateViews();
    sendJson(response, 200, { item: task });
    return;
  }

  if (taskIdMatch && request.method === 'DELETE') {
    const store = await getStore();
    const task = await store.deleteTask(Number(taskIdMatch[1]));
    await cache.invalidateViews();
    sendJson(response, 200, { item: task });
    return;
  }

  sendJson(response, 404, {
    error: 'Route not found'
  });
}

const server = http.createServer((request, response) => {
  router(request, response).catch((error) => {
    sendError(response, error);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`FocusMatrix backend listening on http://${HOST}:${PORT}`);
});
