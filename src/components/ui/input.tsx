'use client';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={twMerge(
        'flex h-10 w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';






