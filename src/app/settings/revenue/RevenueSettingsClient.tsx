'use client';

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { listContainer } from '@/lib/animations';

interface RevenueSettingsClientProps {
  current: any;
  next: any;
  currentMonths: any[];
  nextMonths: any[];
  ymDefault: string;
  saveAction: (formData: FormData) => Promise<void>;
}

export function RevenueSettingsClient({
  current,
  next,
  currentMonths,
  nextMonths,
  ymDefault,
  saveAction,
}: RevenueSettingsClientProps) {
  // Préparer données pour graphique
  const chartData = currentMonths?.map((m: any) => ({
    month: String(m.mois).slice(0, 7),
    montant: Number(m.montant || 0),
  })) || [];

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* Graphique */}
      {chartData.length > 0 && (
        <AnimatedCard delay={0.1} enableHover={false}>
          <AnimatedLineChart
            data={chartData}
            dataKeys={[{ key: 'montant', color: '#10b981', name: 'Revenus' }]}
            xAxisKey="month"
            height={300}
            title="📈 Évolution des revenus historiques"
          />
        </AnimatedCard>
      )}

      {/* Config actuelle */}
      <AnimatedCard delay={0.2}>
        <h2 className="text-xl font-bold mb-4">💰 Configuration actuelle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Moyenne revenus</div>
            <div className="text-2xl font-bold text-blue-700">
              {current?.avg_income?.toLocaleString('fr-GA') ?? '—'} XAF
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Fenêtre d'analyse</div>
            <div className="text-2xl font-bold text-green-700">
              {current?.months_window ?? '—'} mois
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">En vigueur depuis</div>
            <div className="text-xl font-bold text-purple-700">
              {current?.effective_from || '—'}
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-xl">
            <div className="text-sm text-zinc-600 mb-1">Note</div>
            <div className="text-sm text-orange-700">
              {current?.note ?? '—'}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Prochaine config */}
      {next && (
        <AnimatedCard delay={0.3}>
          <h2 className="text-xl font-bold mb-4">🔮 Prochaine configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Moyenne revenus</Label>
              <div className="mt-1 text-lg font-medium">{next.avg_income?.toLocaleString('fr-GA') ?? '—'} XAF</div>
            </div>
            <div>
              <Label>Fenêtre</Label>
              <div className="mt-1 text-lg font-medium">{next.months_window ?? '—'} mois</div>
            </div>
            <div>
              <Label>Date d'effet</Label>
              <div className="mt-1 text-lg font-medium">{next.effective_from || '—'}</div>
            </div>
            <div>
              <Label>Note</Label>
              <div className="mt-1 text-sm">{next.note ?? '—'}</div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Nouvelle baseline */}
      <AnimatedCard delay={0.4}>
        <h2 className="text-xl font-bold mb-4">➕ Définir une nouvelle baseline</h2>
        <form action={saveAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="monthsWindow">Période (1-12 mois)</Label>
              <Input id="monthsWindow" name="monthsWindow" type="number" min={1} max={12} defaultValue={3} />
            </div>
            <div>
              <Label htmlFor="effectiveFrom">Appliquer à partir du</Label>
              <Input id="effectiveFrom" name="effectiveFrom" type="date" defaultValue={ymDefault} />
            </div>
            <div>
              <Label htmlFor="avgIncome">Moyenne directe (opt.)</Label>
              <Input id="avgIncome" name="avgIncome" type="number" step="0.01" placeholder="250000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i}>
                <Label htmlFor={`m${i}`}>Mois {i}</Label>
                <Input id={`m${i}`} name={`m${i}`} type="month" />
                <Input className="mt-2" id={`v${i}`} name={`v${i}`} type="number" step="0.01" placeholder="montant" />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="note">Note</Label>
            <Input id="note" name="note" type="text" placeholder="ex: d'après 3 derniers mois" />
          </div>

          <Button type="submit">Enregistrer la baseline</Button>
        </form>
      </AnimatedCard>
    </motion.div>
  );
}

