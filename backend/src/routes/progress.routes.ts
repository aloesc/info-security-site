import { Router, type Request, type Response } from 'express';
import type { DbConnection } from '../db/connection';
import { updateProgress, getProgress } from '../controllers/progress.controller';
import { jwtMiddleware } from '../middleware/jwt';
import * as progressService from '../services/progress.service';

export function createProgressRouter(db: DbConnection): Router {
  const router = Router();

  router.post('/', jwtMiddleware, updateProgress(db));
  router.get('/current', jwtMiddleware, getCurrentProgress(db));
  router.get('/:user_id', jwtMiddleware, getProgress(db));

  return router;
}

const getCurrentProgress =
  (db: DbConnection) =>
  (req: Request, res: Response): void => {
    if (!req.auth) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = Number(req.auth.userId);
    try {
      const row = progressService.getProgress(db, userId);
      if (!row) {
        res.status(200).json({
          user_id: userId,
          completed_guides: [],
          achievements: [],
          updated_at: null,
        });
        return;
      }
      res.status(200).json(row);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  };
