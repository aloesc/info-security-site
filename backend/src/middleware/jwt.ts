import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

declare module 'express' {
  interface Request {
    auth?: { userId: number; username: string };
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
