'use server';

import { z } from 'zod';
import { tx } from '@/lib/db';

// ❗️Rien d’exporté ici sauf la fonction async plus bas
const Envelope = z.object({
  nom: z.string().min(2),
  budgetMensuel: z.coerce.number().nonnegative(),
  pourcentage: z.coerce.number().min(0).max(100),
  protegee: z.boolean().default(false),
  soldeInitial: z.coerce.number().nonnegative().default(0),
  couleur: z.string().optional(),
  icone: z.string().optional(),
});

const SaveOnboardingInput = z.object({
  utilisateurId: z.coerce.number().positive(),
  envelopes: z.array(Envelope).min(1),
});

export async function saveOnboarding(raw: unknown): Promise<{ ok: true }> {
  const input = SaveOnboardingInput.parse(raw);

  return tx(async (conn) => {
    await conn.query(
      'DELETE FROM allocations WHERE enveloppe_id IN (SELECT id FROM enveloppes WHERE utilisateur_id=?)',
      [input.utilisateurId]
    );
    await conn.query('DELETE FROM enveloppes WHERE utilisateur_id=?', [input.utilisateurId]);

    for (const e of input.envelopes) {
      await conn.query(
        `INSERT INTO enveloppes
         (utilisateur_id, nom, budget_mensuel, pourcentage, protegee, solde_actuel, solde_initial, couleur, icone)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          input.utilisateurId,
          e.nom.trim(),
          e.budgetMensuel,
          e.pourcentage,
          e.protegee ? 1 : 0,
          e.soldeInitial,
          e.soldeInitial,
          e.couleur ?? '#6B7280',
          e.icone ?? '📁',
        ],
      );
    }

    await conn.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, meta) VALUES (?,?,?,?,?)',
      [input.utilisateurId, 'onboarding.save', 'enveloppes', String(input.utilisateurId), JSON.stringify({ count: input.envelopes.length })],
    );

    return { ok: true };
  });
}
