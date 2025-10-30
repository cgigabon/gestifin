import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { closeMonth } from '@/server/rollover';
import { CloseMonthClient } from './CloseMonthClient';

export const dynamic = 'force-dynamic';

type Env = { id:number; nom:string; solde_actuel:number; budget_mensuel:number; pourcentage:number; protegee:0|1 };

async function getEnvs(userId:number) {
  const [rows] = await pool.query(
    'SELECT id, nom, solde_actuel, budget_mensuel, pourcentage, protegee FROM enveloppes WHERE utilisateur_id=? ORDER BY nom',
    [userId]
  );
  return rows as Env[];
}

export default async function CloseMonthPage() {
  const userId = await getUserIdOrThrow();
  const envs = await getEnvs(userId);

  const today = new Date();
  const ymDefault = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;

  async function action(formData: FormData) {
    'use server';
    const ym = String(formData.get('ym') || '').slice(0,7);
    const mode = String(formData.get('mode') || 'carry') as 'carry'|'sweep';
    const sweepToEnvelopeId = Number(formData.get('sweepTo') || 0) || undefined;

    // collecter éventuels ajustements budgets/%
    const ajustes: { enveloppeId:number; budgetMensuel?:number; pourcentage?:number }[] = [];
    for (const e of envs) {
      const bRaw = formData.get(`b_${e.id}`);
      const pRaw = formData.get(`p_${e.id}`);
      const aj:any = { enveloppeId: e.id };
      if (bRaw && String(bRaw) !== '') aj.budgetMensuel = Number(bRaw);
      if (pRaw && String(pRaw) !== '') aj.pourcentage = Number(pRaw);
      if (aj.budgetMensuel !== undefined || aj.pourcentage !== undefined) ajustes.push(aj);
    }

    await closeMonth({ utilisateurId: userId, ym, mode, sweepToEnvelopeId, ajustes: ajustes.length ? ajustes : undefined });
  }

  return (
    <CloseMonthClient
      envs={envs}
      ymDefault={ymDefault}
      action={action}
    />
  );
}

// --- petit bouton client pour le loader ---
 


