import crypto from "crypto";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('data.db');

db.exec(`CREATE TABLE IF NOT EXISTS menus (
  id TEXT PRIMARY KEY,
  name TEXT
);`);

db.exec(`CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  menuId TEXT,
  name TEXT,
  price REAL,
  allergens TEXT,
  imageUrl TEXT,
  available INTEGER DEFAULT 1,
  FOREIGN KEY(menuId) REFERENCES menus(id)
);`);

const app = express();
app.use(express.json());

app.post('/api/menus', (req, res) => {
  const id = crypto.randomUUID();
  const { name } = req.body;
  db.prepare('INSERT INTO menus (id, name) VALUES (?, ?)').run(id, name || '');
  res.json({ id });
});

app.get('/api/menus/:id', (req, res) => {
  const menu = db.prepare('SELECT * FROM menus WHERE id = ?').get(req.params.id);
  if (!menu) return res.status(404).json({ error: 'Not found' });
  const items = db.prepare('SELECT * FROM items WHERE menuId = ?').all(req.params.id);
  res.json({ ...menu, items });
});

app.get('/api/menus/:id/public', (req, res) => {
  const menu = db.prepare('SELECT * FROM menus WHERE id = ?').get(req.params.id);
  if (!menu) return res.status(404).json({ error: 'Not found' });
  const items = db.prepare('SELECT * FROM items WHERE menuId = ? AND available = 1').all(req.params.id);
  res.json({ items });
});

app.post('/api/menus/:id/items', (req, res) => {
  const itemId = crypto.randomUUID();
  const { name, price, allergens, imageUrl } = req.body;
  db.prepare('INSERT INTO items (id, menuId, name, price, allergens, imageUrl) VALUES (?, ?, ?, ?, ?, ?)')
    .run(itemId, req.params.id, name, price, allergens, imageUrl);
  res.json({ id: itemId });
});

app.put('/api/menus/:id/items/:itemId', (req, res) => {
  const fields = req.body;
  const columns = Object.keys(fields).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE items SET ${columns} WHERE id = @id AND menuId = @menuId`)
    .run({ ...fields, id: req.params.itemId, menuId: req.params.id });
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
