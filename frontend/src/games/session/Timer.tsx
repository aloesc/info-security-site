'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from './logic';

export default function GameTimer({ timeLeft, maxTime = 60 }: { timeLeft: number; maxTime?: number }) {
  const percent = Math.max(0, (timeLeft / maxTime) * 100);
  const color = percent > 50 ? 'stroke-cyber-green' : percent > 25 ? 'stroke-yellow-500' : 'stroke-cyber-red';

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a2e" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-50">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <span className="mt-1 text-xs text-slate-400">Осталось времени</span>
    </div>
  );
}
