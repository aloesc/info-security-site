'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function CrackingTimeDisplay({ time }: { time: string }) {
  return (
    <motion.div
      key={time}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-xl border border-cyber-card bg-cyber-dark/60 p-4"
    >
      <Clock className="mb-2 h-6 w-6 text-cyber-blue" />
      <span className="text-xs text-slate-400">Время взлома</span>
      <span className="mt-1 text-lg font-bold text-slate-50 sm:text-xl">{time}</span>
    </motion.div>
  );
}
