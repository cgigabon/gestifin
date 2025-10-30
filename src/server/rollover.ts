'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';
import { SQL } from '@/lib/sql';
import type { PoolConnection } from 'mysql2/promise';

const CloseInput = z.object({
  utilisateurId: z.number().positive(),
  ym: z.string().regex(/^\d{4}-\d{2}$/), // 'YYYY-MM' (mois que l'on clôture)
  mode: z.enum(['carry', 'sweep']).default('carry'), // 'carry' = porter soldes ; 'sweep' = ramasser surplus
  sweepToEnvelopeId: z.number().positive().optional(), // requis si mode 'sweep'
  ajustes: z
    .array(
      z.object({
        enveloppeId: z.number().positive(),
        budgetMensuel: z.coerce.number().nonnegative().optional(),
        pourcentage: z.coerce.number().min(0).max(100).optional(),
      })
    )
    .optional(),
});

export async function closeMonth(raw: unknown): Promise<{ ok: true; swept?: number }> {
  const input = CloseInput.parse(raw);

  return tx(async (conn: PoolConnection) => {
    // ❗ Empêcher double clôture du même mois
    const [exists] = await conn.query(SQL.hasMonthClosure, [input.utilisateurId, input.ym]);
    if (Array.isArray(exists) && (exists as any[])[0]) {
      throw new Error(`Ce mois (${input.ym}) est déjà clôturé pour cet utilisateur.`);
    }
    // 1) snapshot pour audit
    const [envsRows] = await conn.query(
      'SELECT id, nom, solde_actuel, budget_mensuel, pourcentage, protegee FROM enveloppes WHERE utilisateur_id=? ORDER BY id',
      [input.utilisateurId]
    );
    const envs = envsRows as { id:number; nom:string; solde_actuel:number; budget_mensuel:number; pourcentage:number; protegee:0|1 }[];

    // 2) mode sweep : ramasser les soldes POSITIFS des enveloppes non protégées vers sweepToEnvelopeId
    let swept = 0;
    if (input.mode === 'sweep') {
      if (!input.sweepToEnvelopeId) throw new Error('sweepToEnvelopeId requis en mode "sweep"');

      for (const e of envs) {
        if (e.id === input.sweepToEnvelopeId) continue;
        if (e.protegee) continue;
        const surplus = Math.max(0, Number(e.solde_actuel || 0));
        if (surplus > 0) {
          // débit source
          await conn.query('UPDATE enveloppes SET solde_actuel = solde_actuel - ? WHERE id=?', [surplus, e.id]);
          // crédit cible
          await conn.query('UPDATE enveloppes SET solde_actuel = solde_actuel + ? WHERE id=?', [surplus, input.sweepToEnvelopeId]);
          swept += surplus;
        }
      }
    }

    // 3) appliquer les ajustements budgets/%
    if (input.ajustes?.length) {
      for (const a of input.ajustes) {
        if (a.budgetMensuel !== undefined) {
          await conn.query('UPDATE enveloppes SET budget_mensuel=? WHERE id=? AND utilisateur_id=?', [a.budgetMensuel, a.enveloppeId, input.utilisateurId]);
        }
        if (a.pourcentage !== undefined) {
          await conn.query('UPDATE enveloppes SET pourcentage=? WHERE id=? AND utilisateur_id=?', [a.pourcentage, a.enveloppeId, input.utilisateurId]);
        }
      }
    }

    // 4) porter solde_actuel en solde_initial (point de départ du nouveau mois)
    await conn.query(
      'UPDATE enveloppes SET solde_initial = solde_actuel WHERE utilisateur_id=?',
      [input.utilisateurId]
    );

    // 5) audit
    await conn.query(
      SQL.auditWithDetails,
      [
        input.utilisateurId,
        'month.close',
        'utilisateur',
        String(input.utilisateurId),
        `Clôture ${input.ym} (${input.mode}${input.mode==='sweep'&&input.sweepToEnvelopeId?`→#${input.sweepToEnvelopeId}`:''})`,
        JSON.stringify({
          ym: input.ym,
          mode: input.mode,
          sweepToEnvelopeId: input.sweepToEnvelopeId ?? null,
          swept,
          ajustes: input.ajustes ?? [],
          snapshot: envs.map(e => ({ id: e.id, nom: e.nom, solde: e.solde_actuel })),
        }),
      ]
    );

    return { ok: true, swept: swept || undefined };
  });
}


