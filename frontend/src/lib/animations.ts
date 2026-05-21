import { Variants, Transition } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0 rgba(0, 212, 255, 0)',
    transition: { duration: 0.25, ease: 'easeOut' } as Transition,
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 32px rgba(0, 212, 255, 0.12)',
    transition: { duration: 0.25, ease: 'easeOut' } as Transition,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 } as Transition,
  },
};

export const expandCard: Variants = {
  collapsed: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
  expanded: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};
