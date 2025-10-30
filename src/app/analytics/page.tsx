import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import { AnalyticsClient } from './AnalyticsClient';

export const dynamic = 'force-dynamic';

function monthBounds(ym: string) {
  // ym = '2025-10'
  const [y, m] = ym.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0)); // dernier jour
  const s = start.toISOString().slice(0, 10);
  const e = end.toISOString().slice(0, 10);
  return { s, e };
}

function prevYm(ym: string) {
  let [y, m] = ym.split('-').map(Number);
  m -= 1;
  if (m === 0) { m = 12; y -= 1; }
  return `${y}-${String(m).padStart(2,'0')}`;
}

async function getData(userId: number, ym: string) {
  const { s, e } = monthBounds(ym);
  const { s: ps, e: pe } = monthBounds(prevYm(ym));

  // Obtenir les 6 derniers mois pour l'évolution
  const evolutionMonths = [];
  for (let i = 5; i >= 0; i--) {
    let [y, m] = ym.split('-').map(Number);
    m -= i;
    if (m <= 0) {
      m += 12;
      y -= 1;
    }
    evolutionMonths.push(`${y}-${String(m).padStart(2, '0')}`);
  }

  const [[ov], [byEnv], [prev], evolutionRows] = await Promise.all([
    pool.query(SQL.monthlyOverview, [userId, s, e]),
    pool.query(SQL.monthlyByEnvelope, [userId, s, e]),
    pool.query(SQL.prevMonthTotals, [userId, ps, pe]),
    // Évolution des 6 derniers mois
    pool.query(`
      SELECT 
        DATE_FORMAT(date_transaction, '%Y-%m') as ym,
        COALESCE(SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END), 0) as revenus,
        COALESCE(SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END), 0) as depenses
      FROM transactions
      WHERE utilisateur_id = ?
        AND date_transaction >= ?
        AND date_transaction <= ?
      GROUP BY DATE_FORMAT(date_transaction, '%Y-%m')
      ORDER BY ym ASC
    `, [userId, monthBounds(evolutionMonths[0]).s, e])
  ]);

  const overview = (ov as any[]).find(r => r.ym === ym) ?? { revenus: 0, depenses: 0 };
  const rows = byEnv as { id:number; nom:string; entrees:number|null; sorties:number|null }[];
  const p = (prev as any[])[0] ?? { revenus: 0, depenses: 0 };

  const revenus = Math.round(Number(overview.revenus || 0));
  const depenses = Math.round(Number(overview.depenses || 0));
  const marge = revenus - depenses;

  const prevRevenus = Math.round(Number(p.revenus || 0));
  const prevDepenses = Math.round(Number(p.depenses || 0));

  const deltaRev = prevRevenus ? Math.round(((revenus - prevRevenus) / prevRevenus) * 100) : (revenus ? 100 : 0);
  const deltaDep = prevDepenses ? Math.round(((depenses - prevDepenses) / prevDepenses) * 100) : (depenses ? 100 : 0);

  // Données d'évolution réelles
  const evolutionMap = new Map();
  (evolutionRows as any[]).forEach(row => {
    evolutionMap.set(row.ym, {
      revenus: Math.round(Number(row.revenus || 0)),
      depenses: Math.round(Number(row.depenses || 0))
    });
  });

  const evolutionData = evolutionMonths.map(month => {
    const data = evolutionMap.get(month) || { revenus: 0, depenses: 0 };
    const [y, m] = month.split('-');
    return {
      month: `${m}/${y}`,
      revenus: data.revenus,
      depenses: data.depenses
    };
  });

  // recommandations simples
  const heavy = rows
    .map(r => ({ nom: r.nom, sorties: Math.round(Number(r.sorties || 0)) }))
    .sort((a,b) => b.sorties - a.sorties)
    .slice(0, 3);

  const recs: string[] = [];
  if (deltaDep > 10) recs.push(`Les dépenses augmentent de ${deltaDep}% vs mois précédent — vérifier les catégories à fort poids.`);
  if (marge > 0 && deltaRev > 0) recs.push(`Marge positive (${marge.toLocaleString('fr-GA')} XAF) et revenus en hausse (${deltaRev}%). Augmenter l'épargne ?`);
  if (heavy[0]?.sorties > 0) recs.push(`Catégories les plus dépensières : ${heavy.map(h => `${h.nom} (${h.sorties.toLocaleString('fr-GA')} XAF)`).join(', ')}.`);

  return { ym, revenus, depenses, marge, deltaRev, deltaDep, rows, recs, evolutionData };
}

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ ym?: string }> }) {
  const userId = await getUserIdOrThrow();
  const today = new Date();
  const curYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const sp = await searchParams;
  const ym = sp?.ym || curYm;

  const data = await getData(userId, ym);

  return <AnalyticsClient data={data} />;
}
