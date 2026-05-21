'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '@/lib/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  'aria-expanded'?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  role,
  'aria-expanded': ariaExpanded,
}: CardProps) {
  return (
    <motion.div
      className={`rounded-xl border border-cyber-card bg-cyber-card/80 backdrop-blur-sm ${className}`}
      initial="rest"
      whileHover={onClick ? 'hover' : undefined}
      whileTap={onClick ? 'tap' : undefined}
      variants={cardHover}
      onClick={onClick}
      role={role}
      aria-expanded={ariaExpanded}
      layout
    >
      {children}
    </motion.div>
  );
}
