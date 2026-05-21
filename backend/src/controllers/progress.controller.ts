import type { Request, Response } from 'express';
import { ProgressUpdateSchema } from '../schemas/progress.schemas';
import * as progressService from '../services/progress.service';
import type { DbConnection } from '../db/connection';

/**
 * Validates body and upserts user progress.
 */
export const updateProgress = (db: DbConnection) => (req: Request, res: Response): void => {
  const parseResult = ProgressUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  try {
    const row = progressService.upsertProgress(db, parseResult.data);
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
    const row = progressService.getProgress(db, userId);
    if (!row) {
      res.status(404).json({ error: 'Progress not found' });
      return;
    }
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};
