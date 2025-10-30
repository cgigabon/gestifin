'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';
import { successToast, errorToast, warningToast, celebrationToast, CELEBRATION_ACTIONS } from '@/lib/toast-utils';

import { expenseSchema, type ExpenseFormData } from '@/lib/validations';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedPieChart } from '@/components/charts/AnimatedPieChart';
import { Button } from '@/components/ui/button';
import { listContainer, listItem } from '@/lib/animations';

/**
 * 💸 FORMULAIRE EXPENSE OPTIMISÉ
 * Avec allocateur visuel animé
 */

interface Envelope {
  id: number;
  nom: string;
  solde_actuel: number;
  protegee: 0 | 1;
}

interface ExpenseFormOptimizedProps {
  envs: Envelope[];
  today: string;
}

export function ExpenseFormOptimized({ envs, today }: ExpenseFormOptimizedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [allocations, setAllocations] = useState<Array<{ enveloppe_id: number; montant: number }>>([
    { enveloppe_id: envs[0]?.id || 0, montant: 0 }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Omit<ExpenseFormData, 'allocations'> & { montant: number }>({
    resolver: zodResolver(expenseSchema.omit({ allocations: true })),
    defaultValues: {
      montant: 0,
      description: '',
      date: today,
    },
  });

  const montantTotal = watch('montant');

  // Mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          allocations,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'enregistrement');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['envelopes'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      celebrationToast(CELEBRATION_ACTIONS.FIRST_EXPENSE);

      reset();
      setAllocations([{ enveloppe_id: envs[0]?.id || 0, montant: 0 }]);

      setTimeout(() => router.push('/dashboard'), 1500);
    },
    onError: (error: Error) => {
      errorToast(error.message || 'Erreur lors de l\'enregistrement de la dépense');
    },
  });

  const onSubmit = async (data: any) => {
    // Vérifier que les allocations sont valides
    const total = allocations.reduce((sum, a) => sum + a.montant, 0);
    
    if (total === 0) {
      errorToast('Veuillez allouer au moins 1 XAF à une enveloppe');
      return;
    }

    if (total !== montantTotal) {
      warningToast(`Total alloué (${total.toLocaleString()} XAF) ≠ Montant saisi (${montantTotal.toLocaleString()} XAF)`);
    }

    mutation.mutate(data);
  };

  const addAllocation = () => {
    const nextEnv = envs.find(e => !allocations.find(a => a.enveloppe_id === e.id));
    if (nextEnv) {
      setAllocations([...allocations, { enveloppe_id: nextEnv.id, montant: 0 }]);
    }
  };

  const removeAllocation = (index: number) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter((_, i) => i !== index));
    }
  };

  const updateAllocation = (index: number, montant: number) => {
    const newAllocations = [...allocations];
    newAllocations[index].montant = montant;
    setAllocations(newAllocations);
  };

  const updateEnvelope = (index: number, enveloppe_id: number) => {
    const newAllocations = [...allocations];
    newAllocations[index].enveloppe_id = enveloppe_id;
    setAllocations(newAllocations);
  };

  // Distribution automatique
  const distributeEvenly = () => {
    if (montantTotal > 0 && allocations.length > 0) {
      const perEnv = Math.floor(montantTotal / allocations.length);
      const remainder = montantTotal % allocations.length;
      
      setAllocations(allocations.map((a, i) => ({
        ...a,
        montant: perEnv + (i === 0 ? remainder : 0),
      })));
      
      successToast('✅ Montant réparti équitablement entre les enveloppes');
    }
  };

  // Données pour le pie chart
  const pieData = allocations
    .filter(a => a.montant > 0)
    .map(a => {
      const env = envs.find(e => e.id === a.enveloppe_id);
      return {
        name: env?.nom || 'Inconnu',
        value: a.montant,
      };
    });

  const totalAlloue = allocations.reduce((sum, a) => sum + a.montant, 0);
  const reste = montantTotal - totalAlloue;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listContainer}
      className="mt-4 space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Montant total */}
        <motion.div variants={listItem}>
          <FormInput
            label="Montant total de la dépense"
            type="number"
            step="100"
            placeholder="25000"
            register={register('montant', { valueAsNumber: true })}
            error={errors.montant?.message}
            hint="Montant total en XAF"
            required
          />
        </motion.div>

        {/* Allocateur visuel */}
        {montantTotal > 0 && (
          <AnimatedCard delay={0.2} className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span>🎯</span>
                Allocateur de dépenses
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={distributeEvenly}
                  disabled={allocations.length === 0}
                >
                  Répartir équitablement
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={addAllocation}
                  disabled={allocations.length >= envs.length}
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {allocations.map((alloc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="mb-3 p-4 bg-white rounded-xl border shadow-sm"
                >
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      {/* Sélection enveloppe */}
                      <div>
                        <label className="text-xs font-medium text-zinc-600 mb-1 block">
                          Enveloppe
                        </label>
                        <select
                          value={alloc.enveloppe_id}
                          onChange={(e) => updateEnvelope(index, Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          {envs.map(env => (
                            <option key={env.id} value={env.id}>
                              {env.nom} ({Math.round(env.solde_actuel).toLocaleString()} XAF)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Montant */}
                      <div>
                        <label className="text-xs font-medium text-zinc-600 mb-1 block">
                          Montant
                        </label>
                        <input
                          type="number"
                          value={alloc.montant}
                          onChange={(e) => updateAllocation(index, Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                          min="0"
                          step="100"
                        />
                      </div>
                    </div>

                    {/* Bouton supprimer */}
                    {allocations.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removeAllocation(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-3">
                    <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: '0%' }}
                        animate={{
                          width: montantTotal > 0
                            ? `${Math.min(100, (alloc.montant / montantTotal) * 100)}%`
                            : '0%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {montantTotal > 0
                        ? `${Math.round((alloc.montant / montantTotal) * 100)}% du total`
                        : '0%'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Résumé */}
            <div className="mt-4 p-3 bg-white rounded-xl border-2 border-dashed">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Total alloué :</span>
                <span className={`font-bold ${totalAlloue === montantTotal ? 'text-green-600' : 'text-orange-600'}`}>
                  {totalAlloue.toLocaleString('fr-GA')} XAF
                </span>
              </div>
              {reste !== 0 && (
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-zinc-600">Reste à allouer :</span>
                  <span className={`font-bold ${reste > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {reste.toLocaleString('fr-GA')} XAF
                  </span>
                </div>
              )}
            </div>
          </AnimatedCard>
        )}

        {/* Graphique de répartition */}
        {pieData.length > 0 && totalAlloue > 0 && (
          <AnimatedCard delay={0.3} enableHover={false}>
            <AnimatedPieChart
              data={pieData}
              height={300}
              title="📊 Répartition de la dépense"
              showPercentage={true}
            />
          </AnimatedCard>
        )}

        {/* Description */}
        <motion.div variants={listItem}>
          <FormTextarea
            label="Description (optionnelle)"
            rows={2}
            placeholder="Courses, restaurant, etc."
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
            disabled={mutation.isPending || totalAlloue === 0}
          >
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer la dépense'}
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

