'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { AnimatedBarChart } from '@/components/charts/AnimatedBarChart';
import { AnimatedPieChart } from '@/components/charts/AnimatedPieChart';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { listContainer, listItem } from '@/lib/animations';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Download, FileText, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  ym: string;
  revenus: number;
  depenses: number;
  marge: number;
  deltaRev: number;
  deltaDep: number;
  rows: Array<{
    id: number;
    nom: string;
    entrees: number | null;
    sorties: number | null;
  }>;
  recs: string[];
  evolutionData: Array<{
    month: string;
    revenus: number;
    depenses: number;
  }>;
}

interface AnalyticsClientProps {
  data: AnalyticsData;
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(data.ym);

  // Préparer les données pour le graphique de comparaison
  const comparisonData = [{
    name: data.ym,
    Revenus: data.revenus,
    Dépenses: data.depenses,
  }];

  // Préparer les données pour le pie chart (top 6 enveloppes par dépenses)
  const pieData = data.rows
    .filter(r => r.sorties && r.sorties > 0)
    .sort((a, b) => (Number(b.sorties) || 0) - (Number(a.sorties) || 0))
    .slice(0, 6)
    .map(r => ({
      name: r.nom,
      value: Math.round(Number(r.sorties || 0)),
    }));

  const tauxDepense = data.revenus > 0 ? Math.round((data.depenses / data.revenus) * 100) : 0;
  const tauxEpargne = 100 - tauxDepense;

  const handleMonthChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/analytics?ym=${selectedMonth}`);
  };

  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* Filtre de mois amélioré */}
      <AnimatedCard delay={0}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <CardTitle>📅 Filtrer par mois</CardTitle>
        </div>
        <CardDescription className="mb-4">Sélectionnez le mois à analyser</CardDescription>
        <form onSubmit={handleMonthChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="month-select">Mois</Label>
            <Input 
              id="month-select"
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="dark:bg-zinc-800"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="primary" className="w-full">
              Afficher
            </Button>
          </div>
        </form>
      </AnimatedCard>

      {/* KPIs améliorés */}
      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={listContainer}
      >
        {/* Revenus */}
        <AnimatedCard delay={0.1} enableHover className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-200 dark:bg-green-700 rounded-full -mr-12 -mt-12 opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-green-800 dark:text-green-200">💰 Revenus</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <motion.p 
              className="text-3xl font-bold text-green-700 dark:text-green-300"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {data.revenus.toLocaleString('fr-GA')}
            </motion.p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">XAF</p>
            <CardDescription className={`mt-2 font-medium ${data.deltaRev>=0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'}`}>
              {data.deltaRev>=0 ? '▲' : '▼'} {Math.abs(data.deltaRev)}% vs mois précédent
            </CardDescription>
          </div>
        </AnimatedCard>

        {/* Dépenses */}
        <AnimatedCard delay={0.2} enableHover className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-200 dark:bg-red-700 rounded-full -mr-12 -mt-12 opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-red-800 dark:text-red-200">💸 Dépenses</CardTitle>
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <motion.p 
              className="text-3xl font-bold text-red-700 dark:text-red-300"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {data.depenses.toLocaleString('fr-GA')}
            </motion.p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">XAF</p>
            <CardDescription className={`mt-2 font-medium ${data.deltaDep>=0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-300'}`}>
              {data.deltaDep>=0 ? '▲' : '▼'} {Math.abs(data.deltaDep)}% vs mois précédent
            </CardDescription>
          </div>
        </AnimatedCard>

        {/* Marge */}
        <AnimatedCard delay={0.3} enableHover className={`relative overflow-hidden ${data.marge >= 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' : 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'}`}>
          <div className={`absolute top-0 right-0 w-24 h-24 ${data.marge >= 0 ? 'bg-blue-200 dark:bg-blue-700' : 'bg-orange-200 dark:bg-orange-700'} rounded-full -mr-12 -mt-12 opacity-20`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className={`text-sm ${data.marge >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>📊 Marge</CardTitle>
              <Wallet className={`w-5 h-5 ${data.marge >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} />
            </div>
            <motion.p 
              className={`text-3xl font-bold ${data.marge>=0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {data.marge.toLocaleString('fr-GA')}
            </motion.p>
            <p className={`text-sm mt-1 ${data.marge >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>XAF</p>
            <CardDescription className="mt-2 font-medium">
              {data.marge>=0 ? '✅ Excédent' : '⚠️ Déficit'}
            </CardDescription>
          </div>
        </AnimatedCard>

        {/* Taux d'épargne */}
        <AnimatedCard delay={0.4} enableHover className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 dark:bg-purple-700 rounded-full -mr-12 -mt-12 opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-sm text-purple-800 dark:text-purple-200">💎 Taux d'épargne</CardTitle>
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <motion.p 
              className="text-3xl font-bold text-purple-700 dark:text-purple-300"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {tauxEpargne}%
            </motion.p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">de vos revenus</p>
            <CardDescription className="mt-2 font-medium">
              {tauxEpargne >= 20 ? '🎉 Excellent !' : tauxEpargne >= 10 ? '👍 Bien' : '⚠️ À améliorer'}
            </CardDescription>
          </div>
        </AnimatedCard>
      </motion.section>

      {/* Recommandations */}
      {data.recs.length > 0 && (
        <AnimatedCard delay={0.5} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-100 mb-3">💡 Recommandations</CardTitle>
              <motion.ul 
                className="space-y-2"
                variants={listContainer}
              >
                {data.recs.map((r, i) => (
                  <motion.li 
                    key={i} 
                    variants={listItem}
                    className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2"
                  >
                    <span className="text-blue-600 dark:text-blue-400">•</span>
                    <span>{r}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Graphiques */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'évolution */}
        <AnimatedCard delay={0.6} enableHover={false}>
          <AnimatedLineChart
            data={data.evolutionData}
            dataKeys={[
              { key: 'revenus', color: '#10b981', name: 'Revenus' },
              { key: 'depenses', color: '#ef4444', name: 'Dépenses' }
            ]}
            xAxisKey="month"
            height={300}
            title="📈 Évolution 6 derniers mois"
          />
        </AnimatedCard>

        {/* Graphique de comparaison */}
        <AnimatedCard delay={0.7} enableHover={false}>
          <AnimatedBarChart
            data={comparisonData}
            dataKeys={[
              { key: 'Revenus', color: '#10b981', name: 'Revenus' },
              { key: 'Dépenses', color: '#ef4444', name: 'Dépenses' }
            ]}
            xAxisKey="name"
            height={300}
            title="📊 Comparaison Revenus/Dépenses"
          />
        </AnimatedCard>
      </section>

      {/* Répartition par enveloppe */}
      {pieData.length > 0 && (
        <AnimatedCard delay={0.8} enableHover={false}>
          <AnimatedPieChart
            data={pieData}
            height={350}
            title="🥧 Top 6 Enveloppes par Dépenses"
            showPercentage={true}
          />
        </AnimatedCard>
      )}

      {/* Tableau détaillé */}
      <AnimatedCard delay={0.9} enableHover={false}>
        <CardTitle className="mb-4">📋 Détails par enveloppe ({data.ym})</CardTitle>
        <motion.div 
          className="overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <table className="w-full">
            <thead className="border-b border-zinc-200 dark:border-zinc-700">
              <tr className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <th className="pb-3 pr-4">Enveloppe</th>
                <th className="pb-3 pr-4 text-right">Entrées</th>
                <th className="pb-3 pr-4 text-right">Dépenses</th>
                <th className="pb-3 text-right">Solde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.rows.map((r, index)=>{
                const entrees = Math.round(Number(r.entrees || 0));
                const sorties = Math.round(Number(r.sorties || 0));
                const solde = entrees - sorties;
                
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (index * 0.05) }}
                    className="text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">{r.nom}</td>
                    <td className="py-3 pr-4 text-right text-green-700 dark:text-green-400 font-medium">
                      {entrees.toLocaleString('fr-GA')} XAF
                    </td>
                    <td className="py-3 pr-4 text-right text-red-700 dark:text-red-400 font-medium">
                      {sorties.toLocaleString('fr-GA')} XAF
                    </td>
                    <td className={`py-3 text-right font-bold ${solde >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-400'}`}>
                      {solde.toLocaleString('fr-GA')} XAF
                    </td>
                  </motion.tr>
                );
              })}
              {data.rows.length===0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    📭 Aucune donnée pour ce mois.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Actions d'export */}
        <motion.div 
          className="mt-6 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <a href={`/api/export?type=transactions`}>
            <Button variant="default" className="gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </a>
          <a href={`/api/report?ym=${data.ym}`} target="_blank">
            <Button variant="primary" className="gap-2">
              <FileText size={16} />
              Rapport PDF
            </Button>
          </a>
        </motion.div>
      </AnimatedCard>
    </motion.div>
  );
}
