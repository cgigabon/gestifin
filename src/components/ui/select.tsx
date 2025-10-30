'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { twMerge } from 'tailwind-merge';
import { ChevronDown, Check } from 'lucide-react';

export function Select({ children, ...props }: SelectPrimitive.SelectProps) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}
export const SelectTrigger = React.forwardRef<
  HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={twMerge('flex h-10 w-full items-center justify-between rounded-2xl border border-zinc-300 bg-white px-3 text-sm focus:ring-2 focus:ring-black', className)}
    {...props}
  >
    {children}<SelectPrimitive.Icon><ChevronDown size={16} /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = SelectPrimitive.Value;
export const SelectContent = React.forwardRef<
  HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={twMerge('z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md', className)}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

export const SelectItem = React.forwardRef<
  HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={twMerge('relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none data-[highlighted]:bg-zinc-100', className)}
    {...props}
  >
    <SelectPrimitive.ItemIndicator className="mr-2"><Check size={14} /></SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';






