import { generateSessions, calculateScore, formatTime, getGrade } from './logic';

describe('session logic', () => {
  test('generateSessions is deterministic for same level', () => {
    const a = generateSessions(3);
    const b = generateSessions(3);
    expect(a).toEqual(b);
    expect(a.length).toBe(9); // level*2 + 3
  });

  test('generateSessions different levels produce different sessions', () => {
    const a = generateSessions(1);
    const b = generateSessions(2);
    expect(a).not.toEqual(b);
  });

  test('calculateScore - perfect game', () => {
    const score = calculateScore(5, 0, 0, 60);
    expect(score).toBe(800); // 5*100 + 60*5 = 800
  });

  test('calculateScore - all wrong', () => {
    const score = calculateScore(0, 5, 3, 0);
    expect(score).toBe(0);
  });

  test('calculateScore - mixed', () => {
    const score = calculateScore(3, 2, 1, 30);
    expect(score).toBe(305); // 300 - 150 + 150 = 300? wait: 3*100 = 300; penalty = (2+1)*50 = 150; time = 30*5 = 150; total = 300
    expect(score).toBe(300);
  });

  test('calculateScore clamped to 1000', () => {
    const score = calculateScore(20, 0, 0, 100);
    expect(score).toBe(1000);
  });

  test('formatTime', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(-1)).toBe('0:00');
  });

  test('getGrade', () => {
    expect(getGrade(950)).toBe('S');
    expect(getGrade(200)).toBe('D');
  });
});
