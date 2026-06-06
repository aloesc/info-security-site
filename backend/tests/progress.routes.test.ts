import { createApp } from '../src/server';
import Database from 'better-sqlite3';
import { runMigrations } from '../src/db/migrate';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';

jest.mock('../src/middleware/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const TEST_JWT_SECRET = 'test-secret-test-secret-test-secret-32-chars';

describe('Progress API', () => {
  let server: Server;
  let address: string;
  let db: Database;
  let token: string;

  beforeAll((done) => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    db = new Database(':memory:');
    runMigrations(db);
    server = createApp(db).listen(0, () => {
      const info = server.address() as { port: number };
      address = `http://localhost:${info.port}`;
      token = jwt.sign({ userId: 1, username: 'tester' }, TEST_JWT_SECRET, { expiresIn: '1h' });
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      db.close();
      done();
    });
  });

  describe('POST /api/progress', () => {
    it('should require auth (401 without token)', async () => {
      const res = await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-1',
          completed_guides: ['telegram', 'vk'],
          achievements: ['first-game'],
        }),
      });
      expect(res.status).toBe(401);
    });

    it('should upsert progress for authenticated user and return 200', async () => {
      const res = await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: '1',
          completed_guides: ['telegram', 'vk'],
          achievements: ['first-game'],
        }),
      });
      expect(res.status).toBe(200);

      const body = (await res.json()) as Record<string, unknown>;
      expect(body.user_id).toBe(1);
      expect(body.completed_guides).toEqual(['telegram', 'vk']);
      expect(body.achievements).toEqual(['first-game']);
      expect(body.updated_at).toBeDefined();
    });

    it('should return 400 for invalid body', async () => {
      const res = await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed_guides: 'not-array' }),
      });
      expect(res.status).toBe(400);

      const body = (await res.json()) as { errors: unknown[] };
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/progress/current', () => {
    it('should return 200 with saved data for the user', async () => {
      const res = await fetch(`${address}/api/progress/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { completed_guides: string[]; achievements: string[] };
      expect(body.completed_guides).toEqual(['telegram', 'vk']);
      expect(body.achievements).toEqual(['first-game']);
    });
  });
});
