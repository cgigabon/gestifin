'use client';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={twMerge('mb-1 block text-sm text-zinc-700', className)} {...props} />;
}






