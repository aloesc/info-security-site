export type StrengthLevel = 'weak' | 'medium' | 'strong' | 'unbreakable';

export interface StrengthResult {
  level: StrengthLevel;
  score: number;
  color: string;
  label: string;
}

export interface PasswordProfile {
  length: number;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  digitCount: number;
  symbolCount: number;
  wordCount: number;
}

export function getPasswordProfile(password: string): PasswordProfile {
  const digitMatches = password.match(/\d/g) ?? [];
  const symbolMatches = password.match(/[^a-zA-Z0-9\s]/g) ?? [];
  const wordCount = password
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean).length;

  return {
    length: password.length,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasDigit: /\d/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
    digitCount: digitMatches.length,
    symbolCount: symbolMatches.length,
    wordCount,
  };
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
    1: { requiredLevel: 'medium', hint: '8+ символов, все типы символов, без лишней простоты.' },
    2: { requiredLevel: 'medium', hint: '10+ символов и минимум 2 цифры.' },
    3: { requiredLevel: 'strong', hint: '12+ символов, минимум 2 цифры и 2 спецсимвола.' },
    4: { requiredLevel: 'strong', hint: '14+ символов, все типы символов, 2+ цифры и 2+ спецсимвола.' },
    5: { requiredLevel: 'unbreakable', hint: '16+ символов, 3+ цифры, 3+ спецсимвола или passphrase из 4 фрагментов.' },
  };
  return targets[level] || targets[5];
}

export function meetsLevelTarget(password: string, level: number): boolean {
  const profile = getPasswordProfile(password);
  const hasAllTypes = profile.hasLowercase && profile.hasUppercase && profile.hasDigit && profile.hasSymbol;
  const hasEnoughLength = (min: number) => profile.length >= min;
  const hasSegments = (min: number) => profile.wordCount >= min;

  switch (level) {
    case 1:
      return hasEnoughLength(8) && hasAllTypes;
    case 2:
      return hasEnoughLength(10) && hasAllTypes && profile.digitCount >= 2;
    case 3:
      return hasEnoughLength(12) && hasAllTypes && profile.digitCount >= 2 && profile.symbolCount >= 2;
    case 4:
      return hasEnoughLength(14) && hasAllTypes && profile.digitCount >= 2 && profile.symbolCount >= 2;
    case 5:
    default:
      return (
        (hasEnoughLength(16) && hasAllTypes && profile.digitCount >= 3 && profile.symbolCount >= 3) ||
        (hasEnoughLength(16) && hasSegments(4) && hasAllTypes)
      );
  }
}

export function getPasswordTips(password: string, level = 1): string[] {
  const tips: string[] = [];
  const minLength = level === 1 ? 8 : level === 2 ? 10 : level === 3 ? 12 : level === 4 ? 14 : 16;

  if (password.length < minLength) tips.push(`Слишком короткий. Минимум ${minLength} символов.`);
  if (!/[A-Z]/.test(password)) tips.push('Добавьте заглавную букву.');
  if (!/[a-z]/.test(password)) tips.push('Добавьте строчную букву.');
  if ((password.match(/\d/g) ?? []).length < (level >= 2 ? 2 : 1)) tips.push(level >= 2 ? 'Добавьте 2 цифры.' : 'Добавьте цифру.');
  if ((password.match(/[^a-zA-Z0-9\s]/g) ?? []).length < (level >= 3 ? 2 : 1)) tips.push(level >= 3 ? 'Добавьте 2 спецсимвола.' : 'Добавьте спецсимвол (!@#$%).');
  if (level >= 5 && password.trim().split(/[\s-]+/).filter(Boolean).length < 4) {
    tips.push('Попробуйте passphrase из 4 фрагментов или слов.');
  }
  if (tips.length === 0) tips.push('Отличный пароль! Так держать.');
  return tips;
}
