import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

async function withServer(fn) {
  const server = createApp().listen(0);
  const { port } = server.address();
  try { await fn(`http://127.0.0.1:${port}`); } finally { server.close(); }
}

test('GET /tasks starts empty', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/tasks`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  });
});

test('POST /tasks creates a task', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'hello' }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.title, 'hello');
    assert.equal(body.id, 1);
  });
});
