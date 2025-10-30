'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageTransition } from '@/lib/animations';

/**
 * 🎭 WRAPPER POUR TRANSITIONS DE PAGE
 * Ajoute des animations fluides lors du changement de route
 */

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 📄 WRAPPER POUR SECTIONS DE PAGE
 * Utile pour animer des sections individuelles
 */

interface PageSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function PageSection({ children, delay = 0, className }: PageSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


