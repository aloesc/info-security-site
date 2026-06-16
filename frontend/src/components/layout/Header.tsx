'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const NAV_LINKS = [
  { href: '/', label: 'Главная' },
  { href: '/#games', label: 'Игры' },
  { href: '/leaderboard', label: 'Таблица лидеров' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-card bg-cyber-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-wide text-cyber-blue transition-colors hover:text-cyber-purple sm:text-xl"
          aria-label="На главную"
          onClick={closeMenu}
        >
          CyberGuard
        </Link>

        <nav aria-label="Основная навигация" className="hidden lg:block">
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

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-cyber-card p-2 text-slate-200 transition-colors hover:bg-cyber-card/60 lg:hidden"
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`border-t border-cyber-card bg-cyber-dark/95 lg:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <nav aria-label="Мобильная навигация" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 transition-colors hover:bg-cyber-card hover:text-cyber-blue"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user ? (
              <li className="space-y-3 pt-2">
                <div className="flex items-center gap-2 rounded-lg bg-cyber-card/50 px-3 py-2">
                  <User className="h-4 w-4 text-cyber-blue" />
                  <span className="text-sm font-medium text-slate-200">
                    {user.display_name || user.username}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyber-red/10 px-3 py-2 text-sm font-medium text-cyber-red transition-colors hover:bg-cyber-red/20"
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
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-slate-200 transition-colors hover:bg-cyber-card hover:text-cyber-blue"
                  >
                    Войти
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block rounded-lg bg-cyber-blue px-3 py-2 text-center text-base font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
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
