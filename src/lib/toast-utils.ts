/**
 * 🎉 SYSTÈME DE TOASTS & CONFETTIS AMÉLIORÉ
 * Notifications visuelles et célébrations pour les actions importantes
 */

import { toast as hotToast } from 'react-hot-toast';

/**
 * Lance des confettis dynamiques
 */
export function launchConfetti() {
  if (typeof window === 'undefined') return;
  
  import('canvas-confetti').then((confetti) => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
    };

    function shoot() {
      confetti.default({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'],
        colors: ['#10b981', '#3b82f6', '#f97316'],
      });

      confetti.default({
        ...defaults,
        particleCount: 30,
        scalar: 0.75,
        shapes: ['circle'],
        colors: ['#10b981', '#3b82f6', '#f97316'],
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  });
}

/**
 * Toast de succès avec confettis
 */
export function successToast(message: string, withConfetti: boolean = false) {
  hotToast.success(message, {
    duration: 4000,
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });

  if (withConfetti) {
    setTimeout(launchConfetti, 200);
  }
}

/**
 * Toast d'erreur
 */
export function errorToast(message: string) {
  hotToast.error(message, {
    duration: 5000,
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
}

/**
 * Toast d'avertissement
 */
export function warningToast(message: string) {
  hotToast(message, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: '#f97316',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3)',
    },
  });
}

/**
 * Toast d'information
 */
export function infoToast(message: string) {
  hotToast(message, {
    duration: 3000,
    icon: '💡',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
  });
}

/**
 * Toast de chargement
 */
export function loadingToast(message: string) {
  return hotToast.loading(message, {
    style: {
      background: '#6b7280',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '12px',
    },
  });
}

/**
 * Toast personnalisé de célébration
 */
export function celebrationToast(message: string) {
  successToast(`🎉 ${message}`, true);
}

/**
 * Actions importantes qui méritent des confettis
 */
export const CELEBRATION_ACTIONS = {
  FIRST_INCOME: 'Première entrée enregistrée ! 🎊',
  FIRST_EXPENSE: 'Première dépense suivie ! 📊',
  FIRST_TRANSFER: 'Premier transfert effectué ! 🔄',
  MONTH_CLOSED: 'Mois clôturé avec succès ! 🎯',
  BUDGET_CREATED: 'Budget configuré ! 💼',
  ACCOUNT_CREATED: 'Bienvenue sur GestiFin ! 🚀',
  LOGIN_SUCCESS: 'Connexion réussie ! ✨',
  ENVELOPE_CREATED: 'Nouvelle enveloppe créée ! 💰',
  GOAL_ACHIEVED: 'Objectif atteint ! 🏆',
} as const;


