// Basado en Shimmer Button de Watermelon UI (https://ui.watermelon.sh, MIT): un brillo cruza el botón al pasar
// el cursor. Adaptado a los botones "de juego" de Dataventura y con versión enlace.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const brillo = (
  <span
    aria-hidden
    className={cn(
      'pointer-events-none absolute inset-0 -translate-x-full',
      'bg-linear-to-r from-transparent via-white/45 to-transparent',
      'transition-transform duration-700 group-hover:translate-x-full'
    )}
  />
);

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <button className={cn('btn-juego group relative overflow-hidden', className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {brillo}
    </button>
  );
}

interface ShimmerLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function ShimmerLink({ children, className, ...props }: ShimmerLinkProps) {
  return (
    <a className={cn('btn-juego group relative overflow-hidden', className)} {...props}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {brillo}
    </a>
  );
}
