import { twMerge } from 'tailwind-merge';

/**
 * Combine des classes CSS avec Tailwind merge
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(inputs.filter(Boolean).join(' '));
}


