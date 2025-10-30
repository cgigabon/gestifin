'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Shuffle, 
  Bell, 
  TrendingUp, 
  PiggyBank, 
  ExternalLink,
  ArrowRight,
  BarChart3,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { fadeInUp, listContainer, listItem, progressBar, scaleIn } from '@/lib/animations';

type Env = { id:number; nom:string; budget_mensuel:number; pourcentage:number; solde_actuel:number; protegee:0|1 };
type Tx = { id:number; type:'ENTREE'|'SORTIE'|'TRANSFERT'; montant_total:number; description:string|null; date_transaction:string };
type Al = { id:number; type:'CRITIQUE'|'ATTENTION'|'INFO'; titre:string; description:string|null; created_at:string };
type Evolution = { date: Date; revenus: number; depenses: number };

interface DashboardClientProps {
  envs: Env[];
  depByEnv: Record<number, number>;
  txs: Tx[];
  alerts: Al[];
  rev: number;
  dep: number;
  marge: number;
  evolution: Evolution[];
}

function alertVariant(t: Al['type']) {
  if (t === 'CRITIQUE') return 'destructive' as const;
  if (t === 'ATTENTION') return 'warning' as const;
  return 'info' as const;
}

/**
 * 💰 Composant animé pour les montants (effet compteur)
 */
function AnimatedAmount({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {displayValue.toLocaleString('fr-GA')} XAF
    </motion.span>
  );
}

/**
 * 📊 Barre de progression animée AMÉLIORÉE
 */
function AnimatedProgressBar({ percentage }: { percentage: number }) {
  const isOverBudget = percentage >= 90;
  const isWarning = percentage >= 70 && percentage < 90;
  
  return (
    <div className="mt-3 relative">
      <div className="h-3 w-full rounded-full bg-zinc-200 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, percentage)}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className={`h-full relative ${
            isOverBudget 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isWarning
              ? 'bg-gradient-to-r from-orange-500 to-orange-600'
              : 'bg-gradient-to-r from-green-500 to-green-600'
          }`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />
        </motion.div>
      </div>
      <motion.div
        className="text-xs text-zinc-600 mt-1 font-medium text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {percentage.toFixed(1)}% utilisé
      </motion.div>
    </div>
  );
}

export function DashboardClient({ envs, depByEnv, txs, alerts, rev, dep, marge, evolution }: DashboardClientProps) {
  const totalBalance = Math.round(envs.reduce((s,e)=>s + (e.solde_actuel||0),0));

  // Préparer les données d'évolution pour le graphique
  const chartData = useMemo(() => {
    // Créer un tableau des 7 derniers jours
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Trouver les données pour ce jour
      const dayData = evolution.find((e: any) => {
        const evDate = new Date(e.date).toISOString().split('T')[0];
        return evDate === dateStr;
      });
      
      days.push({
        day: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()],
        date: dateStr,
        revenus: dayData ? Math.round(Number(dayData.revenus)) : 0,
        depenses: dayData ? Math.round(Number(dayData.depenses)) : 0,
        solde: totalBalance, // Simplification - utiliser le solde total actuel
      });
    }
    
    // Calculer le solde cumulé
    let cumulativeSolde = totalBalance;
    for (let i = days.length - 1; i >= 0; i--) {
      days[i].solde = cumulativeSolde;
      cumulativeSolde -= (days[i].revenus - days[i].depenses);
    }
    
    return days;
  }, [evolution, totalBalance]);

  return (
    <motion.div 
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* 📊 KPIs AMÉLIORÉS avec icônes animés */}
      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={listContainer}
      >
        {/* Solde Total */}
        <AnimatedCard delay={0} variant="slideUp">
          <div className="relative overflow-hidden">
            {/* Background décoratif */}
            <motion.div
              className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Wallet size={20} className="text-blue-600"/>
                </motion.div>
                Solde total
              </CardTitle>
              <p className="text-3xl font-bold mt-2 text-blue-700">
                <AnimatedAmount value={totalBalance} />
              </p>
              <CardDescription className="mt-1">Somme de toutes les enveloppes</CardDescription>
            </div>
          </div>
        </AnimatedCard>

        {/* Revenus */}
        <AnimatedCard delay={0.1} variant="slideUp">
          <div className="relative overflow-hidden">
            <motion.div
              className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <TrendingUp size={20} className="text-green-600"/>
                </motion.div>
                Revenus (mois)
              </CardTitle>
              <p className="text-3xl font-bold mt-2 text-green-700">
                <AnimatedAmount value={rev} />
              </p>
              <CardDescription className="mt-1">Entrées validées ce mois</CardDescription>
            </div>
          </div>
        </AnimatedCard>

        {/* Dépenses */}
        <AnimatedCard delay={0.2} variant="slideUp">
          <div className="relative overflow-hidden">
            <motion.div
              className="absolute -right-4 -top-4 w-24 h-24 bg-red-100 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <div className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <motion.div
                  animate={{ 
                    y: [0, 5, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.3
                  }}
                >
                  <ArrowDownCircle size={20} className="text-red-600"/>
                </motion.div>
                Dépenses (mois)
              </CardTitle>
              <p className="text-3xl font-bold mt-2 text-red-700">
                <AnimatedAmount value={dep} />
              </p>
              <CardDescription className="mt-1">Sorties validées ce mois</CardDescription>
            </div>
          </div>
        </AnimatedCard>

        {/* Marge */}
        <AnimatedCard delay={0.3} variant="slideUp">
          <div className="relative overflow-hidden">
            <motion.div
              className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 ${
                marge >= 0 ? 'bg-purple-100' : 'bg-orange-100'
              }`}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                >
                  <PiggyBank size={20} className={marge >= 0 ? 'text-purple-600' : 'text-orange-600'}/>
                </motion.div>
                Marge (mois)
              </CardTitle>
              <p className={`text-3xl font-bold mt-2 ${marge>=0?'text-purple-700':'text-orange-700'}`}>
                <AnimatedAmount value={marge} />
              </p>
              <CardDescription className="mt-1">{marge>=0?'Excédent':'Déficit'} mensuel</CardDescription>
            </div>
          </div>
        </AnimatedCard>
      </motion.section>

      {/* 🎯 Actions rapides AMÉLIORÉES */}
      <motion.section 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/income" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <ArrowUpCircle className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-green-700">Entrée</div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/expense" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <ArrowDownCircle className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-red-700">Dépense</div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/transfer" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400">
              <motion.div
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shuffle className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-blue-700">Transfert</div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/analytics" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:border-purple-400">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <BarChart3 className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-purple-700">Analytique</div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/alerts" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400 relative">
              {alerts.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                >
                  {alerts.length}
                </motion.div>
              )}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Bell className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-orange-700">Alertes</div>
            </Card>
          </motion.div>
        </Link>

        <Link href="/close-month" className="block">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-400">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="flex justify-center mb-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Sparkles className="text-white" size={24}/>
                </div>
              </motion.div>
              <div className="font-semibold text-sm text-indigo-700">Clôture</div>
            </Card>
          </motion.div>
        </Link>
      </motion.section>

      {/* 📈 Graphique d'évolution CONNECTÉ AUX VRAIES DONNÉES */}
      <AnimatedCard delay={0.5} enableHover={false}>
        <AnimatedLineChart
          data={chartData}
          dataKeys={[
            { key: 'solde', color: '#3b82f6', name: 'Solde total' },
            { key: 'revenus', color: '#10b981', name: 'Revenus' },
            { key: 'depenses', color: '#ef4444', name: 'Dépenses' }
          ]}
          xAxisKey="day"
          height={250}
          title="📈 Évolution financière (7 derniers jours)"
        />
      </AnimatedCard>

      {/* 💳 Enveloppes - NE PAS MODIFIER */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={listContainer}
      >
        <AnimatePresence>
          {envs.map((e, index)=>{
            const usedPct = e.budget_mensuel > 0 
              ? Math.min(100, Math.round(((e.budget_mensuel - Math.max(0, e.solde_actuel)) / e.budget_mensuel) * 100)) 
              : 0;
            const chip = e.protegee ? <Badge variant="info">Protégée</Badge> : <Badge>Flexible</Badge>;
            
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  delay: 0.5 + (index * 0.08),
                  type: 'spring',
                  stiffness: 260,
                  damping: 20 
                }}
                whileHover={{ scale: 1.03, y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/envelopes/${e.id}`} className="block h-full">
                  <Card className="h-full relative overflow-hidden cursor-pointer border-2 hover:border-blue-400 transition-all hover:shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          {e.nom}
                          <motion.div
                            className="opacity-0 group-hover:opacity-100"
                            initial={{ x: -5 }}
                            whileHover={{ x: 0 }}
                          >
                            <ExternalLink size={14} className="text-blue-600" />
                          </motion.div>
                        </CardTitle>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + (index * 0.08), type: 'spring' }}
                        >
                          {chip}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="p-2 rounded-lg bg-zinc-50 group-hover:bg-white transition-colors">
                          <div className="text-zinc-600 text-xs mb-1">Budget</div>
                          <div className="font-semibold">{Math.round(e.budget_mensuel).toLocaleString('fr-GA')} XAF</div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 group-hover:bg-white transition-colors">
                          <div className="text-zinc-600 text-xs mb-1">Pourcentage</div>
                          <div className="font-semibold">{e.pourcentage}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 group-hover:bg-white transition-colors">
                          <div className="text-zinc-600 text-xs mb-1">Dépenses</div>
                          <div className="font-semibold text-red-600">{(depByEnv[e.id]||0).toLocaleString('fr-GA')} XAF</div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-50 group-hover:bg-white transition-colors">
                          <div className="text-zinc-600 text-xs mb-1">Solde</div>
                          <motion.div 
                            className={`text-lg font-bold ${e.solde_actuel<0?'text-red-700':'text-green-700'}`}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + (index * 0.08) }}
                          >
                            {Math.round(e.solde_actuel).toLocaleString('fr-GA')}
                          </motion.div>
                        </div>
                      </div>

                      {e.budget_mensuel > 0 && (
                        <AnimatedProgressBar percentage={usedPct} />
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.section>

      {/* 📋 Dernières transactions & Alertes AVEC BOUTONS "VOIR PLUS" */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transactions */}
        <AnimatedCard delay={0.8} variant="slideUp">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Dernières transactions</CardTitle>
            <Link href="/transactions">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="gap-2">
                  Voir plus <ArrowRight size={14} />
                </Button>
              </motion.div>
            </Link>
          </div>
          <Table>
            <THead>
              <TR><TH>Date</TH><TH>Type</TH><TH>Montant</TH><TH>Description</TH></TR>
            </THead>
            <TBody>
              <AnimatePresence>
                {txs.map((t, index)=>(
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.9 + (index * 0.05) }}
                    whileHover={{ backgroundColor: '#f9fafb', scale: 1.01 }}
                  >
                    <TD>{(() => {
                      const d: any = (t as any).date_transaction;
                      try {
                        const dateObj = typeof d === 'string' ? new Date(d) : new Date(d);
                        return dateObj.toISOString().slice(0,10);
                      } catch {
                        return String(d);
                      }
                    })()}</TD>
                    <TD>
                      <Badge variant={
                        t.type === 'ENTREE' ? 'info' : 
                        t.type === 'SORTIE' ? 'destructive' : 
                        'warning'
                      }>
                        {t.type}
                      </Badge>
                    </TD>
                    <TD className="font-medium">{Math.round(t.montant_total).toLocaleString('fr-GA')} XAF</TD>
                    <TD className="text-zinc-600 text-sm">{t.description||'—'}</TD>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TBody>
          </Table>
        </AnimatedCard>

        {/* Alertes */}
        <AnimatedCard delay={0.9} variant="slideUp">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} />
              Alertes récentes
            </CardTitle>
            <Link href="/alerts">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="gap-2">
                  Voir plus <ArrowRight size={14} />
                </Button>
              </motion.div>
            </Link>
          </div>
          <div className="grid gap-2">
            <AnimatePresence>
              {alerts.map((a, index) => (
                <motion.div
                  key={a.id}
                  className="flex items-start gap-2 p-3 border rounded-xl hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 1 + (index * 0.05) }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Badge variant={alertVariant(a.type)}>{a.type}</Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{a.titre}</div>
                    {a.description && (
                      <div className="text-xs text-zinc-600 mt-1">{a.description}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </AnimatedCard>
      </section>
    </motion.div>
  );
}
