import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '../schemas/auth.schemas';
import { DbConnection } from '../db/connection';

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
}

export interface TokenPayload {
  userId: number;
  username: string;
}

export async function createUser(
  db: DbConnection,
  input: RegisterInput
): Promise<{ user: User; token: string }> {
  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(input.username, input.email);
  if (existing) throw new Error('User already exists with this username or email');

  const passwordHash = await bcrypt.hash(input.password, 12);
  const now = new Date().toISOString();
  const displayName = input.display_name || input.username;

  const stmt = db.prepare(
    'INSERT INTO users (username, display_name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, username, email, display_name'
  );
  const row = stmt.get(input.username, displayName, input.email, passwordHash, now, now) as User;

  const token = jwt.sign({ userId: row.id, username: row.username }, process.env.JWT_SECRET || '', {
    expiresIn: '7d',
  });

  return { user: row, token };
}

export async function verifyUser(
  db: DbConnection,
  input: LoginInput
): Promise<{ user: User; token: string } | null> {
  const row = db
    .prepare('SELECT id, username, email, display_name, password_hash FROM users WHERE username = ?')
    .get(input.username) as User & { password_hash: string } | undefined;

  if (!row) return null;

  const valid = await bcrypt.compare(input.password, row.password_hash);
  if (!valid) return null;

  const { password_hash: _, ...user } = row;

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || '', {
    expiresIn: '7d',
  });

  return { user, token };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;
}
