'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-cyber-card bg-cyber-dark p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-blue/10">
            <Shield className="h-6 w-6 text-cyber-blue" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Вход в CyberGuard</h1>
          <p className="mt-2 text-sm text-slate-400">Введите свои учетные данные</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Имя пользователя</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-xl border border-cyber-card bg-cyber-black px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
              placeholder="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-cyber-card bg-cyber-black px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyber-blue py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90 disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-cyber-blue hover:underline">Зарегистрироваться</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
