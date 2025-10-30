'use client';
import { useToast } from '@/components/toast';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { AllocationPreview } from './AllocationPreview';

export function IncomeForm({ services, envelopes, today, action }: any) {
  const toast = useToast();
  const onSubmit = async (formData: FormData) => {
    try {
      await action(formData);
      toast('Entrée enregistrée ✅');
      (document.querySelector('form') as HTMLFormElement | null)?.reset();
    } catch (e: any) {
      toast(e?.message || 'Erreur');
    }
  };
  return (
    <form action={onSubmit as any} className="grid gap-3 mt-3">
      <div>
        <Label>Service</Label>
        <Select name="serviceId" defaultValue="">
          <SelectTrigger><SelectValue placeholder="Choisir un service" /></SelectTrigger>
          <SelectContent>
            {services.map((s: any)=> <SelectItem key={s.id} value={String(s.id)}>{s.nom}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Montant (XAF)</Label>
        <Input name="montant" type="number" min={1} step="1" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input name="date" type="date" defaultValue={today} />
        </div>
        <div>
          <Label>Note</Label>
          <Input name="note" placeholder="facultatif" />
        </div>
      </div>
      <SubmitBtn>Valider l’entrée</SubmitBtn>
      {envelopes.length > 0 && (
        <AllocationPreview envelopes={envelopes} />
      )}
      <p className="mt-2"><a href="/dashboard">← Retour tableau de bord</a></p>
    </form>
  );
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'En cours…' : children}</Button>;
}






