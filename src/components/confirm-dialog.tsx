'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/toast';
import { useRouter } from 'next/navigation';

export function ConfirmDialog({
  title='Confirmer', description='Cette action est irréversible.',
  confirmText='Confirmer', cancelText='Annuler',
  onConfirm, children, trigger,
  successMessage='Action réalisée.', errorMessage='Une erreur est survenue.',
}: {
  title?: string; description?: string;
  confirmText?: string; cancelText?: string;
  onConfirm: () => Promise<void> | void;
  children?: React.ReactNode; // contenu in-dialog optionnel
  trigger: React.ReactNode;   // bouton déclencheur
  successMessage?: string;
  errorMessage?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const toast = useToast();
  const router = useRouter();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 grid place-items-center p-4">
          <Dialog.Content className="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg">
            <div className="flex justify-end">
              <Dialog.Close aria-label="close" className="rounded-xl p-1 hover:bg-zinc-100">
                <X size={18} />
              </Dialog.Close>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-red-50 p-2 text-red-600"><AlertTriangle size={18} /></div>
              <div>
                <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
                <Dialog.Description className="text-sm text-zinc-600">{description}</Dialog.Description>
                {children}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={()=>setOpen(false)} disabled={pending}>{cancelText}</Button>
              <Button variant="destructive" onClick={async ()=>{
                try {
                  setPending(true);
                  await onConfirm();
                  setOpen(false);
                  toast(successMessage);
                  router.refresh();
                } catch (e) {
                  toast(errorMessage);
                } finally { setPending(false); }
              }} disabled={pending}>{pending ? '...' : confirmText}</Button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}



