'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm hover:shadow-md',
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md hover:shadow-lg',
        secondary: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100',
        outline: 'border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
        ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100',
        destructive: 'bg-gradient-to-r from-red-600 to-red-700 dark:from-red-600 dark:to-red-700 text-white hover:from-red-700 hover:to-red-800 dark:hover:from-red-700 dark:hover:to-red-800 shadow-md hover:shadow-lg',
        success: 'bg-gradient-to-r from-green-600 to-green-700 dark:from-green-600 dark:to-green-700 text-white hover:from-green-700 hover:to-green-800 dark:hover:from-green-700 dark:hover:to-green-800 shadow-md hover:shadow-lg',
        warning: 'bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-500 dark:to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-700 shadow-md hover:shadow-lg',
        info: 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md hover:shadow-lg',
        link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-7 px-2 text-xs rounded-lg',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animated?: boolean;
}

export function Button({ 
  className, 
  variant, 
  size, 
  asChild, 
  animated = true,
  ...props 
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  
  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex"
      >
        <Comp 
          className={twMerge(buttonVariants({ variant, size }), className)} 
          {...props} 
        />
      </motion.div>
    );
  }
  
  return (
    <Comp 
      className={twMerge(buttonVariants({ variant, size }), className)} 
      {...props} 
    />
  );
}
