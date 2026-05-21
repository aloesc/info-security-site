'use client';

import React, { useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PHISHING_DATA } from './data';
import { calculateScore, formatTime } from './logic';
import { QuestionCard, TimerBar, ResultScreen } from './GameUI';
import { staggerContainer } from '@/lib/animations';

interface GameState {
  rounds: typeof PHISHING_DATA;
  currentIndex: number;
  answers: { roundId: number; correct: boolean; timeLeft: number }[];
  timeLeft: number;
  isGameOver: boolean;
}

type Action =
  | { type: 'INIT' }
  | { type: 'TICK' }
  | { type: 'ANSWER'; isPhishing: boolean }
  | { type: 'NEXT' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' };

const MAX_TIME = 15;

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'INIT': {
      const shuffled = [...PHISHING_DATA].sort(() => Math.random() - 0.5).slice(0, 10);
      return {
        rounds: shuffled,
        currentIndex: 0,
        answers: [],
        timeLeft: MAX_TIME,
        isGameOver: false,
      };
    }
    case 'TICK':
      if (state.isGameOver) return state;
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        const currentRound = state.rounds[state.currentIndex];
        return {
          ...state,
          timeLeft: 0,
          answers: [
            ...state.answers,
            { roundId: currentRound.id, correct: false, timeLeft: 0 },
          ],
          currentIndex: state.currentIndex + 1,
          isGameOver: state.currentIndex + 1 >= state.rounds.length,
        };
      }
      return { ...state, timeLeft: newTime };
    case 'ANSWER': {
      const currentRound = state.rounds[state.currentIndex];
      const isCorrect = action.isPhishing === currentRound.isPhishing;
      const nextIndex = state.currentIndex + 1;
      const isOver = nextIndex >= state.rounds.length;
      return {
        ...state,
        answers: [
          ...state.answers,
          { roundId: currentRound.id, correct: isCorrect, timeLeft: state.timeLeft },
        ],
        currentIndex: nextIndex,
        isGameOver: isOver,
        timeLeft: isOver ? 0 : MAX_TIME,
      };
    }
    case 'RESTART':
      return gameReducer(state, { type: 'INIT' });
    default:
      return state;
  }
}

export default function PhishingGame() {
  const [state, dispatch] = useReducer(gameReducer, {
    rounds: [],
    currentIndex: 0,
    answers: [],
    timeLeft: MAX_TIME,
    isGameOver: false,
  });

  useEffect(() => {
    dispatch({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (state.isGameOver || state.rounds.length === 0) return;
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.isGameOver, state.timeLeft, state.rounds.length]);

  useEffect(() => {
    if (state.isGameOver && state.answers.length > 0) {
      const score = calculateScore(state.answers);
      const userId = localStorage.getItem('user_id') || 'anonymous';
      fetch('/api/games/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_type: 'phishing', score }),
      }).catch(() => {
        // silent fail - offline mode
      });
    }
  }, [state.isGameOver]);

  const correctCount = state.answers.filter((a) => a.correct).length;

  return (
    <section className="min-h-screen bg-cyber-black py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">Детектив Фишинга</h1>
          <p className="mt-2 text-sm text-slate-400">
            Определяйте, является ли сообщение фишингом. У вас 15 секунд на каждый вопрос.
          </p>
        </div>

        {!state.isGameOver && state.rounds.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Вопрос {state.currentIndex + 1} / {state.rounds.length}</span>
              <span>Правильных: {correctCount}</span>
            </div>
            <TimerBar timeLeft={state.timeLeft} maxTime={MAX_TIME} />
            <AnimatePresence mode="wait">
              <QuestionCard
                key={state.rounds[state.currentIndex]?.id}
                round={state.rounds[state.currentIndex]}
                onAnswer={(isPhishing) => dispatch({ type: 'ANSWER', isPhishing })}
                timeLeft={state.timeLeft}
              />
            </AnimatePresence>
          </>
        )}

        {state.isGameOver && (
          <ResultScreen
            score={calculateScore(state.answers)}
            total={correctCount}
            onRestart={() => dispatch({ type: 'RESTART' })}
          />
        )}
      </div>
    </section>
  );
}
