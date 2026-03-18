import { Pool } from 'pg';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const isProduction = !!process.env.DATABASE_URL;
const DATABASE_URL = process.env.DATABASE_URL;

let db: any;
let isPostgres = false;

if (isProduction && DATABASE_URL) {
  // PostgreSQL for production
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  // Create tables if not exist
  pool.query(`
    CREATE TABLE IF NOT EXISTS click_logs (
      id           SERIAL PRIMARY KEY,
      offer_id     TEXT    NOT NULL,
      clicked_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

  pool.query(`
    CREATE TABLE IF NOT EXISTS offers (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      url         TEXT NOT NULL,
      description TEXT,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS lp_configs (
      slug        TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      config      TEXT NOT NULL,
      target_audience TEXT,
      offer_id    TEXT,
      content     TEXT,
      keywords    TEXT,
      genre       TEXT,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS shindan_configs (
      slug        TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      config      TEXT NOT NULL,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS sns_accounts (
      id          SERIAL PRIMARY KEY,
      platform    TEXT NOT NULL,
      account_name TEXT NOT NULL,
      api_key     TEXT,
      api_secret  TEXT,
      access_token TEXT,
      access_secret TEXT,
      is_active   BOOLEAN DEFAULT true,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  pool.query(`
    CREATE TABLE IF NOT EXISTS sns_posts (
      id          SERIAL PRIMARY KEY,
      lp_slug     TEXT NOT NULL,
      platform    TEXT NOT NULL,
      post_id     TEXT,
      content     TEXT NOT NULL,
      success     BOOLEAN NOT NULL,
      error_msg   TEXT,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  db = pool;
  isPostgres = true;
} else {
  // SQLite for development
  const DB_PATH =
    process.env.DATABASE_PATH ?? path.join(process.cwd(), '../../data/clicks.db');

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqliteDb = new Database(DB_PATH);

  sqliteDb.exec(`
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

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS offers (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      url         TEXT NOT NULL,
      description TEXT,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS lp_configs (
      slug        TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      config      TEXT NOT NULL, -- JSON
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS shindan_configs (
      slug        TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      config      TEXT NOT NULL, -- JSON
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);

  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS sns_posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      lp_slug     TEXT NOT NULL,
      platform    TEXT NOT NULL,
      post_id     TEXT,
      content     TEXT NOT NULL,
      success     INTEGER NOT NULL, -- 0 or 1
      error_msg   TEXT,
      created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);

  db = sqliteDb;
  isPostgres = false;
}

// Unified query interface
export const query = {
  all: async (sql: string, params: any[] = []) => {
    if (isPostgres) {
      const res = await db.query(sql, params);
      return res.rows;
    } else {
      return db.prepare(sql).all(...params);
    }
  },
  get: async (sql: string, params: any[] = []) => {
    if (isPostgres) {
      const res = await db.query(sql, params);
      return res.rows[0] || null;
    } else {
      return db.prepare(sql).get(...params);
    }
  },
  run: async (sql: string, params: any[] = []) => {
    if (isPostgres) {
      return await db.query(sql, params);
    } else {
      return db.prepare(sql).run(...params);
    }
  },
};

export default db;