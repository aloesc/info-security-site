'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Hero() {
  return (
    <section
      aria-label="Главный баннер"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cyber-dark px-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-purple/10 via-transparent to-transparent" />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
          <ShieldAlert className="h-12 w-12 text-cyber-blue sm:h-16 sm:w-16" aria-hidden="true" />
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-2xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          <span className="block text-cyber-blue">Современный взлом —</span>
          <span className="block mt-2">не битва технологий,</span>
          <span className="block mt-2">а искусство обмана.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg md:text-xl"
        >
          Знание методов атаки — первый шаг к защите.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#attacks"
            className="inline-flex items-center justify-center rounded-lg bg-cyber-blue px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-cyber-blue/90 sm:text-base"
          >
            Узнать об атаках
          </a>
          <a
            href="#games"
            className="inline-flex items-center justify-center rounded-lg border border-cyber-blue/30 px-6 py-3 text-sm font-semibold text-cyber-blue transition-colors hover:bg-cyber-blue/10 sm:text-base"
          >
            Играть и учиться
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
