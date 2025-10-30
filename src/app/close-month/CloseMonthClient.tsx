'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedBarChart } from '@/components/charts/AnimatedBarChart';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { listContainer } from '@/lib/animations';

type Env = { id: number; nom: string; solde_actuel: number; budget_mensuel: number; pourcentage: number; protegee: 0 | 1 };

interface CloseMonthClientProps {
  envs: Env[];
  ymDefault: string;
  action: (formData: FormData) => Promise<void>;
}

export function CloseMonthClient({ envs, ymDefault, action }: CloseMonthClientProps) {
  const [mode, setMode] = useState<'carry' | 'sweep'>('carry');
  const [sweepTo, setSweepTo] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Afficher confirmation
    setShowConfirm(true);
  };

  const confirmClose = async () => {
    setPending(true);
    try {
      const form = document.getElementById('close-form') as HTMLFormElement;
      const formData = new FormData(form);
      await action(formData);
      toast.success('Mois clôturé avec succès !', {
        description: 'Les soldes ont été mis à jour',
      });
      setShowConfirm(false);
    } catch (error) {
      toast.error('Erreur lors de la clôture');
    } finally {
      setPending(false);
    }
  };

  // Données pour graphique
  const chartData = envs.map(e => ({
    name: e.nom,
    value: Math.round(e.solde_actuel),
  }));

  const totalSoldes = envs.reduce((sum, e) => sum + e.solde_actuel, 0);
  const flexibles = envs.filter(e => !e.protegee);
  const protegees = envs.filter(e => e.protegee);

  return (
    <motion.div
      className="max-w-5xl mx-auto grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <h1 className="text-2xl font-bold mb-2">🔒 Clôture mensuelle</h1>
        <p className="text-sm text-zinc-600">
          Finalise le mois en cours : rollover des soldes et ajustements budgétaires.
        </p>
      </AnimatedCard>

      {/* Graphique soldes */}
      <AnimatedCard delay={0.2} enableHover={false}>
        <AnimatedBarChart
          data={chartData}
          dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Solde actuel' }]}
          xAxisKey="name"
          height={300}
          title="📊 Soldes actuels par enveloppe"
        />
      </AnimatedCard>

      {/* Stats */}
      <AnimatedCard delay={0.3} enableHover={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Total soldes</div>
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(totalSoldes).toLocaleString('fr-GA')} XAF
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Enveloppes protégées</div>
            <div className="text-2xl font-bold text-green-700">{protegees.length}</div>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Enveloppes flexibles</div>
            <div className="text-2xl font-bold text-orange-700">{flexibles.length}</div>
          </div>
        </div>
      </AnimatedCard>

      {/* Formulaire */}
      <AnimatedCard delay={0.4}>
        <form id="close-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Mois */}
          <div>
            <Label htmlFor="ym">Mois à clôturer</Label>
            <Input id="ym" name="ym" type="month" defaultValue={ymDefault} required />
          </div>

          {/* Mode rollover */}
          <div className="p-4 border-2 rounded-xl">
            <h3 className="font-semibold mb-3">Mode de rollover</h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="carry"
                  checked={mode === 'carry'}
                  onChange={() => setMode('carry')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Porter les soldes actuels</div>
                  <div className="text-sm text-zinc-600">Aucun transfert, les soldes restent intacts</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
                <input
                  type="radio"
                  name="mode"
                  value="sweep"
                  checked={mode === 'sweep'}
                  onChange={() => setMode('sweep')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">Ramasser les surplus</div>
                  <div className="text-sm text-zinc-600 mb-2">
                    Transfert des excédents des enveloppes flexibles vers une cible
                  </div>

                  {mode === 'sweep' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <Label>Enveloppe cible</Label>
                      <select
                        name="sweepTo"
                        value={sweepTo}
                        onChange={e => setSweepTo(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 mt-1"
                        required={mode === 'sweep'}
                      >
                        <option value="">— Choisir —</option>
                        {envs.map(e => (
                          <option key={e.id} value={e.id}>
                            {e.nom} {e.protegee ? '🔒' : ''}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Ajustements (optionnel) */}
          <details className="p-4 border-2 rounded-xl">
            <summary className="font-semibold cursor-pointer">
              ⚙️ Ajuster budgets / pourcentages (optionnel)
            </summary>

            <div className="mt-4 space-y-3">
              {envs.map(e => (
                <div key={e.id} className="p-3 border rounded-xl">
                  <div className="font-medium mb-2">
                    {e.nom} {e.protegee ? '🔒' : ''}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Budget (nouveau)</Label>
                      <Input
                        name={`b_${e.id}`}
                        type="number"
                        step="1"
                        placeholder={String(Math.round(e.budget_mensuel))}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">% (nouveau)</Label>
                      <Input
                        name={`p_${e.id}`}
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder={String(e.pourcentage)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Solde actuel</Label>
                      <div className="text-sm font-medium mt-2">
                        {Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Bouton */}
          <div className="flex gap-3">
            <AnimatedButton type="submit" className="flex-1">
              <CheckCircle size={18} className="mr-2" />
              Clôturer le mois
            </AnimatedButton>

            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" type="button" className="w-full">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </AnimatedCard>

      {/* Modal confirmation */}
      {showConfirm && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-orange-600" size={32} />
              <h2 className="text-xl font-bold">Confirmer la clôture ?</h2>
            </div>

            <p className="text-zinc-600 mb-6">
              Cette action va finaliser le mois et ajuster les soldes.{' '}
              {mode === 'sweep' && <b>Les surplus seront transférés vers l'enveloppe cible.</b>}
            </p>

            <div className="flex gap-3">
              <AnimatedButton onClick={confirmClose} isLoading={pending} disabled={pending} className="flex-1">
                Confirmer
              </AnimatedButton>
              <Button onClick={() => setShowConfirm(false)} variant="outline" className="flex-1" disabled={pending}>
                Annuler
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}


