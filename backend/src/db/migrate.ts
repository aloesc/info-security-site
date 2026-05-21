import fs from 'fs';
import path from 'path';
import type { DbConnection } from './connection';

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

/**
 * Pure helper that checks whether the required tables already exist.
 */
const tablesExist = (db: DbConnection): boolean => {
  const scoresCheck = db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'scores'`)
    .get();
  const progressCheck = db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'progress'`)
    .get();

  return !!scoresCheck && !!progressCheck;
};

/**
 * Reads schema.sql and executes it on the provided database instance.
 * Skips execution if the tables already exist.
 */
export const runMigrations = (db: DbConnection): void => {
  if (tablesExist(db)) {
    return;
  }

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);
};
