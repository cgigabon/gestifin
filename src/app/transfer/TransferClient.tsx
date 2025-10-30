'use client';
import { useToast } from '@/components/toast';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export function TransferClient({ envs, today, action }: any) {
  const toast = useToast();
  const clientAction = async (formData: FormData) => {
    try {
      await action(formData);
      toast('Transfert effectué ✅');
      (document.querySelector('form') as HTMLFormElement | null)?.reset();
    } catch (e:any) {
      toast(e?.message || 'Erreur');
    }
  };

  return (
    <form action={clientAction as any} className="grid gap-3 mt-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>De</Label>
          <Select name="fromId" defaultValue="">
            <SelectTrigger><SelectValue placeholder="Enveloppe source" /></SelectTrigger>
            <SelectContent>
              {envs.map((e:any)=> <SelectItem key={e.id} value={String(e.id)}>{e.nom} • {Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Vers</Label>
          <Select name="toId" defaultValue="">
            <SelectTrigger><SelectValue placeholder="Enveloppe cible" /></SelectTrigger>
            <SelectContent>
              {envs.map((e:any)=> <SelectItem key={e.id} value={String(e.id)}>{e.nom} • {Math.round(e.solde_actuel).toLocaleString('fr-GA')} XAF</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Montant (XAF)</Label>
          <Input name="montant" type="number" min={1} step="1" required />
        </div>
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" defaultValue={today} />
        </div>
      </div>
      <div>
        <Label>Note</Label>
        <Input name="note" placeholder="facultatif" />
      </div>
      <SubmitBtn>Effectuer le transfert</SubmitBtn>
    </form>
  );
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'En cours…' : children}</Button>;
}






