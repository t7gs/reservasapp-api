const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('Database.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS reservas (id INTEGER PRIMARY KEY, nome TEXT, horario TEXT)');
});

db.close();
