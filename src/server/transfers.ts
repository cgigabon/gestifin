'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';
import { SQL } from '@/lib/sql';
import type { PoolConnection } from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

const TransferInput = z.object({
  utilisateurId: z.number().positive(),
  sourceId: z.number().positive(),
  targetId: z.number().positive(),
  montant: z.coerce.number().positive(),
  date: z.string().optional(),        // YYYY-MM-DD
  note: z.string().optional(),
});

export async function createTransfer(raw: unknown): Promise<{ id: number }> {
  const input = TransferInput.parse(raw);
  if (input.sourceId === input.targetId) throw new Error('Enveloppes identiques');

  const date = input.date ?? new Date().toISOString().slice(0,10);

  return tx(async (conn: PoolConnection) => {
    // Crée la transaction TRANSFERT
    const [resTx] = await conn.query(SQL.insertTransaction, [
      input.utilisateurId, 'TRANSFERT', input.montant, input.note ?? null, null, date,
    ]);
    const txId = (resTx as any).insertId as number;

    // Allocations source (débit) & cible (crédit)
    await conn.query(SQL.insertAllocation, [txId, input.sourceId, input.montant, 'TRANSFERT_SOURCE']);
    await conn.query(SQL.insertAllocation, [txId, input.targetId, input.montant, 'TRANSFERT_CIBLE']);

    // MAJ soldes
    await conn.query(SQL.updateEnvelopeBalance, [-input.montant, input.sourceId]);
    await conn.query(SQL.updateEnvelopeBalance, [ input.montant, input.targetId]);

    // Audit
    await conn.query(SQL.auditWithDetails, [
      input.utilisateurId,
      'transfer.create',
      'transaction',
      String(txId),
      `Transfert ${Math.round(input.montant)} XAF de #${input.sourceId} vers #${input.targetId}`,
      JSON.stringify({ sourceId: input.sourceId, targetId: input.targetId, montant: input.montant })
    ]);

    // Revalidate pages showing balances
    revalidatePath('/dashboard');
    revalidatePath(`/envelopes/${input.sourceId}`);
    revalidatePath(`/envelopes/${input.targetId}`);
    revalidatePath('/transactions');

    return { id: txId };
  });
}


