'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { getLeaderboard } from '@/lib/api';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Score {
  user_id: string;
  display_name: string;
  game_type: string;
  score: number;
  timestamp: string;
}

const GAME_TYPES = [
  { id: 'phishing', label: 'Детектив Фишинга' },
  { id: 'password', label: 'Крепость Пароля' },
  { id: 'session', label: 'Защитник Сессий' },
];

const ICONS = [
  <Trophy className="h-5 w-5 text-yellow-400" />,
  <Medal className="h-5 w-5 text-slate-300" />,
  <Award className="h-5 w-5 text-amber-600" />,
];

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState('phishing');
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(selectedGame)
      .then((data) => setScores(data.slice(0, 10)))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-cyber-black">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">🏆 Таблица лидеров</h1>
            <p className="mt-2 text-sm text-slate-400">Лучшие игроки каждой мини-игры.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6 flex justify-center gap-2">
            {GAME_TYPES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGame(g.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGame === g.id
                    ? 'bg-cyber-blue text-cyber-black'
                    : 'bg-cyber-card text-slate-300 hover:bg-cyber-dark'
                }`}
              >
                {g.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-cyber-card bg-cyber-dark/80"
          >
            {loading && (
              <div className="p-8 text-center text-sm text-slate-400">Загрузка...</div>
            )}

            {!loading && scores.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">
                Пока нет результатов. Станьте первым!
              </div>
            )}

            {!loading && scores.length > 0 && (
              <div className="divide-y divide-cyber-card">
                {scores.map((score, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyber-card text-sm font-bold text-slate-200">
                        {idx < 3 ? ICONS[idx] : idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {score.display_name || score.user_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400">{score.score} очков</span>
                      <span className="text-xs text-slate-500">
                        {new Date(score.timestamp).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
