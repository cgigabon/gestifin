import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
// Use the standalone build to avoid filesystem font lookups (Helvetica.afm)
// This variant embeds standard fonts in the bundle
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';

function monthBounds(ym: string) {
  const [y, m] = ym.split('-').map(Number);
  const start = new Date(Date.UTC(y, m-1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  return { s: start.toISOString().slice(0,10), e: end.toISOString().slice(0,10) };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ym = url.searchParams.get('ym');
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) {
    return NextResponse.json({ error: 'Paramètre ym attendu (YYYY-MM)' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId = Number((session as any)?.user?.id ?? 0);
  if (!userId) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const { s, e } = monthBounds(ym);
  const [[ov], [byEnv], [alerts]] = await Promise.all([
    pool.query(SQL.monthlyOverview, [userId, s, e]),
    pool.query(SQL.monthlyByEnvelope, [userId, s, e]),
    pool.query('SELECT type, titre, description, created_at FROM alertes WHERE utilisateur_id=? AND DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC LIMIT 50', [userId, s, e]),
  ]);

  const overview = (ov as any[]).find(r => r.ym === ym) ?? { revenus: 0, depenses: 0 };
  const rows = byEnv as { id:number; nom:string; entrees:number|null; sorties:number|null }[];
  const al = alerts as { type:string; titre:string; description:string; created_at:string }[];

  // Crée le PDF en mémoire
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer)=>chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', ()=> resolve(Buffer.concat(chunks))));

  // --- Contenu ---
  doc.fontSize(18).text(`Rapport financier — ${ym}`, { align: 'center' });
  doc.moveDown();

  const revenus = Math.round(Number(overview.revenus||0));
  const depenses = Math.round(Number(overview.depenses||0));
  const marge = revenus - depenses;

  doc.fontSize(12);
  doc.text(`Revenus : ${revenus.toLocaleString('fr-GA')} XAF`);
  doc.text(`Dépenses : ${depenses.toLocaleString('fr-GA')} XAF`);
  doc.text(`Marge : ${marge.toLocaleString('fr-GA')} XAF`, { continued: false });
  doc.moveDown();

  doc.fontSize(14).text('Détails par enveloppe');
  doc.moveDown(0.5);
  doc.fontSize(11);
  rows.forEach(r => {
    const eIn = Math.round(Number(r.entrees||0)).toLocaleString('fr-GA');
    const eOut = Math.round(Number(r.sorties||0)).toLocaleString('fr-GA');
    doc.text(`• ${r.nom} — Entrées: ${eIn} XAF — Dépenses: ${eOut} XAF`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Alertes du mois');
  doc.moveDown(0.5);
  if (al.length === 0) {
    doc.fontSize(11).text('Aucune alerte.');
  } else {
    al.forEach(a => {
      doc.fontSize(11).text(`• [${a.type}] ${a.titre} — ${new Date(a.created_at).toLocaleString('fr-GA')}`);
      if (a.description) doc.fillColor('#555').text(`   ${a.description}`).fillColor('#000');
    });
  }

  doc.end();
  const buf = await done;

  return new NextResponse(buf as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="rapport-${ym}.pdf"`,
      'Content-Length': String(buf.length),
    }
  });
}



