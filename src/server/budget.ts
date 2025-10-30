'use server';

import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import { z } from 'zod';

// 1) Ajouter une enveloppe (avec % choisi)
const AddEnv = z.object({
  nom: z.string().min(2),
  pourcentage: z.coerce.number().min(0).max(100),
  budgetMensuel: z.coerce.number().min(0).default(0),
  protegee: z.coerce.boolean().default(false),
});

export async function addEnvelope(userId: number, raw: unknown) {
  const input = AddEnv.parse(raw);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[info]]: any = await conn.query(
      `SELECT COALESCE(SUM(pourcentage),0) AS total, COUNT(*) AS nb
       FROM enveloppes WHERE utilisateur_id=? AND actif=1`,
      [userId]
    );
    const total = Number(info?.total || 0);
    const nb = Number(info?.nb || 0);

    let p = Number(input.pourcentage || 0);
    if (p <= 0) {
      if (total < 100) {
        const reste = Math.max(0, 100 - total);
        p = Math.min(100, reste);
      } else {
        p = Math.round((100 / (nb + 1)) * 100) / 100; // auto-répartition
      }
    }

    const [insertRes]: any = await conn.query(
      `INSERT INTO enveloppes
       (utilisateur_id, nom, budget_mensuel, pourcentage, protegee, solde_initial, solde_actuel, actif)
       VALUES (?,?,?,?,?,0,0,1)`,
      [userId, input.nom.trim(), input.budgetMensuel, p, input.protegee ? 1 : 0]
    );
    const newId = Number(insertRes.insertId);

    // Renormalise les autres proportionnellement si nécessaire
    if (total > 0) {
      const factor = (100 - p) / total;
      await conn.query(
        `UPDATE enveloppes SET pourcentage = ROUND(pourcentage * ?, 2)
         WHERE utilisateur_id=? AND actif=1 AND id<>?`,
        [factor, userId, newId]
      );
    }

    // Alerte INFO: création d'enveloppe
    await conn.query(SQL.insertAlert, [
      userId,
      'INFO',
      'Nouvelle enveloppe',
      `Enveloppe "${input.nom.trim()}" créée (${p}%${input.protegee ? ' protégée' : ''})`,
      newId,
      null,
    ]);

    // Audit: envelope.create
    await conn.query(SQL.auditWithDetails, [
      userId,
      'envelope.create',
      'envelope',
      String(newId),
      `Créée: ${input.nom.trim()} • ${p}%${input.protegee ? ' • protégée' : ''}`,
      JSON.stringify({ budgetMensuel: input.budgetMensuel, pourcentage: p, protegee: !!input.protegee })
    ]);

    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// 2) Appliquer une liste de pourcentages
const ApplyPcts = z.object({
  items: z.array(z.object({ id: z.coerce.number(), pourcentage: z.coerce.number().min(0).max(100) }))
});

export async function applyPercentages(userId: number, raw: unknown) {
  const { items } = ApplyPcts.parse(raw);
  const sum = items.reduce((s, x) => s + x.pourcentage, 0);
  if (Math.abs(sum - 100) > 0.01) throw new Error('La somme des % doit faire 100.');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const it of items) {
      await conn.query(
        `UPDATE enveloppes SET pourcentage=? WHERE id=? AND utilisateur_id=? AND actif=1`,
        [it.pourcentage, it.id, userId]
      );
    }

    // Audit: envelope.percentages
    await conn.query(SQL.auditWithDetails, [
      userId,
      'envelope.percentages',
      'envelope',
      String(userId),
      `Pourcentages ajustés (${items.length} enveloppe(s))`,
      JSON.stringify({ items })
    ]);
    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// 3) Archiver (soft delete)
export async function archiveEnvelope(userId: number, envelopeId: number) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Récupérer le nom pour l'alerte
    const [[envRow]]: any = await conn.query(
      `SELECT nom FROM enveloppes WHERE id=? AND utilisateur_id=? LIMIT 1`,
      [envelopeId, userId]
    );
    const envName = envRow?.nom as string | undefined;

    await conn.query(
      `UPDATE enveloppes SET actif=0, archived_at=NOW(), pourcentage=0
       WHERE id=? AND utilisateur_id=?`,
      [envelopeId, userId]
    );

    const [rows]: any = await conn.query(
      `SELECT id, pourcentage FROM enveloppes WHERE utilisateur_id=? AND actif=1`,
      [userId]
    );
    const total = rows.reduce((s: number, r: any) => s + Number(r.pourcentage), 0) || 1;
    for (const r of rows) {
      const scaled = Math.round((r.pourcentage / total) * 10000) / 100;
      await conn.query(`UPDATE enveloppes SET pourcentage=? WHERE id=?`, [scaled, r.id]);
    }

    // Alerte INFO: archivage
    await conn.query(SQL.insertAlert, [
      userId,
      'INFO',
      'Enveloppe archivée',
      envName ? `Enveloppe "${envName}" archivée` : `Enveloppe ${envelopeId} archivée`,
      envelopeId,
      null,
    ]);

    // Audit: envelope.archive
    await conn.query(SQL.auditWithDetails, [
      userId,
      'envelope.archive',
      'envelope',
      String(envelopeId),
      envName ? `Archivée: ${envName}` : `Archivée: #${envelopeId}`,
      JSON.stringify({ envelopeId })
    ]);

    await conn.commit();
    return { ok: true, archived: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// 4) Suppression dure (autorisé uniquement si aucune transaction)
export async function deleteEnvelopeHard(userId: number, envelopeId: number) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Récupérer nom pour l'alerte avant suppression
    const [[envRow]]: any = await conn.query(
      `SELECT nom FROM enveloppes WHERE id=? AND utilisateur_id=? LIMIT 1`,
      [envelopeId, userId]
    );
    const envName = envRow?.nom as string | undefined;
    const [[{ nb }]]: any = await conn.query(
      `SELECT COUNT(*) AS nb
       FROM allocations a
       JOIN transactions t ON t.id=a.transaction_id
       WHERE t.utilisateur_id=? AND a.enveloppe_id=?`,
      [userId, envelopeId]
    );
    if (nb > 0) throw new Error('Enveloppe liée à des transactions — archivez-la plutôt.');

    await conn.query(`DELETE FROM enveloppes WHERE id=? AND utilisateur_id=?`, [envelopeId, userId]);
    // Renormaliser les actives restantes à 100
    const [rows]: any = await conn.query(
      `SELECT id, pourcentage FROM enveloppes WHERE utilisateur_id=? AND actif=1`,
      [userId]
    );
    const total = rows.reduce((s: number, r: any) => s + Number(r.pourcentage), 0) || 0;
    if (total > 0) {
      for (const r of rows) {
        const scaled = Math.round((r.pourcentage / total) * 10000) / 100;
        await conn.query(`UPDATE enveloppes SET pourcentage=? WHERE id=?`, [scaled, r.id]);
      }
    }

    // Alerte INFO: suppression
    await conn.query(SQL.insertAlert, [
      userId,
      'INFO',
      'Enveloppe supprimée',
      envName ? `Enveloppe "${envName}" supprimée` : `Enveloppe ${envelopeId} supprimée`,
      envelopeId,
      null,
    ]);

    // Audit: envelope.delete
    await conn.query(SQL.auditWithDetails, [
      userId,
      'envelope.delete',
      'envelope',
      String(envelopeId),
      envName ? `Supprimée: ${envName}` : `Supprimée: #${envelopeId}`,
      JSON.stringify({ envelopeId })
    ]);

    await conn.commit();
    return { ok: true };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}


