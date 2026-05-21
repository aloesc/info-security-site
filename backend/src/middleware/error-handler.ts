import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled error', err);

  const isDev = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: isDev ? err.message : 'Internal Server Error',
  });
}
