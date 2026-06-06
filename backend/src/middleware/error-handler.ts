import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ errors: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`) });
    return;
  }

  logger.error('Unhandled error', err);

  const isDev = process.env.NODE_ENV === 'development';

  res.status(500).json({
    error: isDev ? err.message : 'Internal Server Error',
  });
}
