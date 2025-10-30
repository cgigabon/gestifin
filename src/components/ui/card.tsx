'use client';
import { twMerge } from 'tailwind-merge';
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={twMerge('rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm', className)} {...p} />;
}
export function CardTitle({ className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={twMerge('text-base font-semibold', className)} {...p} />;
}
export function CardDescription({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={twMerge('text-sm text-zinc-600', className)} {...p} />;
}






