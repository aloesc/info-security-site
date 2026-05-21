import Database from 'better-sqlite3';

export type DbConnection = InstanceType<typeof Database>;

export const createDbConnection = (dbPath: string): DbConnection => {
  return new Database(dbPath);
};
