'use client';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/components/toast';
import { Button } from '@/components/ui/button';

export function SubmitButtonWithToast() {
  const { pending } = useFormStatus();
  const toast = useToast();
  return (
    <Button
      type="submit"
      disabled={pending}
      onClick={() => !pending && toast('Clôture demandée…')}
    >
      {pending ? 'Traitement…' : 'Clôturer le mois'}
    </Button>
  );
}






