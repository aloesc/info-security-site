import { createApp } from '../src/server';
import Database from 'better-sqlite3';
import { runMigrations } from '../src/db/migrate';
import type { Server } from 'http';

jest.mock('../src/middleware/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Games API', () => {
  let server: Server;
  let address: string;
  let db: Database;

  beforeAll((done) => {
    db = new Database(':memory:');
    runMigrations(db);
    server = createApp(db).listen(0, () => {
      const info = server.address() as { port: number };
      address = `http://localhost:${info.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(() => {
      db.close();
      done();
    });
  });

  describe('POST /api/games', () => {
    it('should create a score and return 201 with the created row', async () => {
      const res = await fetch(`${address}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-1', game_type: 'phishing', score: 100 }),
      });
      expect(res.status).toBe(201);

      const body = await res.json();
      expect(body.user_id).toBe('user-1');
      expect(body.game_type).toBe('phishing');
      expect(body.score).toBe(100);
      expect(body.id).toBeDefined();
      expect(body.timestamp).toBeDefined();
    });

    it('should return 400 for invalid body', async () => {
      const res = await fetch(`${address}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'u', score: 'not_a_number' }),
      });
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/games', () => {
    beforeAll(async () => {
      // Seed leaderboard data
      await fetch(`${address}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'a', game_type: 'phishing', score: 50 }),
      });
      await fetch(`${address}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'b', game_type: 'phishing', score: 150 }),
      });
    });

    it('should return leaderboard sorted by score DESC', async () => {
      const res = await fetch(`${address}/api/games?game_type=phishing`);
      expect(res.status).toBe(200);

      const body = (await res.json()) as Array<{ user_id: string; score: number }>;
      expect(body.length).toBeGreaterThanOrEqual(2);
      expect(body[0].score).toBeGreaterThanOrEqual(body[1].score);
    });

    it('should limit leaderboard to 10 entries', async () => {
      for (let i = 0; i < 12; i++) {
        await fetch(`${address}/api/games`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: `u${i}`, game_type: 'limit-test', score: i }),
        });
      }
      const res = await fetch(`${address}/api/games?game_type=limit-test`);
      const body = await res.json();
      expect(body).toHaveLength(10);
    });
  });
});
