'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedPieChart } from '@/components/charts/AnimatedPieChart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { fadeInUp, listItem } from '@/lib/animations';
import { useRouter } from 'next/navigation';

/**
 * 🎯 ONBOARDING AMÉLIORÉ
 * Avec animations et progression visuelle
 */

type UIEnvelope = {
  nom: string;
  budgetMensuel: number;
  protegee: boolean;
  pourcentage: number;
  soldeInitial: number;
};

interface OnboardingClientProps {
  avgInit?: number;
  initialEnvs?: UIEnvelope[];
  save: (payload: any) => Promise<{ ok: boolean }>;
}

export function OnboardingClient({
  avgInit = 0,
  initialEnvs = [],
  save,
}: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [months, setMonths] = React.useState(3);
  const [revenus, setRevenus] = React.useState<number[]>(
    Array.from({ length: months }, () => 0)
  );
  const [revMonths, setRevMonths] = React.useState<string[]>(
    Array.from({ length: months }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    })
  );

  const avgRevenue = React.useMemo(() => {
    const n = revenus.length || 1;
    const s = revenus.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
    return Math.round(s / n);
  }, [revenus]);

  const [envelopes, setEnvelopes] = React.useState<UIEnvelope[]>(
    initialEnvs.length
      ? initialEnvs
      : [
          { nom: 'Logement', budgetMensuel: 150000, protegee: true, pourcentage: 0, soldeInitial: 0 },
          { nom: 'Alimentation', budgetMensuel: 120000, protegee: false, pourcentage: 0, soldeInitial: 0 },
          { nom: 'Transport', budgetMensuel: 75000, protegee: false, pourcentage: 0, soldeInitial: 0 },
          { nom: 'Épargne', budgetMensuel: 100000, protegee: true, pourcentage: 0, soldeInitial: 0 },
        ]
  );

  function suggestPercents() {
    const budgets = envelopes.map(e => e.budgetMensuel);
    const sum = budgets.reduce((a, b) => a + b, 0) || 1;
    const base = budgets.map(b =>
      Math.max(0, Math.min(100, (b / Math.max(1, avgRevenue || sum)) * 100))
    );

    const total = base.reduce((a, b) => a + b, 0) || 1;
    const norm = base.map(x => Math.round((x / total) * 1000) / 10);
    const delta = 100 - norm.reduce((a, b) => a + b, 0);
    if (Math.abs(delta) > 0) norm[0] = Math.round((norm[0] + delta) * 10) / 10;

    setEnvelopes(prev => prev.map((e, i) => ({ ...e, pourcentage: norm[i] || 0 })));
  }

  const [pending, setPending] = React.useState(false);

  const onFinish = async () => {
    setPending(true);
    try {
      const revenusHistory = revenus.map((m, i) => ({ ym: revMonths[i], montant: m }));
      const payload = {
        revenues: revenusHistory,
        envelopes: envelopes.map(e => ({
          nom: e.nom.trim(),
          budgetMensuel: +e.budgetMensuel || 0,
          pourcentage: +e.pourcentage || 0,
          protegee: !!e.protegee,
          soldeInitial: +e.soldeInitial || 0,
        })),
      };

      const res = await save(payload);
      if (res?.ok) {
        toast.success('Configuration enregistrée !', {
          description: 'Vous pouvez maintenant utiliser GestiFin',
        });
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } finally {
      setPending(false);
    }
  };

  // Données pour pie chart
  const pieData = envelopes.map(e => ({
    name: e.nom,
    value: e.budgetMensuel,
  }));

  const progress = (step / 3) * 100;

  return (
    <div className="max-w-4xl mx-auto grid gap-6">
      {/* Barre de progression */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-zinc-600 mb-2">
            <span>Configuration initiale</span>
            <span>Étape {step}/3</span>
          </div>

          {/* Barre de progression */}
          <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

        {/* Steps */}
          <div className="mt-4 flex justify-between">
            {[
              { num: 1, label: 'Revenus' },
              { num: 2, label: 'Enveloppes' },
              { num: 3, label: 'Finalisation' },
            ].map(({ num, label }) => (
              <div
                key={num}
                className={`flex items-center gap-2 ${
                  step === num ? 'text-blue-600 font-semibold' : step > num ? 'text-green-600' : 'text-zinc-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === num
                      ? 'bg-blue-600 text-white'
                      : step > num
                      ? 'bg-green-600 text-white'
                      : 'bg-zinc-200'
                  }`}
                >
                  {step > num ? <Check size={18} /> : num}
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedCard>

      {/* Contenu selon l'étape */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...fadeInUp}>
            <AnimatedCard delay={0.2}>
              <h2 className="text-xl font-bold mb-2">💰 Revenus des derniers mois</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Entrez vos revenus mensuels pour calculer une moyenne.
              </p>

              <div className="space-y-4">
            <div>
              <Label>Sur combien de mois ?</Label>
                  <select
                    className="w-full border rounded-xl h-10 px-3 mt-1"
                    value={months}
                    onChange={e => {
                      const m = Number(e.target.value);
                      setMonths(m);
                      setRevenus(Array.from({ length: m }, () => 0));
                      setRevMonths(
                        Array.from({ length: m }, (_, i) => {
                          const d = new Date();
                          d.setMonth(d.getMonth() - i);
                          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        })
                      );
                    }}
                  >
                    {[1, 3, 6, 12].map(m => (
                      <option key={m} value={m}>
                        {m} mois
                      </option>
                    ))}
              </select>
                </div>

                <div className="grid gap-3">
                  {revenus.map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <Input
                        type="month"
                        value={revMonths[i]}
                        onChange={e => {
                          const a = [...revMonths];
                          a[i] = e.target.value;
                          setRevMonths(a);
                        }}
                      />
                      <Input
                        type="number"
                        value={v}
                        onChange={e => {
                          const a = [...revenus];
                          a[i] = Number(e.target.value || 0);
                          setRevenus(a);
                        }}
                        placeholder="Montant (XAF)"
                      />
                    </motion.div>
              ))}
            </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm text-zinc-600 mb-1">Revenu moyen estimé</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {avgRevenue.toLocaleString('fr-GA')} XAF
                  </div>
                </div>

                <AnimatedButton onClick={() => setStep(2)} className="w-full">
                  Suivant
                  <ChevronRight size={18} className="ml-2" />
                </AnimatedButton>
          </div>
            </AnimatedCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" {...fadeInUp}>
            <AnimatedCard delay={0.2}>
              <h2 className="text-xl font-bold mb-2">💼 Enveloppes budgétaires</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Définissez vos enveloppes et leurs budgets mensuels.
              </p>

              <div className="space-y-4">
                {envelopes.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 border-2 rounded-xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={e.nom}
                          onChange={ev => {
                            const a = [...envelopes];
                            a[i].nom = ev.target.value;
                            setEnvelopes(a);
                          }}
                        />
                      </div>

                      <div>
                        <Label>Budget mensuel (XAF)</Label>
                        <Input
                          type="number"
                          value={e.budgetMensuel}
                          onChange={ev => {
                            const a = [...envelopes];
                            a[i].budgetMensuel = Number(ev.target.value || 0);
                            setEnvelopes(a);
                          }}
                        />
                      </div>

                      <div className="flex items-end gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={e.protegee}
                            onChange={ev => {
                              const a = [...envelopes];
                              a[i].protegee = ev.target.checked;
                              setEnvelopes(a);
                            }}
                          />
                          <span className="text-sm">🔒 Protégée</span>
                        </label>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setEnvelopes(envelopes.filter((_, k) => k !== i))}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setEnvelopes([
                      ...envelopes,
                      {
                        nom: 'Nouvelle enveloppe',
                        budgetMensuel: 0,
                        protegee: false,
                        pourcentage: 0,
                        soldeInitial: 0,
                      },
                    ])
                  }
                >
                  + Ajouter une enveloppe
                </Button>

                {/* Pie Chart */}
                {envelopes.length > 0 && (
                  <AnimatedPieChart
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    title="📊 Répartition des budgets"
                    height={300}
                  />
                )}

                <div className="flex gap-3">
                  <AnimatedButton variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ChevronLeft size={18} className="mr-2" />
                    Retour
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => {
                      suggestPercents();
                      setStep(3);
                    }}
                    className="flex-1"
                  >
                    Suivant (suggérer %)
                    <ChevronRight size={18} className="ml-2" />
                  </AnimatedButton>
            </div>
          </div>
            </AnimatedCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" {...fadeInUp}>
            <AnimatedCard delay={0.2}>
              <h2 className="text-xl font-bold mb-2">✅ Finalisation</h2>
              <p className="text-sm text-zinc-600 mb-4">
                Ajustez les pourcentages et soldes initiaux, puis terminez.
              </p>

              <div className="space-y-4">
                {envelopes.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 border-2 rounded-xl"
                  >
                    <div className="font-semibold mb-3">{e.nom}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>% du revenu</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={e.pourcentage}
                          onChange={ev => {
                            const a = [...envelopes];
                            a[i].pourcentage = Number(ev.target.value || 0);
                            setEnvelopes(a);
                          }}
                        />
                      </div>

                      <div>
                        <Label>Solde initial (XAF)</Label>
                        <Input
                          type="number"
                          value={e.soldeInitial}
                          onChange={ev => {
                            const a = [...envelopes];
                            a[i].soldeInitial = Number(ev.target.value || 0);
                            setEnvelopes(a);
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="text-sm text-zinc-600 mb-1">Total des pourcentages</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {envelopes.reduce((sum, e) => sum + e.pourcentage, 0).toFixed(1)} %
                  </div>
                </div>

                <div className="flex gap-3">
                  <AnimatedButton variant="outline" onClick={() => setStep(2)} className="flex-1">
                    <ChevronLeft size={18} className="mr-2" />
                    Retour
                  </AnimatedButton>
                  <AnimatedButton onClick={suggestPercents} variant="default" className="flex-1">
                    Normaliser à 100%
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={onFinish}
                    isLoading={pending}
                    disabled={pending}
                    className="flex-1"
                  >
                    {pending ? 'Enregistrement...' : 'Terminer'}
                  </AnimatedButton>
            </div>
          </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
