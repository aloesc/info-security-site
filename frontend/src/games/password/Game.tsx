'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateStrength,
  estimateCrackingTime,
  calculateGameScore,
  getLevelTarget,
  getPasswordTips,
  meetsLevelTarget,
} from './logic';
import StrengthMeter from './StrengthMeter';
import CrackingTimeDisplay from './CrackingTimeDisplay';
import { submitScore } from '@/lib/api';
import { fadeInUp } from '@/lib/animations';

const MAX_LEVELS = 5;

export default function PasswordGame() {
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (startTime === null && !gameOver) {
      setStartTime(Date.now());
    }
  }, [startTime, gameOver]);

  const strength = calculateStrength(password);
  const target = getLevelTarget(level);
  const time = estimateCrackingTime(password);
  const tips = getPasswordTips(password, level);

  useEffect(() => {
    if (gameOver || levelComplete) return;
    if (meetsLevelTarget(password, level)) {
      if (level < MAX_LEVELS) {
        setLevelComplete(true);
      } else {
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 999;
        const speedBonus = Math.max(0, Math.round(300 - elapsed));
        const score = calculateGameScore(level, strength.score, speedBonus);
        setFinalScore(score);
        setGameOver(true);

        submitScore('password', score).catch(() => {});
      }
    }
  }, [strength.score, password, level, gameOver, levelComplete, startTime]);

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setPassword('');
    setLevelComplete(false);
  };

  const restart = () => {
    setPassword('');
    setLevel(1);
    setLevelComplete(false);
    setGameOver(false);
    setStartTime(null);
    setFinalScore(0);
  };

  return (
    <section className="min-h-screen bg-cyber-black py-12 px-4">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-cyber-card px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-cyber-card/60"
          >
            ← Главное меню
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">Крепость Пароля</h1>
          <p className="mt-2 text-sm text-slate-400">
            Создавайте пароли, соответствующие целям уровня. Чем сильнее — тем выше балл.
          </p>
        </div>

        {!gameOver && !levelComplete && (
          <>
            <div className="mb-6 flex items-center justify-between text-sm">
              <span className="text-slate-300">Уровень {level} / {MAX_LEVELS}</span>
              <span className="text-cyber-blue">Цель: {target.hint}</span>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                className="w-full rounded-xl border border-cyber-card bg-cyber-dark px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
                autoComplete="off"
              />
            </div>

            <div className="mb-6">
              <StrengthMeter strength={strength} />
            </div>

            <div className="mb-6">
              <CrackingTimeDisplay time={time} />
            </div>

            <AnimatePresence>
              {tips.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="rounded-xl border border-cyber-card bg-cyber-dark/60 p-4"
                >
                  <h3 className="mb-2 text-sm font-semibold text-slate-200">Советы:</h3>
                  <ul className="space-y-1">
                    {tips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-400">• {tip}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {levelComplete && !gameOver && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-cyber-card bg-cyber-dark/80 p-8 text-center"
          >
            <h2 className="text-xl font-bold text-slate-50">Уровень {level} пройден!</h2>
            <p className="mt-2 text-sm text-slate-400">Готовы к следующему этапу?</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={nextLevel}
                className="inline-flex items-center justify-center rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
              >
                Следующий уровень
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-cyber-card px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-cyber-card/60"
              >
                В главное меню
              </Link>
            </div>
          </motion.div>
        )}

        {gameOver && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-cyber-card bg-cyber-dark/80 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyber-green/10">
              <span className="text-3xl font-bold text-cyber-green">{finalScore}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-50">Игра завершена!</h2>
            <p className="mt-2 text-sm text-slate-400">Все 5 уровней пройдены.</p>
            <button
              onClick={restart}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
            >
              Играть снова
            </button>
            <div className="mt-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-cyber-card px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-cyber-card/60"
              >
                В главное меню
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
