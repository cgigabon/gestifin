'use client';

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { listContainer, listItem } from '@/lib/animations';

/**
 * 📦 VUE DÉTAILLÉE D'UNE ENVELOPPE
 * Avec graphiques et historique animés
 */

interface Envelope {
  id: number;
  nom: string;
  budget_mensuel: number;
  solde_actuel: number;
  pourcentage: number;
  protegee: 0 | 1;
}

interface Transaction {
  id: number;
  type: 'ENTREE' | 'SORTIE' | 'TRANSFERT';
  montant_total: number;
  description: string | null;
  date_transaction: string;
  allocation_montant: number;
}

interface MonthlyData {
  ym: string;
  entrees: number;
  sorties: number;
}

interface EnvelopeDetailClientProps {
  env: Envelope;
  txs: Transaction[];
  sommeDep: number;
  monthly: MonthlyData[];
  page: number;
  pages: number;
}

export function EnvelopeDetailClient({ env, txs, sommeDep, monthly, page, pages }: EnvelopeDetailClientProps) {
  // Calculer le pourcentage utilisé
  const usedPct = env.budget_mensuel > 0
    ? Math.min(100, Math.round(((env.budget_mensuel - Math.max(0, env.solde_actuel)) / env.budget_mensuel) * 100))
    : 0;

  // Préparer les données pour le graphique
  const chartData = monthly.map((m: any) => ({
    month: String(m.ym),
    Entrées: Math.round(Number(m.entrees || 0)),
    Dépenses: Math.round(Number(m.sorties || 0)),
  }));

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête */}
      <motion.div variants={listItem}>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </Link>
      </motion.div>

      {/* Carte principale */}
      <AnimatedCard delay={0.1}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{env.nom}</h1>
          {env.protegee ? (
            <Badge variant="info">🔒 Protégée</Badge>
          ) : (
            <Badge>💼 Flexible</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Budget */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="text-xs text-zinc-600 mb-1">Budget mensuel</div>
            <div className="text-lg font-bold text-blue-700">
              {Math.round(env.budget_mensuel).toLocaleString('fr-GA')} XAF
            </div>
            <div className="text-xs text-zinc-500 mt-1">{env.pourcentage}% du revenu</div>
          </div>

          {/* Solde */}
          <div className={`p-4 rounded-xl ${env.solde_actuel >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-xs text-zinc-600 mb-1">Solde actuel</div>
            <div className={`text-lg font-bold ${env.solde_actuel >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {Math.round(env.solde_actuel).toLocaleString('fr-GA')} XAF
            </div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              {env.solde_actuel >= 0 ? (
                <><TrendingUp size={12} /> Positif</>
              ) : (
                <><TrendingDown size={12} /> Négatif</>
              )}
            </div>
          </div>

          {/* Dépenses */}
          <div className="p-4 bg-orange-50 rounded-xl">
            <div className="text-xs text-zinc-600 mb-1">Dépenses totales</div>
            <div className="text-lg font-bold text-orange-700">
              {sommeDep.toLocaleString('fr-GA')} XAF
            </div>
            <div className="text-xs text-zinc-500 mt-1">Tout le temps</div>
          </div>

          {/* Utilisation */}
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="text-xs text-zinc-600 mb-1">Utilisation</div>
            <div className={`text-lg font-bold ${usedPct >= 90 ? 'text-red-700' : 'text-purple-700'}`}>
              {usedPct}%
            </div>
            <div className="text-xs text-zinc-500 mt-1">Du budget</div>
          </div>
        </div>

        {/* Barre de progression */}
        {env.budget_mensuel > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-zinc-600 mb-2">
              <span>Progression du budget</span>
              <span>{usedPct}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden">
              <motion.div
                className={`h-full ${usedPct >= 90 ? 'bg-red-500' : usedPct >= 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                initial={{ width: '0%' }}
                animate={{ width: `${usedPct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </AnimatedCard>

      {/* Graphique d'évolution */}
      {chartData.length > 0 && (
        <AnimatedCard delay={0.2} enableHover={false}>
          <AnimatedLineChart
            data={chartData}
            dataKeys={[
              { key: 'Entrées', color: '#10b981', name: 'Entrées' },
              { key: 'Dépenses', color: '#ef4444', name: 'Dépenses' },
            ]}
            xAxisKey="month"
            height={300}
            title="📈 Flux des 6 derniers mois"
          />
        </AnimatedCard>
      )}

      {/* Historique des transactions */}
      <AnimatedCard delay={0.3} enableHover={false}>
        <h2 className="text-xl font-bold mb-4">📋 Historique des transactions</h2>

        <div className="space-y-2">
          {txs.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (index * 0.05) }}
              className="p-4 border rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {tx.type === 'ENTREE' && <Badge variant="success">Entrée</Badge>}
                    {tx.type === 'SORTIE' && <Badge variant="destructive">Dépense</Badge>}
                    {tx.type === 'TRANSFERT' && <Badge variant="info">Transfert</Badge>}
                    <span className="text-sm text-zinc-600">
                      {new Date(tx.date_transaction).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-700">{tx.description || 'Sans description'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-600">Total</div>
                  <div className="font-bold">
                    {Math.round(tx.montant_total).toLocaleString('fr-GA')} XAF
                  </div>
                  {tx.type === 'ENTREE' && (
                    <div className="text-xs text-green-600 mt-1">
                      +{Math.round(tx.allocation_montant).toLocaleString('fr-GA')} XAF reçu
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {txs.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              Aucune transaction pour cette enveloppe.
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex gap-2 justify-center">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/envelopes/${env.id}?page=${p}`}
                prefetch={false}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  p === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-zinc-100'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </AnimatedCard>
    </motion.div>
  );
}


