'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { celebrationToast, errorToast, loadingToast, CELEBRATION_ACTIONS } from '@/lib/toast-utils';
import { toast } from 'react-hot-toast';

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const toastId = loadingToast('Création de votre compte...');
    
    try {
      setPending(true);
      const res = await fetch('/api/auth/register', { method: 'POST', body: fd });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Erreur lors de la création');
      }
      
      toast.dismiss(toastId);
      celebrationToast(CELEBRATION_ACTIONS.ACCOUNT_CREATED);
      
      // Redirection après célébration
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err:any) {
      toast.dismiss(toastId);
      errorToast(err?.message || 'Erreur lors de la création du compte. Réessayez.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3 grid gap-3">
      <div>
        <Label>Nom</Label>
        <Input name="name" placeholder="Ex: Freddy" required />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="vous@exemple.com" required />
      </div>
      <div>
        <Label>Mot de passe</Label>
        <Input name="password" type="password" minLength={6} required />
      </div>
      <Button 
        type="submit" 
        disabled={pending}
        variant="success"
        size="lg"
        className="w-full"
      >
        {pending ? 'Création…' : 'Créer mon compte'}
      </Button>
    </form>
  );
}



