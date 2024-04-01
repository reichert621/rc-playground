import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function times(n: number) {
  return Array.from({length: n}).map((_, i) => i);
}
export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function() {
    const args = arguments;
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  }
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
