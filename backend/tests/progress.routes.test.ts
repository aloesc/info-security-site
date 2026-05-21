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

describe('Progress API', () => {
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

  describe('POST /api/progress', () => {
    it('should upsert progress and return 200 with updated row', async () => {
      const res = await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-1',
          completed_guides: ['telegram', 'vk'],
          achievements: ['first-game'],
        }),
      });
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.user_id).toBe('user-1');
      expect(body.completed_guides).toEqual(['telegram', 'vk']);
      expect(body.achievements).toEqual(['first-game']);
      expect(body.updated_at).toBeDefined();
    });

    it('should return 400 for invalid body', async () => {
      const res = await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'u', completed_guides: 'not-array' }),
      });
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/progress/:user_id', () => {
    beforeAll(async () => {
      await fetch(`${address}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'existing-user',
          completed_guides: ['vk'],
          achievements: [],
        }),
      });
    });

    it('should return progress for existing user', async () => {
      const res = await fetch(`${address}/api/progress/existing-user`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.user_id).toBe('existing-user');
      expect(body.completed_guides).toEqual(['vk']);
      expect(body.achievements).toEqual([]);
    });

    it('should return 404 for non-existing user', async () => {
      const res = await fetch(`${address}/api/progress/unknown-user`);
      expect(res.status).toBe(404);

      const body = await res.json();
      expect(body.error).toBe('Progress not found');
    });
  });
});
