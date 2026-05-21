import {
  calculateStrength,
  estimateCrackingTime,
  calculateGameScore,
  getLevelTarget,
  getPasswordTips,
} from './logic';

describe('password logic', () => {
  test('calculateStrength - weak password', () => {
    const result = calculateStrength('abc');
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
    const result = calculateStrength('Hello1');
    expect(result.level).toBe('medium');
    expect(result.score).toBeGreaterThan(30);
    expect(result.score).toBeLessThanOrEqual(60);
  });

  test('estimateCrackingTime - empty', () => {
    expect(estimateCrackingTime('')).toBe('Мгновенно');
  });

  test('estimateCrackingTime - weak', () => {
    const time = estimateCrackingTime('abc');
    expect(time).toMatch(/секунд|минут/);
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

  test('getPasswordTips', () => {
    const tips = getPasswordTips('abc');
    expect(tips.some((t) => t.includes('короткий'))).toBe(true);
    expect(tips.some((t) => t.includes('заглавную'))).toBe(true);
  });
});
