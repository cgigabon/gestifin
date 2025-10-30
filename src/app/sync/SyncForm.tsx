'use client';
import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function SyncForm({ today, net, action }: { today:string; net:number; action:(fd:FormData)=>Promise<void> }) {
  const toast = useToast();
  const [cash, setCash] = React.useState<string>('');
  const declared = Number(cash || 0);
  const diff = declared - net;

  const clientAction = async (fd: FormData) => {
    try {
      await action(fd);
      toast('Synchronisation enregistrée ✅');
      setCash('');
      (document.querySelector('#syncForm') as HTMLFormElement | null)?.reset();
    } catch (e:any) {
      toast(e?.message || 'Erreur');
    }
  };

  return (
    <form id="syncForm" action={clientAction as any} className="mt-5 grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" defaultValue={today} />
        </div>
        <div>
          <Label>Cash réel en main (XAF)</Label>
          <Input name="cash" type="number" min={0} step="1" value={cash} onChange={(e)=>setCash(e.target.value)} placeholder="ex: 43000" />
        </div>
      </div>

      <div className="rounded-2xl border p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        <div>
          <div className="text-xs text-zinc-600">Net calculé</div>
          <div className="text-lg font-semibold">{Math.round(net).toLocaleString('fr-GA')} XAF</div>
        </div>
        <div>
          <div className="text-xs text-zinc-600">Cash déclaré</div>
          <div className="text-lg font-semibold">{Math.round(declared||0).toLocaleString('fr-GA')} XAF</div>
        </div>
        <div>
          <div className="text-xs text-zinc-600">Écart (cash - net)</div>
          <div className={`text-lg font-semibold ${diff===0?'':'text-amber-700'}`}>
            {Math.round(diff).toLocaleString('fr-GA')} XAF
          </div>
          <div className="mt-1">
            {diff === 0 ? <Badge variant="success">Équilibre parfait</Badge>
              : Math.abs(diff) <= 500 ? <Badge variant="warning">Tolérance ±500</Badge>
              : <Badge variant="destructive">Écart à corriger</Badge>}
          </div>
        </div>
      </div>

      <SubmitBtn>Enregistrer la synchronisation</SubmitBtn>
    </form>
  );
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'En cours…' : children}</Button>;
}






