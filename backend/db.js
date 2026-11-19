// Bonus : vraie base de données SQLite (module natif node:sqlite, Node >= 22.13)
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// DB_FILE=":memory:" permet aux tests d'utiliser une base temporaire
const db = new DatabaseSync(process.env.DB_FILE || path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

// Données initiales (les mêmes que dans le TP) si la table est vide
const { count } = db.prepare('SELECT COUNT(*) AS count FROM users').get();
if (count === 0) {
  const insert = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  insert.run('Alice', 'alice@example.com');
  insert.run('Bob', 'bob@example.com');
}

const getAllUsers = () => db.prepare('SELECT id, name, email FROM users ORDER BY id').all();

const createUser = (name, email) => {
  const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email);
  return { id: Number(result.lastInsertRowid), name, email };
};

const deleteUser = (id) => db.prepare('DELETE FROM users WHERE id = ?').run(id).changes > 0;

module.exports = { getAllUsers, createUser, deleteUser };
