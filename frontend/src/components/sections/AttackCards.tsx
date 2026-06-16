'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import AttackIcon from '@/components/attacks/AttackIcon';
import { ATTACKS, type AttackData } from '@/content/attacks';

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
              <AttackIcon name={item.icon} />
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

                  <Link
                    href={`/attacks/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cyber-blue px-4 py-2.5 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90"
                  >
                    Подробнее
                  </Link>
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
              key={item.slug}
              item={item}
              index={idx}
              isExpanded={expandedId === item.slug}
              onToggle={() => toggle(item.slug)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
