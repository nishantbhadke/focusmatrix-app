'use strict';

const jsonStore = require('./providers/jsonStore');
const { createMongoStore } = require('./providers/mongoStore');

let storePromise;

async function getStore() {
  if (!storePromise) {
    storePromise = (async () => {
      if (process.env.MONGODB_URL) {
        return createMongoStore();
      }
      return jsonStore;
    })();
  }
  return storePromise;
}

async function normalizeDate(value) {
  const store = await getStore();
  return store.normalizeDate(value);
}

module.exports = {
  getStore,
  normalizeDate
};
