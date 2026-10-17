import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Une clases de Tailwind resolviendo conflictos (lo usan los componentes de Motion Primitives y Watermelon UI). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
