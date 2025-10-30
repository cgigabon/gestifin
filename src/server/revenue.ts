'use server';

import { pool } from '@/lib/db';
import { z } from 'zod';

const Baseline = z.object({
  monthsWindow: z.coerce.number().min(1).max(12),
  months: z
    .array(z.object({ mois: z.string(), montant: z.coerce.number().min(0) }))
    .optional(),
  avgIncome: z.coerce.number().min(0).optional(),
  effectiveFrom: z.string(), // 'YYYY-MM-01'
  note: z.string().optional(),
});

export async function setRevenueBaseline(userId: number, raw: unknown) {
  const input = Baseline.parse(raw);
  const avg =
    input.avgIncome ??
    Math.round(
      (((input.months ?? []).reduce((s, x) => s + x.montant, 0) /
        ((input.months?.length || input.monthsWindow) || 1)) as number) * 100
    ) / 100;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res]: any = await conn.query(
      `INSERT INTO budget_configs (utilisateur_id, avg_income, months_window, effective_from, note)
       VALUES (?,?,?,?,?)`,
      [userId, avg, input.monthsWindow, input.effectiveFrom, input.note ?? null]
    );
    const configId = res.insertId as number;

    if (input.months && input.months.length) {
      const values = input.months.map((m) => [configId, m.mois, m.montant]);
      await conn.query(
        `INSERT INTO revenus_histo (config_id, mois, montant) VALUES ?`,
        [values]
      );
    }

    // Si la date d'effet est passée ou aujourd'hui, recalculer les % des enveloppes actives
    const [[{ now }]]: any = await conn.query('SELECT CURDATE() AS now');
    if (new Date(input.effectiveFrom) <= new Date(now)) {
      // 1) Appliquer pourcentage direct à partir des budgets
      await conn.query(
        `UPDATE enveloppes
         SET pourcentage = ROUND(CASE WHEN ? > 0 THEN (budget_mensuel / ?) * 100 ELSE 0 END, 2)
         WHERE utilisateur_id=? AND actif=1`,
        [avg, avg, userId]
      );
      // 2) Renormaliser pour s'assurer que la somme = 100
      const [[{ totalPct }]]: any = await conn.query(
        `SELECT COALESCE(SUM(pourcentage),0) AS totalPct FROM enveloppes WHERE utilisateur_id=? AND actif=1`,
        [userId]
      );
      const t = Number(totalPct || 0);
      if (t > 0 && Math.abs(t - 100) > 0.01) {
        await conn.query(
          `UPDATE enveloppes SET pourcentage = ROUND((pourcentage / ?) * 100, 2) WHERE utilisateur_id=? AND actif=1`,
          [t, userId]
        );
      }
    }

    await conn.commit();
    return { ok: true, configId };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function getCurrentConfig(userId: number) {
  const [[current]]: any = await pool.query(
    `SELECT * FROM budget_configs
     WHERE utilisateur_id=? AND effective_from<=CURDATE()
     ORDER BY effective_from DESC LIMIT 1`,
    [userId]
  );
  const [[next]]: any = await pool.query(
    `SELECT * FROM budget_configs
     WHERE utilisateur_id=? AND effective_from>CURDATE()
     ORDER BY effective_from ASC LIMIT 1`,
    [userId]
  );
  let currentMonths: any[] = [];
  let nextMonths: any[] = [];
  let currentObj: any = current;
  if (current?.id) {
    const [rows]: any = await pool.query(
      `SELECT mois, montant FROM revenus_histo WHERE config_id=? ORDER BY mois DESC`,
      [current.id]
    );
    currentMonths = rows;
  } else {
    // Fallback: construire une configuration actuelle depuis les entrées récentes
    const [rows]: any = await pool.query(
      `SELECT DATE_FORMAT(date_transaction, '%Y-%m-01') AS mois, SUM(montant_total) AS montant
       FROM transactions
       WHERE utilisateur_id=? AND type='ENTREE'
       GROUP BY 1
       ORDER BY mois DESC
       LIMIT 6`,
      [userId]
    );
    currentMonths = rows || [];
    if (currentMonths.length) {
      const sum = currentMonths.reduce((s: number, r: any) => s + Number(r.montant || 0), 0);
      const avg = Math.round((sum / currentMonths.length) * 100) / 100;
      currentObj = {
        avg_income: avg,
        months_window: currentMonths.length,
        effective_from: currentMonths[currentMonths.length - 1]?.mois,
        note: 'Basé sur les entrées récentes',
      };
    }
  }
  if (next?.id) {
    const [rows]: any = await pool.query(
      `SELECT mois, montant FROM revenus_histo WHERE config_id=? ORDER BY mois DESC`,
      [next.id]
    );
    nextMonths = rows;
  }
  return { current: currentObj, next, currentMonths, nextMonths };
}


