'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { PoolConnection } from 'mysql2/promise';

const ServiceSchema = z.object({
  utilisateurId: z.number().positive(),
  nom: z.string().min(2).max(100),
});

export async function createService(raw: unknown) {
  const { utilisateurId, nom } = ServiceSchema.parse(raw);
  return tx(async (conn: PoolConnection) => {
    const [dup] = await conn.query('SELECT id FROM services WHERE utilisateur_id=? AND nom=? LIMIT 1', [utilisateurId, nom.trim()]);
    if (Array.isArray(dup) && dup[0]) throw new Error('Ce service existe déjà');
    const [res] = await conn.query('INSERT INTO services (utilisateur_id, nom, actif) VALUES (?,?,1)', [utilisateurId, nom.trim()]);
    revalidatePath('/services');
    revalidatePath('/income');
    return { id: (res as any).insertId as number };
  });
}

export async function updateServiceName(raw: unknown) {
  const input = z.object({
    utilisateurId: z.number().positive(),
    id: z.number().positive(),
    nom: z.string().min(2).max(100),
  }).parse(raw);

  return tx(async (conn: PoolConnection) => {
    await conn.query('UPDATE services SET nom=? WHERE id=? AND utilisateur_id=?', [input.nom.trim(), input.id, input.utilisateurId]);
    revalidatePath('/services');
    revalidatePath('/income');
    return { ok: true };
  });
}

export async function toggleServiceActive(raw: unknown) {
  const input = z.object({
    utilisateurId: z.number().positive(),
    id: z.number().positive(),
    actif: z.boolean(),
  }).parse(raw);

  return tx(async (conn: PoolConnection) => {
    await conn.query('UPDATE services SET actif=? WHERE id=? AND utilisateur_id=?', [input.actif ? 1 : 0, input.id, input.utilisateurId]);
    revalidatePath('/services');
    revalidatePath('/income');
    return { ok: true };
  });
}

export async function deleteService(raw: unknown) {
  const input = z.object({
    utilisateurId: z.number().positive(),
    id: z.number().positive(),
  }).parse(raw);

  return tx(async (conn: PoolConnection) => {
    // sécurité basique: empêcher suppression si référencé (facultatif)
    const [ref] = await conn.query('SELECT id FROM transactions WHERE service_id=? LIMIT 1', [input.id]);
    if (Array.isArray(ref) && ref[0]) throw new Error('Service référencé par des transactions – désactivez-le plutôt.');
    await conn.query('DELETE FROM services WHERE id=? AND utilisateur_id=?', [input.id, input.utilisateurId]);
    revalidatePath('/services');
    revalidatePath('/income');
    return { ok: true };
  });
}


