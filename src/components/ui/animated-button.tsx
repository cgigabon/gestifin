'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';

/**
 * 🎯 BOUTON ANIMÉ AVEC MICRO-INTERACTIONS
 * Ajoute des effets tactiles et visuels aux boutons
 */

interface AnimatedButtonProps extends ButtonProps {
  /** Active l'effet de vibration au tap */
  enableHaptic?: boolean;
  /** Active l'animation de chargement */
  isLoading?: boolean;
}

export function AnimatedButton({ 
  children, 
  enableHaptic = false, 
  isLoading = false,
  disabled,
  ...props 
}: AnimatedButtonProps) {
  
  return (
    <motion.div
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      <Button 
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </Button>
    </motion.div>
  );
}


