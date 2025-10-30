import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { tx } from '@/lib/db';
import type { PoolConnection } from 'mysql2/promise';

function rand(min:number, max:number) { return Math.floor(Math.random()*(max-min+1))+min; }
function pick<T>(arr:T[]) { return arr[Math.floor(Math.random()*arr.length)]; }

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = Number((session as any)?.user?.id ?? 0);
  if (!userId) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  await tx(async (conn: PoolConnection) => {
    // 1) Services (si vides)
    const [srows] = await conn.query('SELECT COUNT(*) AS n FROM services WHERE utilisateur_id=?', [userId]);
    if ((srows as any[])[0].n === 0) {
      await conn.query('INSERT INTO services (utilisateur_id, nom, actif) VALUES (?,?,1),(?,?,1),(?,?,1)', [
        userId, 'Tresses', userId, 'Coiffure', userId, 'Vente produits'
      ]);
    }
    // 2) Quelques transactions des 30 derniers jours
    for (let d=0; d<30; d++) {
      const date = new Date(); date.setDate(date.getDate()-d);
      const ymd = date.toISOString().slice(0,10);

      // 1 à 3 entrées
      const nIn = rand(1,3);
      for (let i=0;i<nIn;i++) {
        const montant = rand(5000, 50000);
        await conn.query(
          'INSERT INTO transactions (utilisateur_id, type, montant_total, description, service_id, date_transaction) VALUES (?,?,?,?,?,?)',
          [userId, 'ENTREE', montant, 'Vente', null, ymd]
        );
        const [txid] = await conn.query('SELECT LAST_INSERT_ID() AS id'); const id = (txid as any[])[0].id as number;
        const [envsR] = await conn.query('SELECT id, pourcentage FROM enveloppes WHERE utilisateur_id=?', [userId]);
        for (const e of envsR as any[]) {
          const part = Math.round(montant * (Number(e.pourcentage)||0) / 100);
          if (part>0) {
            await conn.query('INSERT INTO allocations (transaction_id, enveloppe_id, montant, type_allocation) VALUES (?,?,?,"ENTREE")', [id, e.id, part]);
            await conn.query('UPDATE enveloppes SET solde_actuel = solde_actuel + ? WHERE id=?', [part, e.id]);
          }
        }
      }

      // 0 ou 1 dépense
      if (Math.random() < 0.8) {
        const [envsR] = await conn.query('SELECT id, solde_actuel FROM enveloppes WHERE utilisateur_id=? ORDER BY RAND() LIMIT 2', [userId]);
        const envs = envsR as any[];
        if (envs.length) {
          const total = rand(3000, 20000);
          await conn.query(
            'INSERT INTO transactions (utilisateur_id, type, montant_total, description, service_id, date_transaction) VALUES (?,?,?,?,?,?)',
            [userId, 'SORTIE', total, 'Achat', null, ymd]
          );
          const [txid] = await conn.query('SELECT LAST_INSERT_ID() AS id'); const id = (txid as any[])[0].id as number;
          // répartir sur 1-2 enveloppes
          let rest = total;
          for (const e of envs) {
            const m = envs.length === 1 ? rest : Math.max(0, rand(1000, rest));
            if (m>0) {
              await conn.query('INSERT INTO allocations (transaction_id, enveloppe_id, montant, type_allocation) VALUES (?,?,?,"SORTIE")', [id, e.id, m]);
              await conn.query('UPDATE enveloppes SET solde_actuel = solde_actuel - ? WHERE id=?', [m, e.id]);
              rest -= m;
            }
            if (rest<=0) break;
          }
        }
      }
    }
  });

  return NextResponse.json({ ok: true });
}



