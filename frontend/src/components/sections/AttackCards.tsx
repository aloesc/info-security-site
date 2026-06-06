'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fish,
  Smartphone,
  EyeOff,
  KeyRound,
  Users,
  ChevronDown,
  ShieldCheck,
  X,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface AttackData {
  id: string;
  title: string;
  icon: React.ReactNode;
  short: string;
  description: string;
  mitigation: string;
}

const ATTACKS: AttackData[] = [
  {
    id: 'phishing',
    title: 'Фишинг',
    icon: <Fish className="h-6 w-6" />,
    short: 'Поддельные сайты и ссылки, похищающие данные.',
    description:
      'Злоумышленники создают точные копии популярных сайтов или рассылают письма от имени известных сервисов, чтобы выманить логины и пароли.',
    mitigation:
      'Всегда проверяйте URL в адресной строке. Не переходите по ссылкам из незнакомых писем. Используйте MFA.',
  },
  {
    id: 'sim-swap',
    title: 'SIM-свопинг',
    icon: <Smartphone className="h-6 w-6" />,
    short: 'Перехват SMS-кодов через подмену SIM-карты.',
    description:
      'Атакующие обманывают оператора связи, перенося ваш номер на свою SIM-карту, чтобы получать коды подтверждения и сбрасывать пароли.',
    mitigation:
      'Отключите привязку к SMS. Используйте приложения-аутентификаторы (Google Authenticator, Authy). Установите пин-код в салоне связи.',
  },
  {
    id: 'session-hijacking',
    title: 'Кража сессий',
    icon: <EyeOff className="h-6 w-6" />,
    short: 'Перехват сессий через вредоносные расширения или общедоступный Wi-Fi.',
    description:
      'Злоумышленники крадут cookie-файлы сессии через вредоносные браузерные расширения или перехватывая трафик в общедоступных Wi-Fi сетях.',
    mitigation:
      'Не устанавливайте непроверенные расширения. Используйте VPN в публичных сетях. Регулярно завершайте активные сессии в настройках аккаунта.',
  },
  {
    id: 'brute-force',
    title: 'Брутфорс',
    icon: <KeyRound className="h-6 w-6" />,
    short: 'Подбор паролей по базе утечек.',
    description:
      'Атакующие используют базы данных утекших паролей, подбирая комбинации логин/пароль к вашим аккаунтам в автоматическом режиме.',
    mitigation:
      'Используйте уникальные длинные пароли для каждого сервиса. Включите двухфакторную аутентификацию. Проверяйте утечки на Have I Been Pwned.',
  },
  {
    id: 'social-engineering',
    title: 'Социальная инженерия',
    icon: <Users className="h-6 w-6" />,
    short: '"Звонки из поддержки" и манипуляции людьми.',
    description:
      'Мошенники звонят от имени "службы поддержки" банка или соцсети, выманивая SMS-коды или данные карты под предлогом "взлома" или "блокировки".',
    mitigation:
      'Служба поддержки никогда не просит SMS-коды. Сбрасывайте звонок и перезванивайте по официальному номеру. Проверяйте личность собеседника.',
  },
];

function AttackCard({ item, isExpanded, onToggle, index }: {
  item: AttackData;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <Card
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
        className={`cursor-pointer overflow-hidden transition-colors ${
          isExpanded ? 'border-cyber-blue/40' : ''
        }`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className={`rounded-lg bg-cyber-dark p-2.5 text-cyber-blue`}>
              {item.icon}
            </div>
            {isExpanded ? (
              <X className="mt-1 h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="mt-1 h-5 w-5 text-slate-500" />
            )}
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-50">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{item.short}</p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-t border-cyber-dark pt-4">
                  <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-cyber-dark/60 p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyber-green" />
                    <p className="text-sm text-slate-300">{item.mitigation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AttackCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <section
      id="attacks"
      aria-label="Методы атак"
      className="bg-cyber-black py-16 px-4 sm:py-20 lg:py-24"
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
            Как вас атакуют
          </h2>
          <p className="mt-3 text-slate-400">
            Пять самых распространённых методов, которые используют злоумышленники.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ATTACKS.map((item, idx) => (
            <AttackCard
              key={item.id}
              item={item}
              index={idx}
              isExpanded={expandedId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
