import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { ExpenseFormOptimized } from './ExpenseFormOptimized';

export const dynamic = 'force-dynamic';

type Env = { id:number; nom:string; solde_actuel:number; protegee:0|1 };

async function getEnvs(userId:number) {
  const [rows] = await pool.query('SELECT id, nom, solde_actuel, protegee FROM enveloppes WHERE utilisateur_id=? ORDER BY nom', [userId]);
  return rows as Env[];
}

export default async function ExpensePage() {
  const userId = await getUserIdOrThrow();
  const envs = await getEnvs(userId);
  const today = new Date().toISOString().slice(0,10);

  return (
    <Card className="max-w-3xl">
      <CardTitle>💸 Nouvelle dépense</CardTitle>
      <CardDescription>
        Répartissez le montant entre vos enveloppes avec l'allocateur visuel.
      </CardDescription>
      <ExpenseFormOptimized envs={envs} today={today} />
    </Card>
  );
}


