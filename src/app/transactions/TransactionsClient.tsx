'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { AnimatedBarChart } from '@/components/charts/AnimatedBarChart';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, Shuffle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { listContainer, listItem } from '@/lib/animations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * 📋 PAGE TRANSACTIONS AMÉLIORÉE
 * Avec graphiques et animations
 */

interface Transaction {
  id: number;
  type: 'ENTREE' | 'SORTIE' | 'TRANSFERT';
  montant_total: number;
  description: string | null;
  date_transaction: string;
}

interface TransactionsClientProps {
  transactions: Transaction[];
  page: number;
  pages: number;
  stats: {
    totalEntrees: number;
    totalSorties: number;
    totalTransferts: number;
    evolution: Array<{ date: string; entrees: number; sorties: number }>;
    byType: Array<{ name: string; value: number }>;
  };
}

export function TransactionsClient({
  transactions: initialTransactions,
  page,
  pages,
  stats,
}: TransactionsClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filter, setFilter] = useState<'all' | 'ENTREE' | 'SORTIE' | 'TRANSFERT'>('all');

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ENTREE':
        return <ArrowUpCircle className="text-green-600" size={20} />;
      case 'SORTIE':
        return <ArrowDownCircle className="text-red-600" size={20} />;
      case 'TRANSFERT':
        return <Shuffle className="text-blue-600" size={20} />;
      default:
        return null;
    }
  };

  const getBadgeVariant = (type: string): any => {
    switch (type) {
      case 'ENTREE':
        return 'success';
      case 'SORTIE':
        return 'destructive';
      case 'TRANSFERT':
        return 'info';
      default:
        return 'default';
    }
  };

  const deleteTransaction = async (id: number) => {
    if (!confirm('Supprimer cette transaction ? Les soldes seront réajustés.')) {
      return;
    }

    try {
      const response = await fetch('/api/transactions/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTransactions(transactions.filter(t => t.id !== id));
        toast.success('Transaction supprimée');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête avec stats */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <h1 className="text-2xl font-bold mb-4">📋 Transactions</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="text-green-600" size={24} />
              <span className="text-sm text-zinc-600">Entrées</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {stats.totalEntrees.toLocaleString('fr-GA')} XAF
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="text-red-600" size={24} />
              <span className="text-sm text-zinc-600">Sorties</span>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {stats.totalSorties.toLocaleString('fr-GA')} XAF
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shuffle className="text-blue-600" size={24} />
              <span className="text-sm text-zinc-600">Transferts</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {stats.totalTransferts.toLocaleString('fr-GA')} XAF
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.2} enableHover={false}>
          <AnimatedLineChart
            data={stats.evolution}
            dataKeys={[
              { key: 'entrees', color: '#10b981', name: 'Entrées' },
              { key: 'sorties', color: '#ef4444', name: 'Sorties' },
            ]}
            xAxisKey="date"
            height={250}
            title="📈 Évolution (30 derniers jours)"
          />
        </AnimatedCard>

        <AnimatedCard delay={0.3} enableHover={false}>
          <AnimatedBarChart
            data={stats.byType}
            dataKeys={[{ key: 'value', color: '#3b82f6', name: 'Montant' }]}
            xAxisKey="name"
            height={250}
            title="📊 Répartition par type"
          />
        </AnimatedCard>
      </div>

      {/* Filtres */}
      <AnimatedCard delay={0.4} enableHover={false}>
        <div className="flex flex-wrap gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilter('all')}>
            <Badge variant={filter === 'all' ? 'info' : 'default'}>
              Toutes ({transactions.length})
            </Badge>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilter('ENTREE')}>
            <Badge variant={filter === 'ENTREE' ? 'success' : 'default'}>
              Entrées ({transactions.filter(t => t.type === 'ENTREE').length})
            </Badge>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilter('SORTIE')}>
            <Badge variant={filter === 'SORTIE' ? 'destructive' : 'default'}>
              Sorties ({transactions.filter(t => t.type === 'SORTIE').length})
            </Badge>
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilter('TRANSFERT')}>
            <Badge variant={filter === 'TRANSFERT' ? 'info' : 'default'}>
              Transferts ({transactions.filter(t => t.type === 'TRANSFERT').length})
            </Badge>
          </motion.button>
        </div>
      </AnimatedCard>

      {/* Liste des transactions */}
      <AnimatedCard delay={0.5} enableHover={false}>
        <h2 className="text-lg font-semibold mb-4">
          {filteredTransactions.length} transaction(s)
        </h2>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 rounded-xl border-2 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className="mt-1">{getIcon(tx.type)}</div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getBadgeVariant(tx.type)}>
                        {tx.type}
                      </Badge>
                      <span className="text-sm text-zinc-600">
                        {format(new Date(tx.date_transaction), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>

                    <div className="font-semibold text-lg">
                      {Math.round(tx.montant_total).toLocaleString('fr-GA')} XAF
                    </div>

                    {tx.description && (
                      <p className="text-sm text-zinc-600 mt-1">
                        {tx.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteTransaction(tx.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              Aucune transaction pour ce filtre.
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex gap-2 justify-center flex-wrap">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/transactions?page=${p}`}
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

      {/* Navigation */}
      <div className="flex gap-3">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Retour Dashboard
        </Link>
      </div>
    </motion.div>
  );
}


