import type { Request, Response, NextFunction } from 'express';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
};

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
}
