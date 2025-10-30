import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pool } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'transactions';
  const session = await getServerSession(authOptions);
  const userId = Number((session as any)?.user?.id ?? 0);
  if (!userId) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  let rows: any[] = [];
  if (type === 'transactions') {
    const [r] = await pool.query(
      `SELECT id, type, montant_total, description, service_id, date_transaction
       FROM transactions WHERE utilisateur_id=? ORDER BY date_transaction DESC, id DESC LIMIT 1000`,
      [userId]
    );
    rows = r as any[];
  } else if (type === 'soldes') {
    const [r] = await pool.query(
      `SELECT id, nom, budget_mensuel, solde_actuel, pourcentage, protegee
       FROM enveloppes WHERE utilisateur_id=? ORDER BY nom`,
      [userId]
    );
    rows = r as any[];
  } else if (type === 'journal') {
    const [r] = await pool.query(
      `SELECT id, user_id, action, entity, entity_id, meta, created_at
       FROM audit_logs WHERE user_id=? ORDER BY created_at DESC LIMIT 1000`,
      [userId]
    );
    rows = r as any[];
  } else {
    return NextResponse.json({ error: 'type inconnu' }, { status: 400 });
  }

  const header = Object.keys(rows[0] ?? {});
  // Excel-friendly CSV (FR): use semicolon delimiter and UTF-8 BOM; normalize dates
  const sep = ';';
  const toCell = (v: any) => {
    if (v == null) return '';
    let s: string;
    if (typeof v === 'number') s = String(v);
    else if (v instanceof Date) s = v.toISOString().slice(0, 10);
    else {
      const str = String(v);
      // if looks like ISO date -> keep YYYY-MM-DD
      s = /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10) : str;
    }
    s = s.replace(/\r?\n/g, ' ').replace(/"/g, '""');
    return (s.includes(sep) || s.includes('"')) ? `"${s}"` : s;
  };
  const body = rows.map(row => header.map(h => toCell((row as any)[h])).join(sep)).join('\n');
  const csv = ['\uFEFF' + header.join(sep), body].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=${type}.csv`,
    },
  });
}



