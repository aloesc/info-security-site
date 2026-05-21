'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const NAV_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/games', label: 'Игры' },
  { href: '/leaderboard', label: 'Таблица лидеров' },
];

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-card bg-cyber-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-wide text-cyber-blue transition-colors hover:text-cyber-purple sm:text-xl"
          aria-label="На главную"
        >
          CyberGuard
        </Link>

        <nav aria-label="Основная навигация">
          <ul className="flex items-center gap-4 sm:gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-300 transition-colors hover:text-cyber-blue sm:text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user ? (
              <li className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-cyber-card/50 px-3 py-1.5">
                  <User className="h-4 w-4 text-cyber-blue" />
                  <span className="text-sm font-medium text-slate-200">{user.display_name || user.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 rounded-lg bg-cyber-red/10 px-3 py-1.5 text-sm font-medium text-cyber-red transition-colors hover:bg-cyber-red/20"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-300 transition-colors hover:text-cyber-blue sm:text-base"
                  >
                    Войти
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="rounded-lg bg-cyber-blue px-4 py-2 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
                  >
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
