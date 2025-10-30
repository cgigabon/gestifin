'use client';

import { useEffect } from 'react';

type Env = { id:number; nom:string; pourcentage:number };

export function AllocationPreview({ envelopes }: { envelopes: Env[] }) {
  useEffect(() => {
    const montantEl = document.querySelector('input[name="montant"]') as HTMLInputElement | null;
    if (!montantEl) return;
    const handler = () => {
      const montant = Number(montantEl.value || 0);
      for (const e of envelopes) {
        const val = Math.round((montant * (Number(e.pourcentage) || 0))) / 100;
        const el = document.getElementById(`alloc_${e.id}`);
        if (el) el.textContent = `${val.toLocaleString('fr-GA')} XAF`;
      }
    };
    montantEl.addEventListener('input', handler);
    handler();
    return () => {
      montantEl.removeEventListener('input', handler);
    };
  }, [envelopes]);

  return (
    <div style={{marginTop:12, padding:12, border:'1px dashed #ccc', borderRadius:8}}>
      <b>Prévisualisation de la répartition</b>
      <div style={{display:'grid', gap:6, marginTop:8}}>
        <Row headers />
        <Row values envelopes={envelopes} />
      </div>
    </div>
  );
}

function Row({ headers, values, envelopes }: { headers?: boolean; values?: boolean; envelopes?: Env[] }) {
  if (headers) {
    return (
      <div style={{display:'grid', gridTemplateColumns:'1fr 120px 160px', gap:8, fontSize:12, color:'#555'}}>
        <div>Enveloppe</div>
        <div>%</div>
        <div>Montant estimé</div>
      </div>
    );
  }
  const list = envelopes || [];
  return (
    <div>
      {list.map(e => (
        <Line key={e.id} id={e.id} name={e.nom} percent={e.pourcentage} />
      ))}
    </div>
  );
}

function Line({ id, name, percent }: { id:number; name:string; percent:number }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 120px 160px', gap:8, alignItems:'center'}}>
      <div>{name}</div>
      <div>{percent}%</div>
      <div id={`alloc_${id}`}>0 XAF</div>
    </div>
  );
}


