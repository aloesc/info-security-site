'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StrengthResult } from './logic';

export default function StrengthMeter({ strength }: { strength: StrengthResult }) {
  const segments = [
    { label: 'Слабый', color: 'bg-cyber-red' },
    { label: 'Средний', color: 'bg-yellow-500' },
    { label: 'Сильный', color: 'bg-cyber-blue' },
    { label: 'Несокрушимый', color: 'bg-cyber-green' },
  ];

  const activeIndex =
    strength.level === 'weak' ? 0 :
    strength.level === 'medium' ? 1 :
    strength.level === 'strong' ? 2 : 3;

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-1">
        {segments.map((seg, idx) => (
          <div
            key={seg.label}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx <= activeIndex ? seg.color : 'bg-cyber-card'
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        {segments.map((seg, idx) => (
          <span
            key={seg.label}
            className={`${idx === activeIndex ? 'font-semibold text-slate-100' : 'text-slate-500'}`}
          >
            {seg.label}
          </span>
        ))}
      </div>
      <div className="mt-1 text-center text-sm font-medium text-slate-200">
        {strength.label} ({strength.score}/100)
      </div>
    </div>
  );
}
