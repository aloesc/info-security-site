import type { Request, Response } from 'express';
import { ProgressUpdateSchema } from '../schemas/progress.schemas';
import * as progressService from '../services/progress.service';
import type { DbConnection } from '../db/connection';

/**
 * Validates body and upserts user progress for the authenticated user.
 * The user_id in the body is ignored — progress always belongs to the caller.
 */
export const updateProgress = (db: DbConnection) => (req: Request, res: Response): void => {
  const parseResult = ProgressUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  if (!req.auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const userId = Number(req.auth.userId);

  try {
    const row = progressService.upsertProgress(db, {
      user_id: userId,
      completed_guides: parseResult.data.completed_guides,
      achievements: parseResult.data.achievements,
    });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

/**
 * Returns progress for a given user_id param.
 */
export const getProgress = (db: DbConnection) => (req: Request, res: Response): void => {
  const userId = req.params.user_id;
  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ errors: ['user_id is required'] });
    return;
  }

  try {
    const userIdNum = Number(userId);
    if (!Number.isFinite(userIdNum)) {
      res.status(400).json({ errors: ['user_id must be numeric'] });
      return;
    }
    const row = progressService.getProgress(db, userIdNum);
    if (!row) {
      res.status(404).json({ error: 'Progress not found' });
      return;
    }
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
