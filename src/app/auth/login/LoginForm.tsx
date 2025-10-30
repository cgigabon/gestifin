'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { celebrationToast, errorToast, loadingToast, CELEBRATION_ACTIONS } from '@/lib/toast-utils';
import { toast } from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, setPending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const toastId = loadingToast('Connexion en cours...');
    
    try {
      setPending(true);
      const email = String(fd.get('email') || '');
      const password = String(fd.get('password') || '');
      const callbackUrl = sp.get('callbackUrl') || '/dashboard';
      
      const res = await signIn('credentials', { redirect: false, email, password, callbackUrl });
      
      if (!res || res.error) {
        throw new Error(res?.error || 'Identifiants invalides');
      }
      
      toast.dismiss(toastId);
      celebrationToast(CELEBRATION_ACTIONS.LOGIN_SUCCESS);
      
      // Redirection après célébration avec refresh pour charger la session
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh(); // Force le rechargement de la session
      }, 1000);
    } catch (err:any) {
      toast.dismiss(toastId);
      errorToast(err?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3 grid gap-3">
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" placeholder="vous@exemple.com" required />
      </div>
      <div>
        <Label>Mot de passe</Label>
        <Input name="password" type="password" required />
      </div>
      <Button 
        type="submit" 
        disabled={pending}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>
    </form>
  );
}



