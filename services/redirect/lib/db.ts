import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), '../../data/clicks.db');

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS click_logs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_id     TEXT    NOT NULL,
    clicked_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    ip           TEXT,
    user_agent   TEXT,
    referer      TEXT,
    utm_source   TEXT,
    utm_medium   TEXT,
    utm_campaign TEXT,
    utm_term     TEXT,
    utm_content  TEXT
  )
`);

export default db;
