export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  time: string;
  isSuspicious: boolean;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const DEVICES = ['iPhone 15', 'Samsung S24', 'MacBook Pro', 'Windows PC', 'iPad Air', 'Xiaomi 14', 'Pixel 8'];
const LOCATIONS_LEGIT = ['Москва, Россия', 'Санкт-Петербург, Россия', 'Новосибирск, Россия', 'Казань, Россия'];
const LOCATIONS_SUSPICIOUS = ['Нигерия', 'Китай', 'Северная Корея', 'Бразилия', 'Турция', 'Индия'];
const TIMES_LEGIT = ['2 минуты назад', '15 минут назад', '1 час назад'];
const TIMES_SUSPICIOUS = ['3:47 ночи', '6 дней назад', '2 недели назад', '4:12 ночи'];

export function generateSessions(level: number): Session[] {
  const total = level * 2 + 3;
  const suspiciousCount = Math.min(total - 1, Math.floor(total * 0.4));
  const rng = seededRandom(level * 1000);

  const sessions: Session[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < total; i++) {
    const isSuspicious = i < suspiciousCount;
    const id = `sess-${level}-${i}`;
    usedIds.add(id);

    sessions.push({
      id,
      device: DEVICES[Math.floor(rng() * DEVICES.length)],
      location: isSuspicious
        ? LOCATIONS_SUSPICIOUS[Math.floor(rng() * LOCATIONS_SUSPICIOUS.length)]
        : LOCATIONS_LEGIT[Math.floor(rng() * LOCATIONS_LEGIT.length)],
      ip: `${Math.floor(rng() * 256)}.${Math.floor(rng() * 256)}.${Math.floor(rng() * 256)}.${Math.floor(rng() * 256)}`,
      time: isSuspicious
        ? TIMES_SUSPICIOUS[Math.floor(rng() * TIMES_SUSPICIOUS.length)]
        : TIMES_LEGIT[Math.floor(rng() * TIMES_LEGIT.length)],
      isSuspicious,
    });
  }

  // Shuffle
  for (let i = sessions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [sessions[i], sessions[j]] = [sessions[j], sessions[i]];
  }

  return sessions;
}

export function calculateScore(
  closedSuspicious: number,
  missedSuspicious: number,
  closedLegitimate: number,
  timeLeft: number,
): number {
  const base = closedSuspicious * 100;
  const penalty = (missedSuspicious + closedLegitimate) * 50;
  const timeBonus = timeLeft * 5;
  return Math.max(0, Math.min(1000, base - penalty + timeBonus));
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getGrade(score: number): string {
  if (score >= 900) return 'S';
  if (score >= 750) return 'A';
  if (score >= 600) return 'B';
  if (score >= 400) return 'C';
  return 'D';
}
