import type { DbConnection } from '../db/connection';
import type { ScoreResponse } from '../schemas/games.schemas';

export const saveScore = (
  db: DbConnection,
  params: { user_id: string; game_type: string; score: number }
): ScoreResponse => {
  const stmt = db.prepare(
    'INSERT INTO scores (user_id, game_type, score, timestamp) VALUES (?, ?, ?, ?) RETURNING *'
  );
  const row = stmt.get(params.user_id, params.game_type, params.score, new Date().toISOString()) as ScoreResponse;
  return row;
};

export const getLeaderboard = (
  db: DbConnection,
  game_type: string,
  limit = 10
): (ScoreResponse & { username: string; display_name: string })[] => {
  const stmt = db.prepare(`
    SELECT s.*, u.username, COALESCE(u.display_name, u.username) as display_name
    FROM scores s
    LEFT JOIN users u ON s.user_id = u.username
    WHERE s.game_type = ?
    ORDER BY s.score DESC
    LIMIT ?
  `);
  return stmt.all(game_type, limit) as (ScoreResponse & { username: string; display_name: string })[];
};
