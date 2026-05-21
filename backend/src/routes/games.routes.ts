import { Router } from 'express';
import type { DbConnection } from '../db/connection';
import { createScore, getLeaderboard } from '../controllers/games.controller';
import { jwtMiddleware } from '../middleware/jwt';

export function createGamesRouter(db: DbConnection): Router {
  const router = Router();

  router.post('/scores', jwtMiddleware, createScore(db));
  router.get('/scores', getLeaderboard(db));

  return router;
}
