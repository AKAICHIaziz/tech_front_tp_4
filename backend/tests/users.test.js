// Tests de l'API /api/users avec le test runner intégré de Node (node --test)
process.env.DB_FILE = ':memory:'; // base temporaire, ne touche pas database.sqlite

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

let server;
let baseUrl;

before(() => {
  server = app.listen(0); // port libre choisi automatiquement
  baseUrl = `http://localhost:${server.address().port}/api/users`;
});

after(() => server.close());

const postUser = (body) =>
  fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('GET /api/users renvoie Alice et Bob', async () => {
  const res = await fetch(baseUrl);
  assert.strictEqual(res.status, 200);
  const users = await res.json();
  assert.deepStrictEqual(users.map(u => u.name), ['Alice', 'Bob']);
});

test('POST /api/users crée un utilisateur', async () => {
  const res = await postUser({ name: 'Carol', email: 'carol@example.com' });
  assert.strictEqual(res.status, 201);
  const user = await res.json();
  assert.strictEqual(user.name, 'Carol');
  assert.ok(user.id);
});

test('POST /api/users refuse un nom vide (400)', async () => {
  const res = await postUser({ name: '', email: 'x@example.com' });
  assert.strictEqual(res.status, 400);
});

test('POST /api/users refuse un email déjà utilisé (409)', async () => {
  const res = await postUser({ name: 'Alice 2', email: 'alice@example.com' });
  assert.strictEqual(res.status, 409);
});

test('DELETE /api/users/:id supprime puis renvoie 404', async () => {
  const first = await fetch(`${baseUrl}/2`, { method: 'DELETE' });
  assert.strictEqual(first.status, 204);
  const second = await fetch(`${baseUrl}/2`, { method: 'DELETE' });
  assert.strictEqual(second.status, 404);
});
