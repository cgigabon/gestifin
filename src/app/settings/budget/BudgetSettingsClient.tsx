'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedPieChart } from '@/components/charts/AnimatedPieChart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { listContainer } from '@/lib/animations';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { warningToast, successToast, celebrationToast, CELEBRATION_ACTIONS } from '@/lib/toast-utils';

type Env = { id: number; nom: string; budget_mensuel: number; pourcentage: number; protegee: 0 | 1; solde_initial: number };

interface BudgetSettingsClientProps {
  envs: Env[];
  saveAction: (formData: FormData) => Promise<void>;
  applyPercentsAction: (formData: FormData) => Promise<void>;
  addEnvelopeAction: (formData: FormData) => Promise<void>;
  archiveAction: (formData: FormData) => Promise<void>;
  deleteHardAction: (formData: FormData) => Promise<void>;
}

export function BudgetSettingsClient({
  envs,
  saveAction,
  applyPercentsAction,
  addEnvelopeAction,
  archiveAction,
  deleteHardAction,
}: BudgetSettingsClientProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  const pieData = envs.map(e => ({
    name: e.nom,
    value: e.budget_mensuel,
  }));

  const totalPercent = envs.reduce((sum, e) => sum + e.pourcentage, 0);

  const handleSave = async (formData: FormData) => {
    await saveAction(formData);
    successToast('✅ Modifications enregistrées');
  };

  const handleApplyPercents = async (formData: FormData) => {
    await applyPercentsAction(formData);
    successToast('✅ Pourcentages appliqués');
  };

  const handleAddEnvelope = async (formData: FormData) => {
    await addEnvelopeAction(formData);
    celebrationToast(CELEBRATION_ACTIONS.ENVELOPE_CREATED);
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      warningToast('⚠️ Cliquez à nouveau pour confirmer la suppression');
      setTimeout(() => setDeleteConfirm(null), 3000); // Reset après 3s
      return;
    }

    const formData = new FormData();
    formData.append('id', String(id));
    await deleteHardAction(formData);
    successToast('🗑️ Enveloppe supprimée');
    setDeleteConfirm(null);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={listContainer} className="grid gap-6">
      {/* Graphique */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <AnimatedPieChart
          data={pieData}
          dataKey="value"
          nameKey="name"
          title="📊 Répartition des budgets mensuels"
          height={300}
        />
      </AnimatedCard>

      {/* Tableau */}
      <AnimatedCard delay={0.2}>
        <h2 className="text-xl font-bold mb-4">💼 Gestion des Enveloppes</h2>
        <p className="text-sm text-zinc-600 mb-4">
          Met à jour budgets mensuels, pourcentages et statuts.
        </p>

        <form action={handleSave} className="space-y-4">
          <AnimatePresence>
            {envs.map((e, index) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-2 rounded-xl relative group hover:border-blue-400 transition-colors"
              >
                {/* Header avec nom et bouton de suppression */}
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold flex items-center gap-2">
                    {e.nom}
                    {e.protegee ? <span>🔒</span> : null}
                  </div>
                  
                  {/* Bouton de suppression */}
                  <motion.button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === e.id
                        ? 'bg-red-100 text-red-600'
                        : 'opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {deleteConfirm === e.id ? (
                      <AlertTriangle size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Budget (XAF)</Label>
                    <Input name={`b_${e.id}`} type="number" defaultValue={Math.round(e.budget_mensuel)} />
                  </div>

                  <div>
                    <Label>% du revenu</Label>
                    <Input name={`p_${e.id}`} type="number" step="0.1" defaultValue={e.pourcentage} />
                  </div>

                  <div>
                    <Label>Protégée</Label>
                    <input type="checkbox" name={`prot_${e.id}`} defaultChecked={!!e.protegee} className="mt-3" />
                  </div>

                  <div>
                    <Label>Solde initial</Label>
                    <Input name={`s_${e.id}`} type="number" defaultValue={Math.round(e.solde_initial)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Total des pourcentages */}
          <motion.div
            className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2"
            animate={{
              borderColor: totalPercent === 100 ? '#10b981' : '#f97316',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm text-zinc-600 mb-1">Total des pourcentages</div>
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${totalPercent === 100 ? 'text-green-700' : 'text-orange-700'}`}>
                {totalPercent.toFixed(1)} %
              </div>
              {totalPercent === 100 && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
              )}
              {totalPercent !== 100 && (
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-sm text-orange-600"
                >
                  ⚠️ Doit être égal à 100%
                </motion.span>
              )}
            </div>
          </motion.div>

          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit">Enregistrer les modifications</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" variant="default" formAction={handleApplyPercents}>
                Appliquer les %
              </Button>
            </motion.div>
          </div>
        </form>
      </AnimatedCard>

      {/* Ajouter enveloppe */}
      <AnimatedCard delay={0.3}>
        <h2 className="text-xl font-bold mb-4">➕ Ajouter une enveloppe</h2>
        <form action={handleAddEnvelope} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Ex: Loyer, Transport..." required />
          </div>
          <div>
            <Label htmlFor="budgetMensuel">Budget (XAF)</Label>
            <Input id="budgetMensuel" name="budgetMensuel" type="number" defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="pourcentage">% initial</Label>
            <Input id="pourcentage" name="pourcentage" type="number" step="0.1" defaultValue={0} />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="protegee" /> Protégée
            </label>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit">Ajouter</Button>
            </motion.div>
          </div>
        </form>
      </AnimatedCard>

      {/* Instructions de suppression */}
      <motion.div
        className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <strong>Suppression d'enveloppes :</strong> Survolez une enveloppe et cliquez sur l'icône corbeille.
            Cliquez deux fois pour confirmer la suppression définitive.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
