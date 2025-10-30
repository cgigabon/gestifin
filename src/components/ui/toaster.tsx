'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * 🔔 SYSTÈME DE NOTIFICATIONS TOAST
 * Basé sur Sonner pour des notifications élégantes
 */

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '16px',
          fontSize: '14px',
        },
        className: 'shadow-lg',
        duration: 4000,
      }}
      richColors
    />
  );
}

/**
 * 💡 UTILISATION :
 * 
 * import { toast } from 'sonner';
 * 
 * // Success
 * toast.success('Transaction enregistrée avec succès !');
 * 
 * // Error
 * toast.error('Une erreur est survenue');
 * 
 * // Info
 * toast.info('Votre budget a été mis à jour');
 * 
 * // Warning
 * toast.warning('Attention : Budget bientôt dépassé');
 * 
 * // Custom avec action
 * toast('Budget dépassé', {
 *   description: 'Voulez-vous ajuster votre enveloppe ?',
 *   action: {
 *     label: 'Ajuster',
 *     onClick: () => router.push('/envelopes/1')
 *   }
 * });
 */


