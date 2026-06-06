export type StrengthLevel = 'weak' | 'medium' | 'strong' | 'unbreakable';

export interface StrengthResult {
  level: StrengthLevel;
  score: number;
  color: string;
  label: string;
}

export function calculateStrength(password: string): StrengthResult {
  const length = password.length;
  let charSets = 0;
  if (/[a-z]/.test(password)) charSets++;
  if (/[A-Z]/.test(password)) charSets++;
  if (/\d/.test(password)) charSets++;
  if (/[^a-zA-Z0-9]/.test(password)) charSets++;

  // 0–10 chars: 0–40; +length factor; +charSets factor; -penalties for short
  const lengthScore = Math.min(60, length * 5);
  const diversityScore = (charSets - 1) * 15; // 0 / 15 / 30 / 45
  const raw = lengthScore + diversityScore;
  const score = Math.max(0, Math.min(100, raw));

  if (score <= 30) return { level: 'weak', score, color: 'bg-cyber-red', label: 'Слабый' };
  if (score <= 60) return { level: 'medium', score, color: 'bg-yellow-500', label: 'Средний' };
  if (score <= 85) return { level: 'strong', score, color: 'bg-cyber-blue', label: 'Сильный' };
  return { level: 'unbreakable', score, color: 'bg-cyber-green', label: 'Несокрушимый' };
}

export function estimateCrackingTime(password: string): string {
  if (!password) return 'Мгновенно';
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  if (pool === 0) return 'Мгновенно';

  const combinations = Math.pow(pool, password.length);
  const rate = 1e6; // guesses per second (offline attack)
  const seconds = combinations / rate;

  if (seconds < 1) return 'Мгновенно';
  if (seconds < 60) return `${Math.round(seconds)} секунд`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} минут`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} часов`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} дней`;
  if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} лет`;
  if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)} тысяч лет`;
  return 'Вечность';
}

export function calculateGameScore(
  level: number,
  strengthIndex: number,
  speedBonus: number
): number {
  return Math.min(1000, level * 100 + strengthIndex * 5 + speedBonus);
}

export function getLevelTarget(level: number): { requiredLevel: StrengthLevel; hint: string } {
  const targets: Record<number, { requiredLevel: StrengthLevel; hint: string }> = {
    1: { requiredLevel: 'medium', hint: 'Добавьте цифры и символы, чтобы достичь среднего уровня.' },
    2: { requiredLevel: 'medium', hint: 'Используйте длину > 8 символов и разные регистры.' },
    3: { requiredLevel: 'strong', hint: 'Пароль должен быть > 12 символов со всеми типами символов.' },
    4: { requiredLevel: 'strong', hint: 'Используйте passphrase — несколько случайных слов с символами.' },
    5: { requiredLevel: 'unbreakable', hint: 'Максимальная защита: длина > 16, все наборы символов.' },
  };
  return targets[level] || targets[5];
}

export function getPasswordTips(password: string): string[] {
  const tips: string[] = [];
  if (password.length < 8) tips.push('Слишком короткий. Минимум 8 символов.');
  if (password.length < 12) tips.push('Для сильного пароля используйте 12+ символов.');
  if (!/[A-Z]/.test(password)) tips.push('Добавьте заглавную букву.');
  if (!/[a-z]/.test(password)) tips.push('Добавьте строчную букву.');
  if (!/\d/.test(password)) tips.push('Добавьте цифру.');
  if (!/[^a-zA-Z0-9]/.test(password)) tips.push('Добавьте спецсимвол (!@#$%).');
  if (tips.length === 0) tips.push('Отличный пароль! Так держать.');
  return tips;
}
