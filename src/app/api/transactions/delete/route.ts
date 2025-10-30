import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { tx } from '@/lib/db';
import { SQL } from '@/lib/sql';
import type { PoolConnection } from 'mysql2/promise';

async function deleteTx(userId: number, txId: number) {
  return tx(async (conn: PoolConnection) => {
    // Recréditer/débiter les enveloppes selon allocations AVANT suppression
    const [allocs] = await conn.query(SQL.allocationsByTransaction, [txId]);
    const rows = allocs as { enveloppe_id: number; montant: number; type_allocation: 'ENTREE' | 'SORTIE' | 'TRANSFERT_SOURCE' | 'TRANSFERT_CIBLE' }[];

    for (const a of rows) {
      let delta = 0;
      if (a.type_allocation === 'ENTREE' || a.type_allocation === 'TRANSFERT_CIBLE') delta = -a.montant;
      if (a.type_allocation === 'SORTIE' || a.type_allocation === 'TRANSFERT_SOURCE') delta = +a.montant;
      await conn.query('UPDATE enveloppes SET solde_actuel = solde_actuel + ? WHERE id=?', [delta, a.enveloppe_id]);
    }

    await conn.query(SQL.deleteAllocationsByTx, [txId]);
    await conn.query(SQL.deleteTransactionById, [txId, userId]);
    await conn.query(SQL.auditWithDetails, [
      userId,
      'transaction.delete',
      'transaction',
      String(txId),
      `Suppression transaction #${txId} (réversions: ${rows.length})`,
      JSON.stringify({ reverted: rows.length })
    ]);
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = Number((session as any)?.user?.id ?? 0);
    
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await req.json();

    await deleteTx(userId, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur delete transaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


