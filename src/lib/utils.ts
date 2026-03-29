import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getOptionLabel(key: string): string {
  return key.toUpperCase();
}

export const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'] as const;

export function getOptionText(question: {
  optionA: string; optionB: string;
  optionC: string; optionD: string;
  optionE: string | null;
}, key: string): string {
  const map: Record<string, string> = {
    A: question.optionA, B: question.optionB,
    C: question.optionC, D: question.optionD,
    E: question.optionE ?? '',
  };
  return map[key] ?? '';
}
