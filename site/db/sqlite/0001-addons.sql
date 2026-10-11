-- The addon catalogue. One row per addon, one row per function it exposes.
-- SQLite so the same file runs under `pikku dev` (node:sqlite) and on Cloudflare D1.

CREATE TABLE IF NOT EXISTS addon (
  slug           TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  title          TEXT NOT NULL,
  version        TEXT,
  description    TEXT,
  category       TEXT NOT NULL,
  category_label TEXT NOT NULL,
  logo           TEXT,
  secrets        TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS addon_category_idx ON addon(category);

CREATE TABLE IF NOT EXISTS addon_function (
  addon_slug  TEXT NOT NULL REFERENCES addon(slug) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  name        TEXT NOT NULL,
  rpc         TEXT,
  description TEXT,
  input       TEXT,
  output      TEXT,
  PRIMARY KEY (addon_slug, position)
);
