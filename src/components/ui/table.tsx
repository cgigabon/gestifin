'use client';
import { twMerge } from 'tailwind-merge';
export function Table(p: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={twMerge('w-full border-separate border-spacing-0 text-sm', p.className)} {...p} />;
}
export function THead(p: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...p} />;
}
export function TBody(p: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...p} />;
}
export function TR(p: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={twMerge('border-b last:border-0', p.className)} {...p} />;
}
export function TH(p: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={twMerge('bg-zinc-50 text-left font-medium p-3 border-b border-zinc-200', p.className)} {...p} />;
}
export function TD(p: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={twMerge('p-3 border-b border-zinc-100', p.className)} {...p} />;
}






