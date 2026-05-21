'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (form.password.length < 8) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }
    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        display_name: form.display_name || form.username,
      });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
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
          <h1 className="text-2xl font-bold text-slate-50">Регистрация</h1>
          <p className="mt-2 text-sm text-slate-400">Создайте новый аккаунт</p>
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
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Отображаемое имя</label>
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full rounded-xl border border-cyber-card bg-cyber-black px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
              placeholder="Как к вам обращаться"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-cyber-card bg-cyber-black px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
              placeholder="you@example.com"
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
                minLength={8}
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Подтвердите пароль</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-cyber-card bg-cyber-black px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyber-blue focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-cyber-red/10 p-3 text-sm text-cyber-red">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyber-blue py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90 disabled:opacity-50"
          >
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-cyber-blue hover:underline">Войти</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
