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

describe('Games API', () => {
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

  describe('POST /api/games/scores', () => {
    it('should create a score and return 201 with the created row', async () => {
      const res = await fetch(`${address}/api/games/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_type: 'phishing', score: 100 }),
      });
      expect(res.status).toBe(201);

      const body = (await res.json()) as Record<string, unknown>;
      expect(body.user_id).toBe(1);
      expect(body.game_type).toBe('phishing');
      expect(body.score).toBe(100);
      expect(body.id).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('should return 400 for invalid body', async () => {
      const res = await fetch(`${address}/api/games/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: 'not_a_number' }),
      });
      expect(res.status).toBe(400);

      const body = (await res.json()) as { errors: unknown[] };
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
    });

    it('should return 401 without auth token', async () => {
      const res = await fetch(`${address}/api/games/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_type: 'phishing', score: 50 }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/games/scores', () => {
    it('should return empty leaderboard initially for unknown type', async () => {
      const res = await fetch(`${address}/api/games/scores?game_type=unknown-type-${Date.now()}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });

    it('should return leaderboard sorted by score DESC', async () => {
      const ts = Date.now();
      await fetch(`${address}/api/games/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_type: `sort-test-${ts}`, score: 50 }),
      });
      await fetch(`${address}/api/games/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_type: `sort-test-${ts}`, score: 150 }),
      });

      const res = await fetch(`${address}/api/games/scores?game_type=sort-test-${ts}`);
      const body = (await res.json()) as Array<{ score: number }>;
      expect(body.length).toBe(2);
      expect(body[0].score).toBeGreaterThanOrEqual(body[1].score);
    });

    it('should limit leaderboard to 10 entries', async () => {
      const type = `limit-test-${Date.now()}`;
      for (let i = 0; i < 12; i++) {
        await fetch(`${address}/api/games/scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ game_type: type, score: i }),
        });
      }
      const res = await fetch(`${address}/api/games/scores?game_type=${type}`);
      const body = await res.json();
      expect(body).toHaveLength(10);
    });
  });
});
