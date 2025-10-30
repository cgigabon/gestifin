import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { ServicesClient } from './ServicesClient';

type Service = { id:number; nom:string; actif:0|1; created_at:string; usage_count: number };

export const dynamic = 'force-dynamic';

async function getServices(userId: number) {
  // Récupérer les services avec le nombre de transactions associées
  const [rows] = await pool.query(
    `SELECT 
      s.id, 
      s.nom, 
      s.actif, 
      s.created_at,
      COUNT(DISTINCT t.id) as usage_count
    FROM services s
    LEFT JOIN transactions t ON t.service_id = s.id
    WHERE s.utilisateur_id = ?
    GROUP BY s.id, s.nom, s.actif, s.created_at
    ORDER BY s.actif DESC, s.nom ASC`,
    [userId]
  );
  return rows as Service[];
}

export default async function ServicesPage() {
  const userId = await getUserIdOrThrow();
  const services = await getServices(userId);

  return <ServicesClient services={services} userId={userId} />;
}
