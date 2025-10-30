import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { HistoryClient } from './HistoryClient';

export const dynamic = 'force-dynamic';

export interface EnrichedAuditLog {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string | null;
  created_at: string | Date;
  meta?: any; // Métadonnées JSON (ne pas afficher brut)
  // Données enrichies depuis les tables liées
  transaction_montant?: number | null;
  transaction_type?: string | null;
  transaction_service?: string | null;
  envelope_name?: string | null;
  envelope_budget?: number | null;
  service_name?: string | null;
  from_envelope?: string | null;
  to_envelope?: string | null;
  transfer_amount?: number | null;
}

async function getAuditLogs(userId: number) {
  const [rows] = await pool.query(
    `SELECT 
      al.id,
      al.user_id,
      al.action,
      al.entity,
      al.entity_id,
      al.details,
      al.created_at,
      al.meta,
      -- Enrichissement pour les transactions
      t.montant_total as transaction_montant,
      t.type as transaction_type,
      s.nom as transaction_service,
      -- Enrichissement pour les enveloppes
      e.nom as envelope_name,
      e.budget_mensuel as envelope_budget,
      -- Enrichissement pour les services
      srv.nom as service_name
    FROM audit_logs al
    LEFT JOIN transactions t ON al.entity = 'transaction' AND al.entity_id = CAST(t.id AS CHAR)
    LEFT JOIN services s ON t.service_id = s.id
    LEFT JOIN enveloppes e ON al.entity = 'envelope' AND al.entity_id = CAST(e.id AS CHAR)
    LEFT JOIN services srv ON al.entity = 'service' AND al.entity_id = CAST(srv.id AS CHAR)
    WHERE al.user_id = ?
    ORDER BY al.created_at DESC
    LIMIT 1000`,
    [userId]
  );

  // Parser les métadonnées JSON si nécessaire
  const enrichedLogs = (rows as any[]).map(row => {
    let meta = null;
    try {
      meta = row.meta ? JSON.parse(row.meta) : null;
    } catch (e) {
      // Ignore parsing errors
    }

    return {
      ...row,
      // Ajouter des données de transfert depuis meta si disponible
      from_envelope: meta?.from_envelope || null,
      to_envelope: meta?.to_envelope || null,
      transfer_amount: meta?.amount || null,
    };
  });

  return enrichedLogs as EnrichedAuditLog[];
}

export default async function HistoryPage() {
  const userId = await getUserIdOrThrow();
  const logs = await getAuditLogs(userId);

  return <HistoryClient logs={logs} />;
}

