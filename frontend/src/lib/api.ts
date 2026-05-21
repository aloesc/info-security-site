import { useAuth } from '@/providers/AuthProvider';

const API_BASE = typeof window !== 'undefined' ? '/api' : '';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export async function submitScore(gameType: string, score: number) {
  const token = getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/games/scores`, { method: 'POST', headers, body: JSON.stringify({ game_type: gameType, score }) });
  if (!res.ok) throw new Error('Failed to submit score');
  return res.json();
}

export async function getLeaderboard(gameType: string) {
  const res = await fetch(`${API_BASE}/games/scores?game_type=${encodeURIComponent(gameType)}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function getProgress() {
  const token = getAuthToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/progress/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}
