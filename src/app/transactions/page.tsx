import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import { TransactionsClient } from './TransactionsClient';
import { subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getData(userId: number, page: number) {
  const size = 20;
  const offset = (page - 1) * size;
  
  const [[rows], [cnt], [statsRows]] = await Promise.all([
    pool.query(SQL.listUserTransactions, [userId, size, offset]),
    pool.query(SQL.countUserTransactions, [userId]),
    pool.query(`
      SELECT 
        type,
        SUM(montant_total) as total
      FROM transactions
      WHERE utilisateur_id = ?
      GROUP BY type
    `, [userId]),
  ]);

  const list = rows as { id: number; type: 'ENTREE' | 'SORTIE' | 'TRANSFERT'; montant_total: number; description: string | null; date_transaction: string }[];
  const total = Number((cnt as any[])[0]?.n || 0);
  const stats = statsRows as { type: string; total: number }[];

  // Stats
  const totalEntrees = Math.round(Number(stats.find(s => s.type === 'ENTREE')?.total || 0));
  const totalSorties = Math.round(Number(stats.find(s => s.type === 'SORTIE')?.total || 0));
  const totalTransferts = Math.round(Number(stats.find(s => s.type === 'TRANSFERT')?.total || 0));

  // Évolution 30 derniers jours
  const evolution = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const dayTransactions = list.filter(t => {
      const txDate = new Date(t.date_transaction);
      return format(txDate, 'yyyy-MM-dd') === dateStr;
    });

    const entrees = Math.round(
      dayTransactions
        .filter(t => t.type === 'ENTREE')
        .reduce((sum, t) => sum + t.montant_total, 0)
    );

    const sorties = Math.round(
      dayTransactions
        .filter(t => t.type === 'SORTIE')
        .reduce((sum, t) => sum + t.montant_total, 0)
    );

    evolution.push({
      date: format(date, 'dd/MM'),
      entrees,
      sorties,
    });
  }

  const byType = [
    { name: 'Entrées', value: totalEntrees },
    { name: 'Sorties', value: totalSorties },
    { name: 'Transferts', value: totalTransferts },
  ].filter(d => d.value > 0);

  return {
    list,
    page,
    pages: Math.max(1, Math.ceil(total / size)),
    stats: {
      totalEntrees,
      totalSorties,
      totalTransferts,
      evolution,
      byType,
    },
  };
}

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const userId = await getUserIdOrThrow();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page || 1));
  const { list, pages, stats } = await getData(userId, page);

  return (
    <TransactionsClient
      transactions={list}
      page={page}
      pages={pages}
      stats={stats}
    />
  );
}


