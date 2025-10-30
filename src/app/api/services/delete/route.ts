import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { utilisateurId, id } = body;

    if (!utilisateurId || !id) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Vérifier si le service est utilisé
      const [refRows] = await conn.query(
        'SELECT id FROM transactions WHERE service_id = ? LIMIT 1',
        [id]
      );

      if (Array.isArray(refRows) && refRows.length > 0) {
        await conn.rollback();
        return NextResponse.json(
          { error: 'Ce service est utilisé dans des transactions. Désactivez-le plutôt.' },
          { status: 400 }
        );
      }

      // Supprimer le service
      await conn.query(
        'DELETE FROM services WHERE id = ? AND utilisateur_id = ?',
        [id, utilisateurId]
      );

      // Audit log
      await conn.query(
        'INSERT INTO audit_logs (user_id, action, entity, entity_id, details, meta) VALUES (?,?,?,?,?,?)',
        [utilisateurId, 'service.delete', 'service', String(id), `Service supprimé #${id}`, null]
      );

      await conn.commit();

      revalidatePath('/services');
      revalidatePath('/income');

      return NextResponse.json({ ok: true });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

