'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';
import { SQL } from '@/lib/sql';
import type { PoolConnection } from 'mysql2/promise';
import { checkBudgetAlerts } from './alerts'; // <-- ajoute ceci

const AddIncomeInput = z.object({
  utilisateurId: z.number().positive(),
  serviceId: z.number().optional(),
  montant: z.coerce.number().positive(),
  date: z.string().optional(),     // 'YYYY-MM-DD'
  note: z.string().optional(),
});

export async function addIncome(raw: unknown): Promise<{ id: number }> {
  const input = AddIncomeInput.parse(raw);
  const date = input.date ?? new Date().toISOString().slice(0,10);

  return tx(async (conn: PoolConnection) => {
    // 1) transaction ENTREE
    const [resTx] = await conn.query(SQL.insertTransaction, [
      input.utilisateurId, 'ENTREE', input.montant, input.note ?? null, input.serviceId ?? null, date,
    ]);
    const txId = (resTx as any).insertId as number;

    // 2) répartition par % enveloppes
    const [envs] = await conn.query(SQL.listActiveEnvelopes, [input.utilisateurId]);
    const rows = envs as { id: number; pourcentage: number }[];

    for (const e of rows) {
      const m = Math.round((input.montant * (Number(e.pourcentage) || 0))) / 100;
      if (m <= 0) continue;
      await conn.query(SQL.insertAllocation, [txId, e.id, m, 'ENTREE']);
      await conn.query(SQL.updateEnvelopeBalance, [m, e.id]);
    }

    await conn.query(SQL.auditWithDetails, [
      input.utilisateurId,
      'transaction.create',
      'transaction',
      String(txId),
      `Entrée ${Math.round(input.montant)} XAF`,
      JSON.stringify({ type: 'ENTREE', montant: input.montant })
    ]);
    await checkBudgetAlerts(conn, input.utilisateurId, txId);
    return { id: txId };
  });
}

const AddExpenseInput = z.object({
  utilisateurId: z.number().positive(),
  allocations: z.array(z.object({ enveloppeId: z.number().positive(), montant: z.coerce.number().positive() })).min(1),
  description: z.string().optional(),
  date: z.string().optional(),     // 'YYYY-MM-DD'
});

export async function addExpenseWithSplits(raw: unknown): Promise<{ id: number }> {
  const input = AddExpenseInput.parse(raw);
  const date = input.date ?? new Date().toISOString().slice(0,10);

  return tx(async (conn: PoolConnection) => {
    const total = input.allocations.reduce((s, a) => s + a.montant, 0);

    // --- Contrôles métier avant écriture ---
    // Récupérer soldes & statuts des enveloppes visées
    const ids = input.allocations.map(a => a.enveloppeId);
    const [rows] = await conn.query(
      `SELECT id, nom, protegee, solde_actuel
       FROM enveloppes
       WHERE utilisateur_id=? AND id IN (${ids.map(()=>'?').join(',')})`,
      [input.utilisateurId, ...ids]
    );
    const envMap = new Map<number, { nom:string; protegee:0|1; solde_actuel:number }>();
    (rows as any[]).forEach(r => envMap.set(Number(r.id), { nom: r.nom, protegee: r.protegee, solde_actuel: Number(r.solde_actuel) }));

    // Vérifier chaque allocation
    for (const a of input.allocations) {
      const info = envMap.get(a.enveloppeId);
      if (!info) throw new Error(`Enveloppe ${a.enveloppeId} introuvable`);
      const newSolde = info.solde_actuel - a.montant;

      // Règle 1: enveloppe protégée → interdiction de passer négatif
      if (info.protegee && newSolde < 0) {
        throw new Error(`Enveloppe protégée "${info.nom}" : solde insuffisant (${Math.round(info.solde_actuel)} XAF)`);
      }
      // Règle 2: même non protégée, prévenir dépassement fort (on crée une alerte critique après coup)
    }

    // --- Écriture transaction ---
    const [resTx] = await conn.query(SQL.insertTransaction, [
      input.utilisateurId, 'SORTIE', total, input.description ?? null, null, date,
    ]);
    const txId = (resTx as any).insertId as number;

    for (const a of input.allocations) {
      await conn.query(SQL.insertAllocation, [txId, a.enveloppeId, a.montant, 'SORTIE']);
      await conn.query(SQL.updateEnvelopeBalance, [-a.montant, a.enveloppeId]);
    }

    await conn.query(SQL.auditWithDetails, [
      input.utilisateurId,
      'expense.create',
      'transaction',
      String(txId),
      `Dépense ${Math.round(total)} XAF sur ${input.allocations.length} enveloppe(s)`,
      JSON.stringify({ total, parts: input.allocations.length })
    ]);

    // Alertes post-écriture (solde faible / négatif)
    await checkBudgetAlerts(conn, input.utilisateurId, txId);

    return { id: txId };
  });
}


