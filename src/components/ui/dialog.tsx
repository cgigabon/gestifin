'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 grid place-items-center p-4">
        <DialogPrimitive.Content className="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg">
          <div className="flex justify-end">
            <DialogPrimitive.Close aria-label="close" className="rounded-xl p-1 hover:bg-zinc-100">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}
export const DialogTitle = (p: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-lg font-semibold mb-2" {...p} />;
export const DialogDescription = (p: React.HTMLAttributes<HTMLParagraphElement>) => <p className="text-sm text-zinc-600" {...p} />;






