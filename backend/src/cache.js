'use strict';

const { createClient } = require('redis');

const CACHE_PREFIX = 'focusmatrix:';
const DEFAULT_TTL_SECONDS = 60;

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function withPrefix(key) {
  return CACHE_PREFIX + key;
}

function createNoopCache(reason) {
  return {
    kind: 'memory',
    label: reason || 'disabled',
    connected: false,
    async get() {
      return null;
    },
    async set() {},
    async del() {},
    async invalidateViews() {}
  };
}

async function createValkeyCache() {
  if (!process.env.VALKEY_URL) {
    return createNoopCache('VALKEY_URL not configured');
  }

  const client = createClient({
    url: process.env.VALKEY_URL,
    socket: {
      reconnectStrategy: function (retries) {
        return Math.min(retries * 200, 2000);
      }
    }
  });

  client.on('error', function (error) {
    console.error('Valkey cache error:', error.message);
  });

  await client.connect();

  return {
    kind: 'valkey',
    label: 'valkey',
    connected: true,
    async get(key) {
      return safeParse(await client.get(withPrefix(key)));
    },
    async set(key, value, ttlSeconds) {
      await client.set(withPrefix(key), JSON.stringify(value), {
        EX: ttlSeconds || DEFAULT_TTL_SECONDS
      });
    },
    async del(key) {
      await client.del(withPrefix(key));
    },
    async invalidateViews() {
      const prefixes = [
        'meta',
        'export',
        'dashboard:',
        'weekly:',
        'tasks:'
      ];
      const toDelete = [];

      for await (const key of client.scanIterator({
        MATCH: withPrefix('*'),
        COUNT: 100
      })) {
        if (prefixes.some(function (prefix) {
          return key.indexOf(withPrefix(prefix)) === 0;
        })) {
          toDelete.push(key);
        }
      }

      if (toDelete.length) {
        await client.del(toDelete);
      }
    }
  };
}

let cachePromise;

async function getCache() {
  if (!cachePromise) {
    cachePromise = createValkeyCache().catch(function () {
      return createNoopCache('cache unavailable');
    });
  }

  return cachePromise;
}

module.exports = {
  getCache
};
