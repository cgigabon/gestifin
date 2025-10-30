'use client';

import * as React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Card } from './card';
import { scaleIn, cardHover } from '@/lib/animations';

/**
 * 💳 CARTE ANIMÉE AVEC EFFETS HOVER
 * Composant réutilisable pour toutes les cartes financières
 */

interface AnimatedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  /** Délai d'apparition (en secondes) */
  delay?: number;
  /** Active l'effet hover (lift & scale) */
  enableHover?: boolean;
  /** Active l'animation d'entrée */
  enableEntrance?: boolean;
  /** Type d'animation d'entrée */
  variant?: 'scale' | 'slideUp' | 'slideLeft';
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  enableHover = true,
  enableEntrance = true,
  variant = 'scale',
  className,
  ...props 
}: AnimatedCardProps) {
  
  const variants = variant === 'scale' ? scaleIn : {
    hidden: { opacity: 0, y: variant === 'slideUp' ? 20 : 0, x: variant === 'slideLeft' ? -20 : 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
    }
  };

  const motionProps = enableEntrance ? {
    initial: 'hidden' as const,
    animate: 'visible' as const,
    variants,
    transition: { delay, duration: 0.4 }
  } : {};

  const hoverProps = enableHover ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
  } : {};

  return (
    <motion.div
      {...motionProps}
      {...hoverProps}
    >
      <Card className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
}

/**
 * 📊 CARTE KPI ANIMÉE (pour les métriques financières)
 */
interface KPICardProps extends AnimatedCardProps {
  /** Valeur numérique à animer */
  value: number;
  /** Active l'animation de compteur */
  animateValue?: boolean;
}

export function AnimatedKPICard({ 
  value, 
  animateValue = true, 
  children, 
  ...props 
}: KPICardProps) {
  const [displayValue, setDisplayValue] = React.useState(animateValue ? 0 : value);

  React.useEffect(() => {
    if (!animateValue) return;
    
    const duration = 1000; // 1 seconde
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animateValue]);

  return (
    <AnimatedCard {...props}>
      {children}
    </AnimatedCard>
  );
}

