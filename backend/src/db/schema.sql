-- Game scores table — user_id stores users.id as INTEGER
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  game_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  timestamp TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_scores_game_type_score ON scores (game_type, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores (user_id);

-- User progress table — completed_guides/achievements stored as JSON arrays in TEXT
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  completed_guides TEXT,
  achievements TEXT,
  updated_at TEXT NOT NULL
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
