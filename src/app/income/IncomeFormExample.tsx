'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { fadeInUp } from '@/lib/animations';

/**
 * 💡 EXEMPLE D'UTILISATION DES ANIMATIONS + TOAST
 * 
 * Ce composant montre comment intégrer :
 * - Animations de cartes
 * - Boutons animés avec état de chargement
 * - Notifications toast sur succès/erreur
 * - Micro-interactions
 */

export function IncomeFormExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler une requête API
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Votre logique de sauvegarde ici
      // await saveIncome(data);
      
      // Toast de succès avec animation
      toast.success('Revenus enregistrés !', {
        description: 'Vos enveloppes ont été mises à jour',
        duration: 4000,
      });
      
      // Optionnel : Redirection ou reset du formulaire
    } catch (error) {
      // Toast d'erreur
      toast.error('Erreur de sauvegarde', {
        description: 'Impossible d\'enregistrer les revenus',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Exemple de carte animée avec formulaire */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <h2 className="text-xl font-bold mb-4">Enregistrer un revenu</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Montant
            </label>
            <motion.input
              type="number"
              className="w-full px-4 py-2 border rounded-xl"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              placeholder="50000 XAF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <motion.input
              type="text"
              className="w-full px-4 py-2 border rounded-xl"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              placeholder="Salaire mensuel"
            />
          </div>

          {/* Boutons avec animations */}
          <div className="flex gap-2 mt-6">
            <AnimatedButton 
              type="submit" 
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </AnimatedButton>

            <AnimatedButton 
              type="button" 
              variant="outline"
              disabled={isSubmitting}
            >
              Annuler
            </AnimatedButton>
          </div>
        </form>
      </AnimatedCard>

      {/* Exemple de prévisualisation animée */}
      <AnimatedCard delay={0.3} className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Aperçu de l'allocation</h3>
        <div className="space-y-2">
          {[
            { name: 'Logement', percentage: 30, amount: 15000 },
            { name: 'Alimentation', percentage: 25, amount: 12500 },
            { name: 'Transport', percentage: 15, amount: 7500 },
          ].map((env, index) => (
            <motion.div
              key={env.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl"
            >
              <div>
                <div className="font-medium">{env.name}</div>
                <div className="text-sm text-zinc-600">{env.percentage}%</div>
              </div>
              <motion.div
                className="text-lg font-bold text-green-600"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                {env.amount.toLocaleString('fr-GA')} XAF
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>
    </motion.div>
  );
}

/**
 * 💡 UTILISATION DANS UNE PAGE :
 * 
 * import { IncomeFormExample } from './IncomeFormExample';
 * 
 * export default function IncomePage() {
 *   return (
 *     <div className="max-w-2xl mx-auto">
 *       <h1>Ajouter un revenu</h1>
 *       <IncomeFormExample />
 *     </div>
 *   );
 * }
 */


