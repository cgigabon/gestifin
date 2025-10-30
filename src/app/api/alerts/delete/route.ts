import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = Number((session as any)?.user?.id ?? 0);
    
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await req.json();

    await pool.query(
      'DELETE FROM alertes WHERE id = ? AND utilisateur_id = ?',
      [id, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur delete alert:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


