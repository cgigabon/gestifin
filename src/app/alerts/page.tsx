import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { AlertsClient } from './AlertsClient';

export const dynamic = 'force-dynamic';

export default async function AlertsPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const userId = await getUserIdOrThrow();
  const sp = await searchParams;
  const filter = (sp?.f || 'all') as string;
  
  const [rows] = await pool.query(
    'SELECT id, type, titre, description, created_at, lue FROM alertes WHERE utilisateur_id=? ORDER BY created_at DESC LIMIT 300',
    [userId]
  );
  
  const alerts = rows as { id:number; type:'CRITIQUE'|'ATTENTION'|'INFO'; titre:string; description:string|null; created_at:string; lue:0|1 }[];

  return <AlertsClient alerts={alerts} filter={filter} />;
}


