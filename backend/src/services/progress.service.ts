import type { DbConnection } from '../db/connection';
import type { ProgressResponse } from '../schemas/progress.schemas';

/**
 * Upserts a progress row for a user. Pure function.
 * SQLite INSERT OR REPLACE INTO is used for upsert.
 */
export const upsertProgress = (
  db: DbConnection,
  params: { user_id: number; completed_guides: string[]; achievements: string[] }
): ProgressResponse => {
  const stmt = db.prepare(
    'INSERT OR REPLACE INTO progress (user_id, completed_guides, achievements, updated_at) VALUES (?, ?, ?, ?) RETURNING *'
  );
  const row = stmt.get(
    params.user_id,
    JSON.stringify(params.completed_guides),
    JSON.stringify(params.achievements),
    new Date().toISOString()
  ) as ProgressResponse & { completed_guides: string; achievements: string };

  return {
    user_id: Number(row.user_id),
    completed_guides:
      typeof row.completed_guides === 'string'
        ? (JSON.parse(row.completed_guides) as string[])
        : row.completed_guides,
    achievements:
      typeof row.achievements === 'string'
        ? (JSON.parse(row.achievements) as string[])
        : row.achievements,
    updated_at: row.updated_at,
  };
};

/**
 * Retrieves a user's progress row. Pure function.
 */
export const getProgress = (db: DbConnection, user_id: number): ProgressResponse | undefined => {
  const stmt = db.prepare('SELECT * FROM progress WHERE user_id = ?');
  const row = stmt.get(user_id) as ProgressResponse | undefined;

  if (!row) return undefined;

  // SQLite stores arrays as JSON strings; parse them
  try {
    return {
      ...row,
      completed_guides:
        typeof row.completed_guides === 'string'
          ? (JSON.parse(row.completed_guides) as string[])
          : row.completed_guides,
      achievements:
        typeof row.achievements === 'string'
          ? (JSON.parse(row.achievements) as string[])
          : row.achievements,
    };
  } catch {
    return row;
  }
};
