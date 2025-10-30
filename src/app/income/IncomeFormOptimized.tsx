'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { incomeSchema, type IncomeFormData } from '@/lib/validations';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { fadeInUp, listContainer, listItem } from '@/lib/animations';

/**
 * 💰 FORMULAIRE INCOME OPTIMISÉ
 * Avec React Hook Form + Validation Zod + Animations
 */

interface Service {
  id: number;
  nom: string;
}

interface Envelope {
  id: number;
  nom: string;
  pourcentage: number;
}

interface IncomeFormOptimizedProps {
  services: Service[];
  envelopes: Envelope[];
  today: string;
}

export function IncomeFormOptimized({ services, envelopes, today }: IncomeFormOptimizedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPreview, setShowPreview] = useState(false);

  // React Hook Form avec validation Zod
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      montant: 0,
      description: '',
      date: today,
    },
  });

  // Observer le montant pour la prévisualisation
  const montant = watch('montant');

  // Calculer la répartition
  const allocation = envelopes.map(env => ({
    ...env,
    montantAlloue: Math.round((montant * env.pourcentage) / 100),
  }));

  // Mutation avec TanStack Query
  const mutation = useMutation({
    mutationFn: async (data: IncomeFormData) => {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'enregistrement');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalider les caches pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Toast de succès
      toast.success('Revenu enregistré !', {
        description: 'Vos enveloppes ont été mises à jour',
      });

      // Reset du formulaire
      reset();
      setShowPreview(false);

      // Redirection après un court délai
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error('Erreur', {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: IncomeFormData) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listContainer}
      className="mt-4 space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Montant */}
        <motion.div variants={listItem}>
          <FormInput
            label="Montant"
            type="number"
            step="100"
            placeholder="50000"
            register={register('montant', { valueAsNumber: true })}
            error={errors.montant?.message}
            hint="Montant en XAF"
            required
            onFocus={() => setShowPreview(true)}
          />
        </motion.div>

        {/* Service (optionnel) */}
        {services.length > 0 && (
          <motion.div variants={listItem}>
            <FormSelect
              label="Service associé (optionnel)"
              register={register('serviceId', { valueAsNumber: true })}
              options={services.map(s => ({ value: s.id, label: s.nom }))}
              placeholder="Aucun service"
            />
          </motion.div>
        )}

        {/* Description */}
        <motion.div variants={listItem}>
          <FormTextarea
            label="Description (optionnelle)"
            rows={3}
            placeholder="Salaire mensuel, prime, etc."
            register={register('description')}
            error={errors.description?.message}
            hint="Maximum 200 caractères"
          />
        </motion.div>

        {/* Date */}
        <motion.div variants={listItem}>
          <FormInput
            label="Date"
            type="date"
            register={register('date')}
            error={errors.date?.message}
            required
          />
        </motion.div>

        {/* Prévisualisation */}
        {showPreview && montant > 0 && (
          <AnimatedCard delay={0.3} className="bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span>📊</span>
              Prévisualisation de la répartition
            </h3>
            <motion.div 
              className="space-y-2"
              variants={listContainer}
            >
              {allocation.map((env, index) => (
                <motion.div
                  key={env.id}
                  variants={listItem}
                  className="flex justify-between items-center p-2 bg-white rounded-lg text-sm"
                >
                  <div>
                    <div className="font-medium">{env.nom}</div>
                    <div className="text-xs text-zinc-600">{env.pourcentage}%</div>
                  </div>
                  <motion.div
                    className="text-lg font-bold text-green-600"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + (index * 0.05) }}
                  >
                    {env.montantAlloue.toLocaleString('fr-GA')} XAF
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedCard>
        )}

        {/* Boutons */}
        <motion.div 
          className="flex gap-3 pt-4"
          variants={listItem}
        >
          <AnimatedButton
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer le revenu'}
          </AnimatedButton>

          <AnimatedButton
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={mutation.isPending}
          >
            Annuler
          </AnimatedButton>
        </motion.div>
      </form>
    </motion.div>
  );
}


