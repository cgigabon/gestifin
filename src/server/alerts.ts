'use server';

import type { PoolConnection } from 'mysql2/promise';
import { SQL } from '@/lib/sql';

/**
 * Vérifie et enregistre des alertes après une transaction.
 * - solde faible (<10% budget)
 * - dépassement budget (solde < 0)
 * - dépense sur enveloppe protégée (à déclencher côté UI avant, ici on journalise si solde devient <0)
 */
export async function checkBudgetAlerts(conn: PoolConnection, utilisateurId: number, transactionId: number) {
  // On parcourt les enveloppes pour poser des alertes si besoin
  const [envs] = await conn.query(
    'SELECT id, nom, solde_actuel, budget_mensuel, protegee FROM enveloppes WHERE utilisateur_id=?',
    [utilisateurId]
  );
  const rows = envs as { id:number; nom:string; solde_actuel:number; budget_mensuel:number; protegee:0|1 }[];

  for (const e of rows) {
    const budget = Number(e.budget_mensuel || 0);
    const solde  = Number(e.solde_actuel || 0);

    // 1) Solde faible < 10% budget (si budget > 0)
    if (budget > 0 && solde <= budget * 0.1 && solde > 0) {
      await conn.query(SQL.insertAlert, [
        utilisateurId, 'ATTENTION',
        `Solde faible - ${e.nom}`,
        `Le solde est à ${Math.round(solde)} XAF (≤ 10% du budget)`,
        e.id, transactionId
      ]);
    }

    // 2) Dépassement budget (solde < 0)
    if (solde < 0) {
      await conn.query(SQL.insertAlert, [
        utilisateurId, 'CRITIQUE',
        `Dépassement - ${e.nom}`,
        `Le solde est négatif (${Math.round(solde)} XAF)`,
        e.id, transactionId
      ]);
    }
  }
}



