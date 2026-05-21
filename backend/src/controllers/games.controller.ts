import type { Request, Response } from 'express';
import { ScoreSubmissionSchema, LeaderboardRequestSchema } from '../schemas/games.schemas';
import * as gamesService from '../services/games.service';
import type { DbConnection } from '../db/connection';

export const createScore = (db: DbConnection) => (req: Request, res: Response): void => {
  const parseResult = ScoreSubmissionSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  const userId = req.auth?.username || req.body.user_id || 'anonymous';

  try {
    const row = gamesService.saveScore(db, { ...parseResult.data, user_id: userId });
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
};

export const getLeaderboard = (db: DbConnection) => (req: Request, res: Response): void => {
  const parseResult = LeaderboardRequestSchema.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  try {
    const rows = gamesService.getLeaderboard(db, parseResult.data.game_type);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
