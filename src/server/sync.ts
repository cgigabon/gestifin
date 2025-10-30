'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';
import { SQL } from '@/lib/sql';
import type { PoolConnection } from 'mysql2/promise';

const SyncInput = z.object({
  utilisateurId: z.number().positive(),
  date: z.string().optional(),         // YYYY-MM-DD (défaut: today)
  cashDeclare: z.coerce.number(),      // cash réel saisi
});

export async function syncCash(raw: unknown): Promise<{ ok:true; net:number; ecart:number }> {
  const input = SyncInput.parse(raw);
  const date = input.date ?? new Date().toISOString().slice(0,10);

  return tx(async (conn: PoolConnection) => {
    // totaux du jour
    const [rows] = await conn.query(SQL.selectDayTotals, [input.utilisateurId, date]);
    const r = Array.isArray(rows) ? rows[0] as any : { total_entrees: 0, total_depenses: 0 };
    const totE = Number(r.total_entrees || 0);
    const totD = Number(r.total_depenses || 0);
    const net  = totE - totD;

    const ecart = input.cashDeclare - net;

    // upsert synchronisation
    await conn.query(SQL.upsertSync, [input.utilisateurId, date, input.cashDeclare, net, ecart]);

    // alerte si écart important (±500 XAF)
    if (Math.abs(ecart) >= 500) {
      await conn.query(SQL.insertAlert, [
        input.utilisateurId, 'ATTENTION',
        `Écart de caisse ${ecart > 0 ? '+' : ''}${Math.round(ecart)} XAF`,
        `Cash déclaré (${Math.round(input.cashDeclare)}) vs net calculé (${Math.round(net)})`,
        null, null
      ]);
    }

    return { ok: true, net, ecart };
  });
}



