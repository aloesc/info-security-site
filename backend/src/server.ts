import express, { Request, Response } from 'express';
import type { DbConnection } from './db/connection';
import { parseEnv } from './config/env';
import { logger } from './middleware/logger';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error-handler';
import { createGamesRouter } from './routes/games.routes';
import { createProgressRouter } from './routes/progress.routes';
import { createAuthRouter } from './routes/auth.routes';
import { createDbConnection } from './db/connection';
import { runMigrations } from './db/migrate';

export function createApp(db: DbConnection) {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: '10kb' }));

  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', createAuthRouter(db));
  app.use('/api/games', createGamesRouter(db));
  app.use('/api/progress', createProgressRouter(db));

  app.use(errorHandler);

  return app;
}

export function startServer() {
  const env = parseEnv();
  const db = createDbConnection(env.DATABASE_PATH);
  runMigrations(db);

  const app = createApp(db);

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  return server;
}

if (require.main === module) {
  startServer();
}
