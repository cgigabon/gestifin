'use client';

import { useEffect, useMemo, useState } from 'react';

type EnvRow = { id: number; nom: string; solde_actuel: number; budget_mensuel: number; protegee: 0|1 };

export function Allocator({ envs }: { envs: EnvRow[] }) {
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [amounts, setAmounts] = useState<Record<number, number>>({});

  useEffect(() => {
    // initialize amounts to 0
    const init: Record<number, number> = {};
    for (const e of envs) init[e.id] = 0;
    setAmounts(init);
  }, [envs]);

  const totalSelected = useMemo(() => {
    return Object.entries(amounts).reduce((s, [id, m]) => s + (selected[Number(id)] ? Number(m || 0) : 0), 0);
  }, [amounts, selected]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <label>Montant total de la dépense
        <input type="number" name="montant_total" min={1} step="1" required />
      </label>

      <h3>Choisir les enveloppes à affecter</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th></th><th>Enveloppe</th><th>Solde actuel</th><th>Montant</th></tr></thead>
        <tbody>
          {envs.map(e => {
            const isOn = !!selected[e.id];
            return (
              <tr key={e.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Utiliser ${e.nom}`}
                    checked={isOn}
                    onChange={(ev) => setSelected(prev => ({ ...prev, [e.id]: ev.target.checked }))}
                  />
                </td>
                <td>{e.nom}{e.protegee ? ' 🔒' : ''}</td>
                <td>{Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF</td>
                <td>
                  <input
                    type="number"
                    name={`env_${e.id}`}
                    min={0}
                    step="1"
                    value={amounts[e.id] ?? 0}
                    onChange={(ev) => setAmounts(prev => ({ ...prev, [e.id]: Number(ev.target.value || 0) }))}
                    disabled={!isOn}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ color: '#555' }}>
        Total sélectionné: <b>{Math.round(totalSelected).toLocaleString('fr-GA')} XAF</b>
      </div>
    </div>
  );
}






