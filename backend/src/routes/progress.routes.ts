import { Router } from 'express';
import type { DbConnection } from '../db/connection';
import { updateProgress, getProgress } from '../controllers/progress.controller';

export function createProgressRouter(db: DbConnection): Router {
  const router = Router();

  router.post('/', updateProgress(db));
  router.get('/:user_id', getProgress(db));

  return router;
}
