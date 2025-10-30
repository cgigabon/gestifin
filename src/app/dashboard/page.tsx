import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { DashboardClient } from './DashboardClient';

type Env = { id:number; nom:string; budget_mensuel:number; pourcentage:number; solde_actuel:number; protegee:0|1 };
type Tx = { id:number; type:'ENTREE'|'SORTIE'|'TRANSFERT'; montant_total:number; description:string|null; date_transaction:string };
type Al = { id:number; type:'CRITIQUE'|'ATTENTION'|'INFO'; titre:string; description:string|null; created_at:string };

async function getData(userId:number) {
  const [[envRows], [txRows], [alertRows], [overview], [depenseTotals], [evolutionData]] = await Promise.all([
    pool.query('SELECT id, nom, budget_mensuel, pourcentage, solde_actuel, protegee FROM enveloppes WHERE utilisateur_id=? ORDER BY protegee DESC, nom', [userId]),
    pool.query('SELECT id, type, montant_total, description, date_transaction FROM transactions WHERE utilisateur_id=? ORDER BY date_transaction DESC, id DESC LIMIT 10', [userId]),
    pool.query('SELECT id, type, titre, description, created_at FROM alertes WHERE utilisateur_id=? AND lue=0 ORDER BY created_at DESC LIMIT 5', [userId]),
    pool.query(`SELECT
      (SELECT COALESCE(SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END),0) FROM transactions WHERE utilisateur_id=? AND MONTH(date_transaction)=MONTH(CURDATE()) AND YEAR(date_transaction)=YEAR(CURDATE())) AS revenus,
      (SELECT COALESCE(SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END),0) FROM transactions WHERE utilisateur_id=? AND MONTH(date_transaction)=MONTH(CURDATE()) AND YEAR(date_transaction)=YEAR(CURDATE())) AS depenses`, [userId, userId]),
    pool.query(`SELECT a.enveloppe_id AS id, COALESCE(SUM(CASE WHEN t.type='SORTIE' THEN a.montant ELSE 0 END),0) AS depenses
                FROM allocations a JOIN transactions t ON t.id=a.transaction_id
                WHERE t.utilisateur_id=? GROUP BY a.enveloppe_id`, [userId]),
    // Données d'évolution des 7 derniers jours
    pool.query(`
      SELECT 
        DATE(date_transaction) as date,
        COALESCE(SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END), 0) as revenus,
        COALESCE(SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END), 0) as depenses
      FROM transactions
      WHERE utilisateur_id=? 
        AND date_transaction >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(date_transaction)
      ORDER BY DATE(date_transaction) ASC
    `, [userId])
  ]);
  
  const envs = envRows as Env[];
  const depByEnv = Object.fromEntries((depenseTotals as any[]).map((r:any)=>[r.id, Math.round(Number(r.depenses||0))]));
  const txs = txRows as Tx[];
  const alerts = alertRows as Al[];
  const rev = Math.round(Number((overview as any[])[0]?.revenus || 0));
  const dep = Math.round(Number((overview as any[])[0]?.depenses || 0));
  
  // Calculer le solde pour chaque jour basé sur les transactions cumulées
  const evolution = evolutionData as Array<{ date: Date; revenus: number; depenses: number }>;
  
  return { envs, depByEnv, txs, alerts, rev, dep, marge: rev - dep, evolution };
}

export default async function DashboardPage() {
  const userId = await getUserIdOrThrow();
  const { envs, depByEnv, txs, alerts, rev, dep, marge, evolution } = await getData(userId);

  return <DashboardClient 
    envs={envs} 
    depByEnv={depByEnv} 
    txs={txs} 
    alerts={alerts} 
    rev={rev} 
    dep={dep} 
    marge={marge}
    evolution={evolution}
  />;
}
