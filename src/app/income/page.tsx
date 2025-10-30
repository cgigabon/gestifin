import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import { IncomeFormOptimized } from './IncomeFormOptimized';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

async function getServices(userId: number) {
  const [rows] = await pool.query(SQL.listUserServices, [userId]);
  return rows as { id: number; nom: string }[];
}

async function getEnvelopePercents(userId: number) {
  const [rows] = await pool.query('SELECT id, nom, pourcentage FROM enveloppes WHERE utilisateur_id=? ORDER BY nom', [userId]);
  return rows as { id:number; nom:string; pourcentage:number }[];
}

export default async function IncomePage() {
  const userId = await getUserIdOrThrow();
  const services = await getServices(userId);
  const envelopes = await getEnvelopePercents(userId);
  const today = new Date().toISOString().slice(0,10);

  return (
    <Card className="max-w-2xl">
      <CardTitle>💰 Nouvelle entrée de revenu</CardTitle>
      <CardDescription>
        Répartition automatique selon vos pourcentages d'enveloppes.
      </CardDescription>
      <IncomeFormOptimized 
        services={services} 
        envelopes={envelopes} 
        today={today} 
      />
    </Card>
  );
}

