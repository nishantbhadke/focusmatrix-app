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
  dataFile,
  getTasks,
  normalizeDate,
  readStore,
  createTask,
  updateTask,
  deleteTask
} = require('./store');

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

  if (request.method === 'OPTIONS') {
    sendNoContent(response);
    return;
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      service: 'focusmatrix-backend',
      storage: dataFile,
      now: new Date().toISOString()
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/meta') {
    sendJson(response, 200, {
      quadrants: QUADRANTS,
      categories: CATEGORIES,
      energyLevels: ENERGY_LEVELS
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/tasks') {
    const { tasks } = getTasks({
      date: url.searchParams.get('date') || undefined,
      from: url.searchParams.get('from') || undefined,
      to: url.searchParams.get('to') || undefined,
      q: url.searchParams.get('q') || undefined,
      cat: url.searchParams.get('cat') || undefined,
      done: parseBoolean(url.searchParams.get('done'))
    });

    sendJson(response, 200, {
      items: tasks,
      count: tasks.length
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/tasks') {
    const payload = await readJsonBody(request);
    const task = createTask(payload);
    sendJson(response, 201, { item: task });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/dashboard') {
    const date = normalizeDate(url.searchParams.get('date') || undefined);
    const { tasks } = getTasks({ date });
    sendJson(response, 200, {
      date,
      summary: summarizeDay(tasks),
      items: tasks
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/report/weekly') {
    const referenceDate = normalizeDate(url.searchParams.get('date') || undefined);
    const store = readStore();
    sendJson(response, 200, summarizeWeek(referenceDate, store.tasks, store.history || {}));
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
    const store = readStore();
    sendJson(response, 200, store);
    return;
  }

  const taskIdMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (taskIdMatch && request.method === 'PATCH') {
    const payload = await readJsonBody(request);
    const task = updateTask(Number(taskIdMatch[1]), payload);
    sendJson(response, 200, { item: task });
    return;
  }

  if (taskIdMatch && request.method === 'DELETE') {
    const task = deleteTask(Number(taskIdMatch[1]));
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
