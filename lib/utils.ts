import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function times(n: number) {
  return Array.from({length: n}).map((_, i) => i);
}

export function parseLinkedInUsername(url: string) {
  const parts = url.split('/').filter((part) => part.trim().length > 0);

  return parts[parts.length - 1];
}
