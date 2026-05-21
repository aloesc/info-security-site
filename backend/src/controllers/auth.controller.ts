import type { Request, Response } from 'express';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schemas';
import * as authService from '../services/auth.service';
import { DbConnection } from '../db/connection';

export const register = (db: DbConnection) => async (req: Request, res: Response): Promise<void> => {
  const parseResult = RegisterSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  try {
    const result = await authService.createUser(db, parseResult.data);
    res.status(201).json({ success: true, user: result.user, token: result.token });
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Registration failed' });
  }
};

export const login = (db: DbConnection) => async (req: Request, res: Response): Promise<void> => {
  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ errors: parseResult.error.errors.map((e) => e.message) });
    return;
  }

  const result = await authService.verifyUser(db, parseResult.data);
  if (!result) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  res.status(200).json({ success: true, user: result.user, token: result.token });
};
