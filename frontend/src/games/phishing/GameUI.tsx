'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Round } from './data';
import { formatTime } from './logic';
import { fadeInUp } from '@/lib/animations';

export function QuestionCard({
  round,
  onAnswer,
  timeLeft,
}: {
  round: Round;
  onAnswer: (isPhishing: boolean) => void;
  timeLeft: number;
}) {
  return (
    <motion.div
      key={round.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-xl rounded-xl border border-cyber-card bg-cyber-dark/80 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-slate-400">Вопрос #{round.id}</span>
        <div className="flex items-center gap-1 text-sm font-medium text-cyber-blue">
          <Timer className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="rounded-lg bg-cyber-black p-4">
        <p className="text-sm text-slate-500">От: {round.sender}</p>
        <p className="mt-1 text-sm font-semibold text-slate-200">Тема: {round.subject}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{round.body}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onAnswer(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-cyber-red/10 px-4 py-3 text-sm font-medium text-cyber-red transition-colors hover:bg-cyber-red/20"
        >
          <AlertTriangle className="h-4 w-4" />
          Фишинг
        </button>
        <button
          onClick={() => onAnswer(false)}
          className="flex items-center justify-center gap-2 rounded-lg bg-cyber-green/10 px-4 py-3 text-sm font-medium text-cyber-green transition-colors hover:bg-cyber-green/20"
        >
          <CheckCircle className="h-4 w-4" />
          Легитимно
        </button>
      </div>
    </motion.div>
  );
}

export function TimerBar({ timeLeft, maxTime = 15 }: { timeLeft: number; maxTime?: number }) {
  const percent = Math.max(0, (timeLeft / maxTime) * 100);
  const color = percent > 50 ? 'bg-cyber-green' : percent > 25 ? 'bg-yellow-500' : 'bg-cyber-red';

  return (
    <div className="mx-auto mb-6 max-w-xl">
      <div className="h-2 w-full rounded-full bg-cyber-card">
        <motion.div
          className={`h-2 rounded-full ${color}`}
          initial={{ width: '100%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="mt-1 text-center text-xs text-slate-400">
        У вас {formatTime(timeLeft)} на ответ
      </p>
    </div>
  );
}

export function ResultScreen({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-xl text-center"
    >
      <div className="rounded-xl border border-cyber-card bg-cyber-dark/80 p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyber-blue/10"
        >
          <span className="text-3xl font-bold text-cyber-blue">{score}</span>
        </motion.div>

        <h2 className="text-xl font-bold text-slate-50">Результат</h2>
        <p className="mt-2 text-sm text-slate-400">Правильных ответов: {total} / 10</p>

        <button
          onClick={onRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
        >
          <XCircle className="h-4 w-4" />
          Играть снова
        </button>
      </div>
    </motion.div>
  );
}
