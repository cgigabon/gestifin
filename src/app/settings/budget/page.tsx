import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { addEnvelope, applyPercentages, archiveEnvelope, deleteEnvelopeHard } from '@/server/budget';
import { revalidatePath } from 'next/cache';
import { BudgetSettingsClient } from './BudgetSettingsClient';

export const dynamic = 'force-dynamic';

type Env = { id:number; nom:string; budget_mensuel:number; pourcentage:number; protegee:0|1; solde_initial:number };

async function getEnvs(userId:number) {
  const [rows] = await pool.query(
    'SELECT id, nom, budget_mensuel, pourcentage, protegee, solde_initial FROM enveloppes WHERE utilisateur_id=? ORDER BY protegee DESC, nom',
    [userId]
  );
  return rows as Env[];
}

export default async function BudgetSettingsPage() {
  const userId = await getUserIdOrThrow();
  const envs = await getEnvs(userId);

  async function saveAction(formData: FormData) {
    'use server';
    const updates: Array<{ id:number; budget:number; percent:number; protegee:boolean; solde:number }> = [];
    for (const e of envs) {
      const b = Number(formData.get(`b_${e.id}`) || 0);
      const p = Number(formData.get(`p_${e.id}`) || 0);
      const s = Number(formData.get(`s_${e.id}`) || 0);
      const prot = formData.get(`prot_${e.id}`) != null; // checkbox present only when checked
      updates.push({ id: e.id, budget: b, percent: p, protegee: prot, solde: s });
    }
    // Écritures budgets / protégée / solde initial (les % seront gérés par applyPercentages)
    for (const u of updates) {
      await pool.query('UPDATE enveloppes SET budget_mensuel=?, pourcentage=?, protegee=?, solde_initial=? WHERE id=? AND utilisateur_id=?', [
        u.budget, u.percent, u.protegee ? 1 : 0, u.solde, u.id, userId,
      ]);
    }
    revalidatePath('/settings/budget');
  }

  async function applyPercentsAction(formData: FormData) {
    'use server';
    const items: { id: number; pourcentage: number }[] = [];
    for (const [key, value] of formData.entries()) {
      if (typeof key === 'string' && key.startsWith('p_')) {
        const idStr = key.slice(2);
        const id = Number(idStr);
        if (!Number.isNaN(id)) {
          const pct = Number(value as string);
          items.push({ id, pourcentage: Number.isFinite(pct) ? pct : 0 });
        }
      }
    }
    if (items.length === 0) return;
    await applyPercentages(userId, { items });
    revalidatePath('/settings/budget');
  }

  async function addEnvelopeAction(formData: FormData) {
    'use server';
    const nom = String(formData.get('nom') || '').trim();
    const pourcentage = Number(formData.get('pourcentage') || 0);
    const budgetMensuel = Number(formData.get('budgetMensuel') || 0);
    const protegee = formData.get('protegee') != null;
    await addEnvelope(userId, { nom, pourcentage, budgetMensuel, protegee });
    revalidatePath('/settings/budget');
  }

  async function archiveAction(formData: FormData) {
    'use server';
    const id = Number(formData.get('id') || 0);
    await archiveEnvelope(userId, id);
    revalidatePath('/settings/budget');
  }

  async function deleteHardAction(formData: FormData) {
    'use server';
    const id = Number(formData.get('id') || 0);
    await deleteEnvelopeHard(userId, id);
    revalidatePath('/settings/budget');
  }

  return (
    <BudgetSettingsClient
      envs={envs}
      saveAction={saveAction}
      applyPercentsAction={applyPercentsAction}
      addEnvelopeAction={addEnvelopeAction}
      archiveAction={archiveAction}
      deleteHardAction={deleteHardAction}
    />
  );
}


