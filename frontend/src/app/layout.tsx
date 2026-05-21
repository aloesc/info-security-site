import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Кибербезопасность — Защити свои аккаунты',
  description:
    'Интерактивный курс по защите социальных сетей: фишинг, SIM-swapping, перехват сессий и другие угрозы.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-cyber-black text-slate-100 antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
