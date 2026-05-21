import { Router } from 'express';
import type { DbConnection } from '../db/connection';
import { register, login } from '../controllers/auth.controller';

export function createAuthRouter(db: DbConnection): Router {
  const router = Router();

  router.post('/register', register(db));
  router.post('/login', login(db));

  return router;
}
