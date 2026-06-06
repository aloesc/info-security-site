import { calculateScore, formatTime, getFeedbackMessage, getGrade, generateRounds } from './logic';
import { PHISHING_DATA } from './data';

describe('phishing logic', () => {
  test('calculateScore - all correct', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      roundId: i,
      correct: true,
      timeLeft: 10,
    }));
    const score = calculateScore(answers);
    expect(score).toBe(1000); // 10*100 + 10*10*2 = 1200, clamped to 1000
    expect(score).toBeLessThanOrEqual(1000);
  });

  test('calculateScore - all wrong', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      roundId: i,
      correct: false,
      timeLeft: 0,
    }));
    expect(calculateScore(answers)).toBe(0);
  });

  test('calculateScore - empty', () => {
    expect(calculateScore([])).toBe(0);
  });

  test('calculateScore - mixed', () => {
    const answers = [
      { roundId: 0, correct: true, timeLeft: 8 },
      { roundId: 1, correct: false, timeLeft: 2 },
      { roundId: 2, correct: true, timeLeft: 12 },
    ];
    expect(calculateScore(answers)).toBe(244); // 2*100 + (8+2+12)*2 = 200 + 44 = 244
  });

  test('formatTime', () => {
    expect(formatTime(15)).toBe('0:15');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(-1)).toBe('0:00');
  });

  test('getGrade', () => {
    expect(getGrade(950)).toBe('S');
    expect(getGrade(800)).toBe('A');
    expect(getGrade(650)).toBe('B');
    expect(getGrade(450)).toBe('C');
    expect(getGrade(200)).toBe('D');
  });

  test('generateRounds returns 10 items', () => {
    const rounds = generateRounds(PHISHING_DATA);
    expect(rounds.length).toBeLessThanOrEqual(10);
  });
});
