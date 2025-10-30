'use client';
import { twMerge } from 'tailwind-merge';

export function Badge({
  children, variant = 'default', className, ...p
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default'|'success'|'warning'|'destructive'|'info' }) {
  const styles = {
    default: 'bg-zinc-100 text-zinc-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-amber-100 text-amber-900',
    destructive: 'bg-red-100 text-red-900',
    info: 'bg-blue-100 text-blue-900',
  }[variant];
  return <span className={twMerge('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles, className)} {...p}>{children}</span>;
}






