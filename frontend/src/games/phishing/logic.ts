import { Round } from './data';

export interface Answer {
  roundId: number;
  correct: boolean;
  timeLeft: number;
}

export function calculateScore(answers: Answer[]): number {
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  if (totalQuestions === 0) return 0;

  const base = correctCount * 100;
  const timeBonus = answers.reduce((sum, a) => sum + a.timeLeft * 2, 0);
  const score = base + timeBonus;
  return Math.min(score, 1000);
}

export function formatTime(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getFeedbackMessage(score: number, max = 1000): string {
  const ratio = score / max;
  if (ratio >= 0.9) return 'Отличная работа! Вы настоящий эксперт по безопасности!';
  if (ratio >= 0.7) return 'Хороший результат! Но есть к чему стремиться.';
  if (ratio >= 0.5) return 'Неплохо, но злоумышленники всё ещё могут вас обмануть.';
  return 'Нужно больше практики. Попробуйте ещё раз!';
}

export function getGrade(score: number): string {
  if (score >= 900) return 'S';
  if (score >= 750) return 'A';
  if (score >= 600) return 'B';
  if (score >= 400) return 'C';
  return 'D';
}

export function generateRounds(rounds: Round[], limit = 10): Round[] {
  const shuffled = [...rounds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
