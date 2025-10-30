'use client';
import * as React from 'react';
import { useToast } from '@/components/toast';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export function ExpenseClient({ envs, today, action }: any) {
  const toast = useToast();
  const [rows, setRows] = React.useState<Array<{ id:string; enveloppeId:string; montant:string }>>([
    { id: crypto.randomUUID(), enveloppeId: '', montant: '' },
  ]);

  const addRow = () => setRows(s => [...s, { id: crypto.randomUUID(), enveloppeId:'', montant:'' }]);
  const removeRow = (id:string) => setRows(s => s.length>1 ? s.filter(r=>r.id!==id) : s);

  const clientAction = async (formData: FormData) => {
    try {
      const allocations = rows
        .map(r => ({ enveloppeId: Number(r.enveloppeId), montant: Number(r.montant) }))
        .filter(a => a.enveloppeId && a.montant>0);
      formData.set('allocations', JSON.stringify(allocations));
      await action(formData);
      toast('Dépense enregistrée ✅');
      setRows([{ id: crypto.randomUUID(), enveloppeId:'', montant:'' }]);
      (document.querySelector('form') as HTMLFormElement | null)?.reset();
    } catch (e:any) {
      toast(e?.message || 'Erreur');
    }
  };

  return (
    <form action={clientAction as any} className="grid gap-3 mt-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" defaultValue={today} />
        </div>
        <div>
          <Label>Description</Label>
          <Input name="description" placeholder="facultatif" />
        </div>
      </div>

      <div className="rounded-3xl border p-3">
        <div className="mb-2 text-sm font-medium">Répartition</div>
        <div className="grid gap-3">
          {rows.map((r: any) => (
            <div key={r.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-7">
                <Label className="sr-only">Enveloppe</Label>
                <Select
                  value={r.enveloppeId}
                  onValueChange={(v)=> setRows(s=> s.map(x => x.id===r.id ? {...x, enveloppeId:v} : x))}
                >
                  <SelectTrigger><SelectValue placeholder="Choisir une enveloppe" /></SelectTrigger>
                  <SelectContent>
                    {envs.map((e:any)=>(
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.nom} — solde {Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF {e.protegee ? '🔒':''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4">
                <Label className="sr-only">Montant</Label>
                <Input
                  type="number" min={1} step="1" placeholder="Montant"
                  value={r.montant}
                  onChange={(e)=> setRows(s=> s.map(x=> x.id===r.id ? {...x, montant:e.target.value} : x))}
                />
              </div>
              <div className="col-span-1 flex items-center">
                <Button type="button" variant="ghost" onClick={()=> removeRow(r.id)} disabled={rows.length===1}>–</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Button type="button" variant="secondary" onClick={addRow}>+ Ajouter une ligne</Button>
        </div>
      </div>

      <SubmitBtn>Valider la dépense</SubmitBtn>
    </form>
  );
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'En cours…' : children}</Button>;
}






