import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { twMergeConfig } from './tv';

const twMerge = extendTailwindMerge(twMergeConfig);

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
