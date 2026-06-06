'use client';

import React, { useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSessions, calculateScore, getGrade, Session } from './logic';
import SessionList from './SessionList';
import GameTimer from './Timer';
import { submitScore } from '@/lib/api';
import { fadeInUp } from '@/lib/animations';

const MAX_TIME = 60;

interface GameState {
  level: number;
  sessions: Session[];
  closedIds: Set<string>;
  score: number;
  timeLeft: number;
  isGameOver: boolean;
  phase: 'playing' | 'result' | 'next';
}

type Action =
  | { type: 'INIT' }
  | { type: 'TICK' }
  | { type: 'CLOSE'; id: string }
  | { type: 'NEXT_LEVEL' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' };

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'INIT': {
      const sessions = generateSessions(1);
      return {
        level: 1,
        sessions,
        closedIds: new Set<string>(),
        score: 0,
        timeLeft: MAX_TIME,
        isGameOver: false,
        phase: 'playing',
      };
    }
    case 'TICK': {
      if (state.isGameOver || state.phase !== 'playing') return state;
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        return { ...state, timeLeft: 0, phase: 'result' };
      }
      return { ...state, timeLeft: newTime };
    }
    case 'CLOSE': {
      const nextClosed = new Set(state.closedIds);
      nextClosed.add(action.id);
      const allSuspiciousClosed = state.sessions
        .filter((s) => s.isSuspicious)
        .every((s) => nextClosed.has(s.id));
      if (allSuspiciousClosed) {
        return { ...state, closedIds: nextClosed, phase: 'result' };
      }
      return { ...state, closedIds: nextClosed };
    }
    case 'NEXT_LEVEL': {
      if (state.level >= 5) {
        return { ...state, isGameOver: true, phase: 'result' };
      }
      const nextLevel = state.level + 1;
      const sessions = generateSessions(nextLevel);
      return {
        level: nextLevel,
        sessions,
        closedIds: new Set<string>(),
        score: state.score,
        timeLeft: MAX_TIME,
        isGameOver: false,
        phase: 'playing',
      };
    }
    case 'RESTART':
      return gameReducer(state, { type: 'INIT' });
    default:
      return state;
  }
}

export default function SessionGame() {
  const [state, dispatch] = useReducer(gameReducer, {
    level: 1,
    sessions: [],
    closedIds: new Set<string>(),
    score: 0,
    timeLeft: MAX_TIME,
    isGameOver: false,
    phase: 'playing',
  });

  useEffect(() => {
    dispatch({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (state.phase !== 'playing' || state.isGameOver) return;
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timer);
  }, [state.phase, state.isGameOver]);

  useEffect(() => {
    if (state.phase === 'result' && !state.isGameOver && state.level >= 5) {
      dispatch({ type: 'GAME_OVER' });
    }
  }, [state.phase, state.isGameOver, state.level]);

  useEffect(() => {
    if (state.isGameOver) {
      const suspicious = state.sessions.filter((s) => s.isSuspicious);
      const closedSuspicious = suspicious.filter((s) => state.closedIds.has(s.id)).length;
      const missedSuspicious = suspicious.length - closedSuspicious;
      const closedLegitimate = state.sessions
        .filter((s) => !s.isSuspicious)
        .filter((s) => state.closedIds.has(s.id)).length;
      const roundScore = calculateScore(closedSuspicious, missedSuspicious, closedLegitimate, state.timeLeft);
      const totalScore = state.score + roundScore;

      submitScore('session', totalScore).catch(() => {});
    }
  }, [state.isGameOver]);

  const suspiciousCount = state.sessions.filter((s) => s.isSuspicious).length;
  const closedSuspicious = state.sessions
    .filter((s) => s.isSuspicious)
    .filter((s) => state.closedIds.has(s.id)).length;

  return (
    <section className="min-h-screen bg-cyber-black py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">Защитник Сессий</h1>
          <p className="mt-2 text-sm text-slate-400">
            Закройте все подозрительные сессии за 60 секунд. Не трогайте свои!
          </p>
        </div>

        {state.phase === 'playing' && state.sessions.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-slate-300">Уровень {state.level} / 5</div>
              <GameTimer timeLeft={state.timeLeft} maxTime={MAX_TIME} />
              <div className="text-sm text-slate-300">
                Подозрительных: {closedSuspicious} / {suspiciousCount}
              </div>
            </div>
            <SessionList
              sessions={state.sessions}
              closedIds={state.closedIds}
              onClose={(id) => dispatch({ type: 'CLOSE', id })}
            />
          </>
        )}

        <AnimatePresence>
          {state.phase === 'result' && !state.isGameOver && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6 rounded-xl border border-cyber-card bg-cyber-dark/80 p-6 text-center"
            >
              <h2 className="text-lg font-bold text-slate-50">Уровень {state.level} завершён!</h2>
              <button
                onClick={() => dispatch({ type: 'NEXT_LEVEL' })}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
              >
                Следующий уровень
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {state.isGameOver && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mt-6 rounded-xl border border-cyber-card bg-cyber-dark/80 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyber-blue/10">
              <span className="text-3xl font-bold text-cyber-blue">{state.score}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-50">Игра окончена!</h2>
            <p className="mt-2 text-sm text-slate-400">Оценка: {getGrade(state.score)}</p>
            <button
              onClick={() => dispatch({ type: 'RESTART' })}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
            >
              Играть снова
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
