'use strict';

const { getStore } = require('../store');

(async function main() {
  const store = await getStore();
  const before = await store.readStore();
  const created = await store.createTask({
    text: 'Mongo persistence smoke test',
    q: 'Q2',
    cat: 'work',
    energy: 'high',
    done: false,
    date: '2026-03-17'
  });
  const after = await store.getTasks({ date: '2026-03-17' });

  console.log(JSON.stringify({
    driver: store.kind,
    beforeCount: before.tasks.length,
    createdId: created.id,
    totalForDate: after.tasks.length,
    foundCreatedTask: after.tasks.some((task) => task.id === created.id)
  }, null, 2));
}()).catch((error) => {
  console.error(error);
  process.exit(1);
});
