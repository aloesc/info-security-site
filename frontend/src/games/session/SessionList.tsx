'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Globe, Clock, AlertTriangle } from 'lucide-react';
import { Session } from './logic';

export default function SessionList({
  sessions,
  closedIds,
  onClose,
}: {
  sessions: Session[];
  closedIds: Set<string>;
  onClose: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {sessions.map((session, idx) => {
        const isClosed = closedIds.has(session.id);
        return (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: isClosed ? 0.3 : 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
              session.isSuspicious
                ? 'border-cyber-red/30 bg-cyber-red/5'
                : 'border-cyber-card bg-cyber-dark/60'
            } ${isClosed ? 'grayscale' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-cyber-card p-2 text-slate-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-200">{session.device}</span>
                  {session.isSuspicious && !isClosed && (
                    <span className="flex items-center gap-1 rounded bg-cyber-red/10 px-1.5 py-0.5 text-[10px] font-medium text-cyber-red">
                      <AlertTriangle className="h-3 w-3" />
                      Подозрительно
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {session.location}
                  </span>
                  <span>•</span>
                  <span>{session.ip}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {session.time}
                  </span>
                </div>
              </div>
            </div>

            {!isClosed && (
              <button
                onClick={() => onClose(session.id)}
                className="flex items-center gap-1 rounded-lg bg-cyber-red/10 px-3 py-2 text-xs font-medium text-cyber-red transition-colors hover:bg-cyber-red/20"
              >
                <X className="h-4 w-4" />
                Закрыть
              </button>
            )}
            {isClosed && (
              <span className="text-xs text-slate-500">Закрыто</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
