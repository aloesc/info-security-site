import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-cyber-card bg-cyber-dark py-6 sm:py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate-400">
          &copy; {currentYear} CyberGuard. Все права защищены.
        </p>

        <p className="text-xs text-slate-500">
          Информационная безопасность для каждого.
        </p>
      </div>
    </footer>
  );
}
