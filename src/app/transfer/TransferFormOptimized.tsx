'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';

import { transferSchema, type TransferFormData } from '@/lib/validations';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { listContainer, listItem } from '@/lib/animations';

/**
 * 🔄 FORMULAIRE TRANSFER OPTIMISÉ
 * Avec animation de flèche animée
 */

interface Envelope {
  id: number;
  nom: string;
  solde_actuel: number;
  protegee: 0 | 1;
}

interface TransferFormOptimizedProps {
  envs: Envelope[];
  today: string;
}

export function TransferFormOptimized({ envs, today }: TransferFormOptimizedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      montant: 0,
      source_id: envs[0]?.id || 0,
      destination_id: envs[1]?.id || 0,
      description: '',
      date: today,
    },
  });

  const sourceId = watch('source_id');
  const destinationId = watch('destination_id');
  const montant = watch('montant');

  const sourceEnv = envs.find(e => e.id === Number(sourceId));
  const destEnv = envs.find(e => e.id === Number(destinationId));

  const mutation = useMutation({
    mutationFn: async (data: TransferFormData) => {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du transfert');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast.success('Transfert effectué !', {
        description: 'Le montant a été transféré avec succès',
      });

      reset();
      setTimeout(() => router.push('/dashboard'), 1500);
    },
    onError: (error: Error) => {
      toast.error('Erreur', { description: error.message });
    },
  });

  const onSubmit = (data: TransferFormData) => {
    mutation.mutate(data);
  };

  const envelopeOptions = envs.map(e => ({
    value: e.id,
    label: `${e.nom} (${Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF)`,
  }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listContainer}
      className="mt-4 space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Visualisation du transfert */}
        {sourceEnv && destEnv && montant > 0 && (
          <AnimatedCard delay={0.1} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <ArrowLeftRight size={16} />
              Prévisualisation du transfert
            </h3>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              {/* Source */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white rounded-xl border-2 border-red-200"
              >
                <div className="text-xs text-zinc-600 mb-1">De</div>
                <div className="font-bold text-sm">{sourceEnv.nom}</div>
                <div className="text-xs text-zinc-500 mt-2">Solde actuel</div>
                <div className="text-lg font-semibold">
                  {Math.round(sourceEnv.solde_actuel).toLocaleString('fr-GA')} XAF
                </div>
                <div className="text-xs text-red-600 font-medium mt-1">
                  Après : {Math.round(sourceEnv.solde_actuel - montant).toLocaleString('fr-GA')} XAF
                </div>
              </motion.div>

              {/* Flèche animée */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <ArrowRight size={32} className="text-blue-600" />
                </motion.div>
                <motion.div
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  {montant.toLocaleString('fr-GA')} XAF
                </motion.div>
              </motion.div>

              {/* Destination */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white rounded-xl border-2 border-green-200"
              >
                <div className="text-xs text-zinc-600 mb-1">Vers</div>
                <div className="font-bold text-sm">{destEnv.nom}</div>
                <div className="text-xs text-zinc-500 mt-2">Solde actuel</div>
                <div className="text-lg font-semibold">
                  {Math.round(destEnv.solde_actuel).toLocaleString('fr-GA')} XAF
                </div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  Après : {Math.round(destEnv.solde_actuel + montant).toLocaleString('fr-GA')} XAF
                </div>
              </motion.div>
            </div>

            {/* Vérification solde suffisant */}
            {montant > sourceEnv.solde_actuel && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-sm text-red-700 flex items-center gap-2"
              >
                <span>⚠️</span>
                Attention : Le montant dépasse le solde disponible !
              </motion.div>
            )}
          </AnimatedCard>
        )}

        {/* Montant */}
        <motion.div variants={listItem}>
          <FormInput
            label="Montant à transférer"
            type="number"
            step="100"
            placeholder="10000"
            register={register('montant', { valueAsNumber: true })}
            error={errors.montant?.message}
            hint="Montant en XAF"
            required
          />
        </motion.div>

        {/* Source */}
        <motion.div variants={listItem}>
          <FormSelect
            label="Depuis l'enveloppe"
            register={register('source_id', { valueAsNumber: true })}
            options={envelopeOptions}
            error={errors.source_id?.message}
            required
          />
        </motion.div>

        {/* Destination */}
        <motion.div variants={listItem}>
          <FormSelect
            label="Vers l'enveloppe"
            register={register('destination_id', { valueAsNumber: true })}
            options={envelopeOptions}
            error={errors.destination_id?.message}
            required
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={listItem}>
          <FormTextarea
            label="Description (optionnelle)"
            rows={2}
            placeholder="Raison du transfert..."
            register={register('description')}
            error={errors.description?.message}
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

        {/* Boutons */}
        <motion.div className="flex gap-3 pt-4" variants={listItem}>
          <AnimatedButton
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending || sourceId === destinationId}
          >
            {mutation.isPending ? 'Transfert...' : 'Effectuer le transfert'}
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


