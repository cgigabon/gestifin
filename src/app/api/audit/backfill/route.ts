import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pool } from '@/lib/db';

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = Number((session as any)?.user?.id ?? 0);
  if (!userId) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Backfill simple: copier meta -> details si vide
    await conn.query(
      `UPDATE audit_logs SET details = meta WHERE user_id=? AND details IS NULL AND meta IS NOT NULL`,
      [userId]
    );
    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    console.error('Backfill audit failed', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  } finally {
    conn.release();
  }
}



