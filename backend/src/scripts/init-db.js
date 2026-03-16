'use strict';

const { getStore } = require('../store');

(async function main() {
  const store = await getStore();
  console.log(`Storage driver ready: ${store.kind}`);
  console.log(`Storage label: ${store.storageLabel}`);
}()).catch((error) => {
  console.error(error);
  process.exit(1);
});
