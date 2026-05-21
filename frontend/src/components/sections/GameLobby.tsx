'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye } from 'lucide-react';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/animations';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const GAMES: GameCard[] = [
  {
    id: 'phishing',
    title: 'Детектив Фишинга',
    description: 'Определяйте фишинговые письма и сообщения. Чем быстрее и точнее — тем выше балл.',
    icon: <Shield className="h-8 w-8" />,
    href: '/games/phishing',
    color: 'text-cyber-blue',
  },
  {
    id: 'password',
    title: 'Крепость Пароля',
    description: 'Создавайте несокрушимые пароли и узнайте, сколько их взломает компьютер.',
    icon: <Lock className="h-8 w-8" />,
    href: '/games/password',
    color: 'text-cyber-green',
  },
  {
    id: 'session',
    title: 'Защитник Сессий',
    description: 'Определяйте подозрительные сеансы и закрывайте их до того, как закончится время.',
    icon: <Eye className="h-8 w-8" />,
    href: '/games/session',
    color: 'text-cyber-purple',
  },
];

export default function GameLobby() {
  return (
    <section
      id="games"
      aria-label="Мини-игры"
      className="bg-cyber-dark py-16 px-4 sm:py-20 lg:py-24"
    >
      <motion.div
        className="mx-auto max-w-7xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp} className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl lg:text-4xl">
            Играть и учиться
          </h2>
          <p className="mt-3 text-slate-400">
            Проверьте свои знания в интерактивных мини-играх про кибербезопасность.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <motion.div key={game.id} variants={fadeInUp}>
              <Link href={game.href} className="block h-full">
                <motion.div
                  className="flex h-full flex-col rounded-xl border border-cyber-card bg-cyber-card/80 p-6 backdrop-blur-sm"
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className={`mb-4 rounded-lg bg-cyber-dark/60 p-3 ${game.color} w-fit`}>
                    {game.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-50">{game.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-400">{game.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-cyber-blue hover:underline">
                    Играть
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
