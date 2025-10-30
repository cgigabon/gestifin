import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import { EnvelopeDetailClient } from './EnvelopeDetailClient';

export const dynamic = 'force-dynamic';

async function getData(userId:number, id:number, page:number) {
  const size = 20;
  const offset = (page-1) * size;
  const [[envRows], [countRows], [txRows], [depTotal], [monthlyRows]] = await Promise.all([
    pool.query(SQL.envelopeById, [userId, id]),
    pool.query(SQL.countEnvelopeTransactions, [userId, id]),
    pool.query(SQL.envelopeTransactions, [userId, id, size, offset]),
    pool.query(SQL.envelopeTotalExpenses, [userId, id]),
    // 6 derniers mois d'agrégats
    (async ()=>{
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth()-5, 1);
      const end = new Date(now.getFullYear(), now.getMonth()+1, 0);
      const s = `${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-01`;
      const e = `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
      return pool.query(SQL.envelopeMonthlyAggregates, [userId, id, s, e]);
    })(),
  ]);
  const env = (envRows as any[])[0] as { id:number; nom:string; budget_mensuel:number; solde_actuel:number; pourcentage:number; protegee:0|1 } | undefined;
  const total = Number((countRows as any[])[0]?.n || 0);
  const txs = txRows as { id:number; type:'ENTREE'|'SORTIE'|'TRANSFERT'; montant_total:number; description:string|null; date_transaction:string; allocation_montant:number }[];
  const sommeDep = Math.round(Number((depTotal as any[])[0]?.depenses || 0));
  const monthly = monthlyRows as any[];
  return { env, txs, page, pages: Math.max(1, Math.ceil(total/20)), sommeDep, monthly };
}

export default async function EnvelopeDetail({ params, searchParams }: { params: Promise<{ id:string }>, searchParams: Promise<{ page?:string }> }) {
  const userId = await getUserIdOrThrow();
  const { id: paramId } = await params;
  const id = Number(paramId);
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page || 1));
  const { env, txs, pages, sommeDep, monthly } = await getData(userId, id, page);

  if (!env) {
    return <div style={{maxWidth:800, margin:'24px auto', padding:16}}><b>Enveloppe introuvable</b></div>;
  }

  return (
    <EnvelopeDetailClient
      env={env}
      txs={txs}
      sommeDep={sommeDep}
      monthly={monthly}
      page={page}
      pages={pages}
    />
  );
}


