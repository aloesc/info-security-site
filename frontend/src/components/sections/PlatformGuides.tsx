'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Shield, Smartphone, Globe } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Step {
  id: string;
  label: string;
}

interface PlatformData {
  id: string;
  name: string;
  icon: React.ReactNode;
  steps: Step[];
}

const PLATFORMS: PlatformData[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: <Smartphone className="h-5 w-5" />,
    steps: [
      { id: 'tg-1', label: 'Установите облачный пароль (двухфакторная аутентификация)' },
      { id: 'tg-2', label: 'Отключите привязку к SMS — используйте только облачный пароль' },
      { id: 'tg-3', label: 'Завершите все другие активные сеансы в настройках устройств' },
      { id: 'tg-4', label: 'Не переходите по ссылкам «вход в Telegram Web» от незнакомцев' },
      { id: 'tg-5', label: 'Включите уведомления о новых входах в аккаунт' },
      { id: 'tg-6', label: 'Используйте отдельный пароль для облака, не как в почте' },
      { id: 'tg-7', label: 'Никогда не передавайте код из SMS — даже «сотруднику поддержки»' },
    ],
  },
  {
    id: 'vk',
    name: 'ВКонтакте',
    icon: <Shield className="h-5 w-5" />,
    steps: [
      { id: 'vk-1', label: 'Включите двухфакторную аутентификацию' },
      { id: 'vk-2', label: 'Установите сложный пароль, который не используете нигде' },
      { id: 'vk-3', label: 'Проверьте и завершите все активные сеансы' },
      { id: 'vk-4', label: 'Включите подтверждение входа через SMS или приложение' },
      { id: 'vk-5', label: 'Не переходите по подозрительным ссылкам из сообщений' },
      { id: 'vk-6', label: 'Проверьте, какие приложения подключены к вашему аккаунту' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Globe className="h-5 w-5" />,
    steps: [
      { id: 'ig-1', label: 'Включите двухфакторную аутентификацию' },
      { id: 'ig-2', label: 'Проверьте список авторизованных приложений' },
      { id: 'ig-3', label: 'Используйте сложный уникальный пароль' },
      { id: 'ig-4', label: 'Будьте осторожны с сообщениями «от спонсоров» и фишинга' },
      { id: 'ig-5', label: 'Не переходите по ссылкам в Direct от незнакомцев' },
      { id: 'ig-6', label: 'Регулярно просматривайте список активных сеансов' },
    ],
  },
];

function PlatformAccordion({ platform, checkedSteps, onToggle, isExpanded, onExpand }: {
  platform: PlatformData;
  checkedSteps: Set<string>;
  onToggle: (stepId: string) => void;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const completed = checkedSteps.size;
  const total = platform.steps.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-xl border border-cyber-card bg-cyber-dark/60"
    >
      <button
        onClick={onExpand}
        className="flex w-full items-center justify-between p-4 text-left sm:p-5"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyber-blue/10 p-2 text-cyber-blue">
            {platform.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{platform.name}</h3>
            <p className="text-xs text-slate-400 sm:text-sm">
              {completed} из {total} выполнено
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-24">
            <div className="h-2 w-full rounded-full bg-cyber-card">
              <motion.div
                className="h-2 rounded-full bg-cyber-green"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-cyber-card px-4 pb-5 pt-3 sm:px-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-cyber-card">
                  <div
                    className="h-2 rounded-full bg-cyber-green transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-300">{percent}%</span>
              </div>

              <ul className="space-y-2">
                {platform.steps.map((step) => {
                  const isChecked = checkedSteps.has(step.id);
                  return (
                    <li key={step.id}>
                      <button
                        onClick={() => onToggle(step.id)}
                        className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors ${
                          isChecked
                            ? 'bg-cyber-green/10 text-cyber-green'
                            : 'bg-cyber-card/50 text-slate-300 hover:bg-cyber-card'
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            isChecked
                              ? 'border-cyber-green bg-cyber-green'
                              : 'border-slate-500'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 text-cyber-black" />}
                        </div>
                        <span className="text-sm leading-snug">{step.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlatformGuides() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <section
      id="guides"
      aria-label="Инструкции по платформам"
      className="bg-cyber-black py-16 px-4 sm:py-20 lg:py-24"
    >
      <motion.div
        className="mx-auto max-w-3xl"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp} className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl lg:text-4xl">
            Инструкция по платформам
          </h2>
          <p className="mt-3 text-slate-400">
            Пошаговые меры защиты для Telegram, ВКонтакте и Instagram.
          </p>
        </motion.div>

        <div className="space-y-4">
          {PLATFORMS.map((platform) => (
            <PlatformAccordion
              key={platform.id}
              platform={platform}
              checkedSteps={checkedSteps}
              onToggle={toggleStep}
              isExpanded={expandedId === platform.id}
              onExpand={() => toggleExpanded(platform.id)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
