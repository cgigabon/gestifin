import { Variants } from 'framer-motion';

/**
 * 🎨 ANIMATIONS RÉUTILISABLES - FRAMER MOTION
 */

// ─────────────────────────────────────────────────────────
// FADE IN UP
// ─────────────────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────
// SCALE IN
// ─────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────
// LIST CONTAINER (stagger children)
// ─────────────────────────────────────────────────────────
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ─────────────────────────────────────────────────────────
// LIST ITEM
// ─────────────────────────────────────────────────────────
export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────
export const progressBar: Variants = {
  hidden: { width: 0 },
  visible: { width: '100%', transition: { duration: 1, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────────────────
// CARD HOVER
// ─────────────────────────────────────────────────────────
export const cardHover = {
  whileHover: { scale: 1.02, y: -4 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// ─────────────────────────────────────────────────────────
// BUTTON TAP
// ─────────────────────────────────────────────────────────
export const buttonTap = {
  whileTap: { scale: 0.95 },
};

// ─────────────────────────────────────────────────────────
// PAGE TRANSITION
// ─────────────────────────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

// ─────────────────────────────────────────────────────────
// COUNT UP (compteur animé)
// ─────────────────────────────────────────────────────────
export const countUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: 'easeOut' } },
});
