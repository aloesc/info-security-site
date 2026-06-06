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

const TEST_JWT_SECRET = 'test-secret-test-secret-test-secret-32-chars';

describe('Server', () => {
  let server: Server;
  let address: string;
  let db: Database;

  beforeAll((done) => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
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

  describe('GET /api/health', () => {
    it('should return 200 with status ok and a valid ISO timestamp', async () => {
      const res = await fetch(`${address}/api/health`);
      expect(res.status).toBe(200);

      const body = (await res.json()) as { status: string; timestamp: string };
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    });
  });

  describe('GET /api/games/scores?game_type=...', () => {
    it('should return empty leaderboard initially', async () => {
      const ts = Date.now();
      const res = await fetch(`${address}/api/games/scores?game_type=server-test-${ts}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });
  });
});
