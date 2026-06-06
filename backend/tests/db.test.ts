import { runMigrations } from '../src/db/migrate';
import { createDbConnection } from '../src/db/connection';

describe('Database migrations', () => {
  it('creates all required tables on a fresh database', () => {
    const db = createDbConnection(':memory:');
    try {
      runMigrations(db);

      const tables = db
        .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`)
        .all() as { name: string }[];

      const names = tables.map((t) => t.name);
      expect(names).toEqual(expect.arrayContaining(['scores', 'progress', 'users']));
    } finally {
      db.close();
    }
  });

  it('is idempotent — running twice does not throw', () => {
    const db = createDbConnection(':memory:');
    try {
      runMigrations(db);
      expect(() => runMigrations(db)).not.toThrow();
    } finally {
      db.close();
    }
  });
});
