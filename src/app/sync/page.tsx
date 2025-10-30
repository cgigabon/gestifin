import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { syncCash as reconcileCash } from '@/server/sync';
import { SyncForm } from './SyncForm';

type SyncRow = {
  id:number; date_synchro:string; cash_declare:number; net_calcule:number; ecart:number;
};

async function getTodayComputed(userId:number) {
  const [[revRows], [expRows]] = await Promise.all([
    pool.query("SELECT COALESCE(SUM(montant_total),0) AS total FROM transactions WHERE utilisateur_id=? AND type='ENTREE' AND date_transaction=CURDATE()", [userId]),
    pool.query("SELECT COALESCE(SUM(montant_total),0) AS total FROM transactions WHERE utilisateur_id=? AND type='SORTIE' AND date_transaction=CURDATE()", [userId]),
  ]);
  const revenus = Number((revRows as any[])[0].total || 0);
  const depenses = Number((expRows as any[])[0].total || 0);
  return { revenus, depenses, net: revenus - depenses };
}

async function getHistory(userId:number) {
  const [rows] = await pool.query(
    'SELECT id, date_synchro, cash_declare, net_calcule, ecart FROM synchronisations WHERE utilisateur_id=? ORDER BY date_synchro DESC, id DESC LIMIT 15',
    [userId]
  );
  return rows as SyncRow[];
}

export default async function SyncPage() {
  const userId = await getUserIdOrThrow();
  const today = new Date().toISOString().slice(0,10);
  const { revenus, depenses, net } = await getTodayComputed(userId);
  const history = await getHistory(userId);

  async function action(formData: FormData) {
    'use server';
    const date = String(formData.get('date') || '');
    const cash = Number(formData.get('cash') || 0);
    await reconcileCash({ utilisateurId: userId, date: date || undefined, cashDeclare: cash });
  }

  return (
    <div className="grid gap-6 max-w-3xl">
      <Card>
        <CardTitle>Synchronisation quotidienne</CardTitle>
        <CardDescription>Compare le cash réel en main au net calculé par le système.</CardDescription>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-zinc-600">Entrées (aujourd’hui)</div>
            <div className="text-xl font-semibold">{Math.round(revenus).toLocaleString('fr-GA')} XAF</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-zinc-600">Dépenses (aujourd’hui)</div>
            <div className="text-xl font-semibold">{Math.round(depenses).toLocaleString('fr-GA')} XAF</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-zinc-600">Net calculé (aujourd’hui)</div>
            <div className={`text-xl font-semibold ${net<0?'text-red-700':''}`}>
              {Math.round(net).toLocaleString('fr-GA')} XAF
            </div>
          </div>
        </div>

        <SyncForm today={today} net={net} action={action} />
      </Card>

      <Card>
        <CardTitle>Historique des synchronisations</CardTitle>
        <CardDescription>Derniers 15 jours</CardDescription>
        <Table>
          <THead>
            <TR><TH>Date</TH><TH>Cash déclaré</TH><TH>Net calculé</TH><TH>Écart</TH><TH>Statut</TH></TR>
          </THead>
          <TBody>
            {history.map(h=>{
              const stat = h.ecart === 0 ? <Badge variant="success">Parfait</Badge>
                : Math.abs(h.ecart) <= 500 ? <Badge variant="warning">Acceptable</Badge>
                : <Badge variant="destructive">Écart</Badge>;
              return (
                <TR key={h.id}>
                  <TD>{h.date_synchro}</TD>
                  <TD>{Math.round(h.cash_declare).toLocaleString('fr-GA')} XAF</TD>
                  <TD>{Math.round(h.net_calcule).toLocaleString('fr-GA')} XAF</TD>
                  <TD className={h.ecart===0 ? '' : 'text-amber-700'}>
                    {Math.round(h.ecart).toLocaleString('fr-GA')} XAF
                  </TD>
                  <TD>{stat}</TD>
                </TR>
              );
            })}
            {history.length===0 && <TR><TD colSpan={5} className="text-center">Aucune synchro enregistrée.</TD></TR>}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}


