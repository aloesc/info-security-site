import {
  calculateStrength,
  estimateCrackingTime,
  calculateGameScore,
  getLevelTarget,
  meetsLevelTarget,
  getPasswordTips,
} from './logic';

describe('password logic', () => {
  test('calculateStrength - weak password', () => {
    const result = calculateStrength('a');
    expect(result.level).toBe('weak');
    expect(result.score).toBeLessThanOrEqual(30);
    expect(result.label).toBe('Слабый');
  });

  test('calculateStrength - strong password', () => {
    const result = calculateStrength('MyP@ssw0rd!2024');
    expect(result.level).toBe('unbreakable');
    expect(result.score).toBeGreaterThan(85);
    expect(result.label).toBe('Несокрушимый');
  });

  test('calculateStrength - medium password', () => {
    const result = calculateStrength('Hello12A'); // 8 chars, 3 sets: 40 + 30 = 70 → strong
    expect(result.level).toBe('strong');
    expect(result.score).toBeGreaterThan(60);
  });

  test('estimateCrackingTime - empty', () => {
    expect(estimateCrackingTime('')).toBe('Мгновенно');
  });

  test('estimateCrackingTime - weak', () => {
    const time = estimateCrackingTime('aB1!'); // very short, but mixed
    expect(time).toMatch(/секунд|минут|Мгновенно/);
  });

  test('estimateCrackingTime - strong', () => {
    const time = estimateCrackingTime('MyP@ssw0rd!2024');
    expect(time).toMatch(/лет|тысяч|Вечность/);
  });

  test('calculateGameScore', () => {
    expect(calculateGameScore(1, 50, 0)).toBe(350);
    expect(calculateGameScore(5, 100, 100)).toBe(1000); // clamped
    expect(calculateGameScore(1, 0, 0)).toBe(100);
  });

  test('getLevelTarget', () => {
    expect(getLevelTarget(1).requiredLevel).toBe('medium');
    expect(getLevelTarget(5).requiredLevel).toBe('unbreakable');
    expect(getLevelTarget(99).requiredLevel).toBe('unbreakable');
  });

  test('meetsLevelTarget blocks letters-only passwords', () => {
    expect(meetsLevelTarget('aaaAAAAA', 1)).toBe(false);
    expect(meetsLevelTarget('aaaAAAAA1!', 1)).toBe(true);
  });

  test('meetsLevelTarget requires longer passwords for later levels', () => {
    expect(meetsLevelTarget('aaaAAAAA11!', 2)).toBe(true);
    expect(meetsLevelTarget('aaaAAAAA1!', 3)).toBe(false);
    expect(meetsLevelTarget('Aa23_!pass?unicode_letter?good', 4)).toBe(true);
    expect(meetsLevelTarget('word1 WORD2!! word3 11 word4@@', 5)).toBe(true);
  });

  test('getPasswordTips', () => {
    const tips = getPasswordTips('abc', 1);
    expect(tips.some((t) => t.includes('короткий'))).toBe(true);
    expect(tips.some((t) => t.includes('заглавную'))).toBe(true);
  });
});
