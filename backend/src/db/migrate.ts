import fs from 'fs';
import path from 'path';
import type { DbConnection } from './connection';

const SCHEMA_CANDIDATES = [
  path.join(__dirname, 'schema.sql'),
  path.join(__dirname, '..', 'db', 'schema.sql'),
  path.join(__dirname, 'db', 'schema.sql'),
  path.join(process.cwd(), 'src', 'db', 'schema.sql'),
  path.join(process.cwd(), 'db', 'schema.sql'),
];

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

  const schemaPath = SCHEMA_CANDIDATES.find((p) => fs.existsSync(p));
  if (!schemaPath) {
    throw new Error(
      `schema.sql not found. Searched in: ${SCHEMA_CANDIDATES.join(', ')}`
    );
  }
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
};
