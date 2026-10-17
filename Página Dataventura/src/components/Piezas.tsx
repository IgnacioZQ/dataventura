// Piezas compartidas de la landing: galeón, marco de teléfono, confeti y el barrido de color al cambiar de sitio.
import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { recurso } from '@/config';
import { cn } from '@/lib/utils';

/** El galeón de Dataventura (mismo dibujo que en la app). */
export function Galeon({ tam = 120, color = '#7b4dff', vela = '#fff', className }: { tam?: number; color?: string; vela?: string; className?: string }) {
  return (
    <svg width={tam} height={tam * 0.56} viewBox="-54 -62 120 70" className={className} aria-hidden>
      <path d="M-50 -30 L-26 -30 L-26 -18 L30 -18 Q42 -22 58 -38 Q56 -6 26 4 L-30 4 Q-48 0 -50 -16Z" fill={color} stroke="#1b1230" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-3 -48 V-16" stroke="#1b1230" strokeWidth="6" />
      <path d="M-26 -46 L26 -42 L22 -22 L-24 -24Z" fill={vela} stroke="#1b1230" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-3 -50 L14 -56 L-3 -60Z" fill="#ffd166" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Llama de la racha. */
export function Llama({ tam = 28, className }: { tam?: number; className?: string }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-6 1-9z" fill="#f0556f" />
      <path d="M12 13c.6 2 3 3 3 5a3 3 0 0 1-6 0c0-1.5 1-2.5 3-5z" fill="#ffd166" />
    </svg>
  );
}

/** Gema de la tienda del puerto. */
export function Gema({ tam = 22, className }: { tam?: number; className?: string }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M6 3h12l4 6-10 12L2 9z" fill="#7b4dff" stroke="#1b1230" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 9h20M9 3l3 18 3-18" fill="none" stroke="#1b1230" strokeWidth="1.5" />
    </svg>
  );
}

/** Teléfono con una captura real de la app. */
export function Telefono({ src, alt, className, ancho = 250 }: { src: string; alt: string; className?: string; ancho?: number }) {
  return (
    <div className={cn('relative rounded-[42px] bg-tinta p-[11px] shadow-[0_10px_0_rgba(27,18,48,.12),0_30px_60px_-20px_rgba(59,42,110,.45)]', className)} style={{ width: ancho }}>
      <div className="absolute top-[18px] left-1/2 z-10 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-tinta" aria-hidden />
      <img src={recurso(src)} alt={alt} width={540} height={1169} loading="lazy" decoding="async" className="block w-full rounded-[32px] bg-white" />
    </div>
  );
}

/** Confeti con los colores de la marca (respeta el movimiento reducido). */
export function lanzarConfeti(origen?: { x: number; y: number }) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#7b4dff', '#ffd166', '#f0556f', '#2fbf8a', '#8fc4ff', '#ff9db3', '#a98bff'];
  confetti({ particleCount: 90, spread: 75, startVelocity: 42, origin: origen ?? { x: 0.5, y: 0.6 }, colors, scalar: 1.05, ticks: 220 });
  setTimeout(() => confetti({ particleCount: 50, spread: 110, startVelocity: 30, origin: origen ?? { x: 0.5, y: 0.6 }, colors, shapes: ['circle'], ticks: 200 }), 140);
}

/** Origen del confeti en el centro de un elemento. */
export const origenDe = (el: Element | null) => {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight };
};

/**
 * Barrido de color: cualquier enlace con data-wipe="dv" | "delhos" | "ac" cubre la pantalla con un círculo del
 * color y la marca de destino, nacido en el clic, y recién entonces navega (igual que la landing de Delhos).
 */
const MARCAS = {
  dv: { fondo: 'radial-gradient(circle at 30% 20%, #8f66ff, #5a30d6)', logo: 'icons/dataventura-icon.svg', nombre: 'Dataventura' },
  delhos: { fondo: 'linear-gradient(135deg, #16324D, #1E6194)', logo: '/marca/delhos-icono-app.svg', nombre: 'Delhos' },
  ac: { fondo: 'linear-gradient(135deg, #1E3D59, #2B7CB3)', logo: '/assets/academy/academy-logo-192.png', nombre: 'Delhos Academy' }
} as const;

export function Barrido() {
  const reducir = useReducedMotion();
  const [estado, setEstado] = useState<{ marca: keyof typeof MARCAS; x: number; y: number } | null>(null);
  const ocupado = useRef(false);

  useEffect(() => {
    if (reducir) return;
    const clic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-wipe]') as HTMLAnchorElement | null;
      if (!a || ocupado.current || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const marca = a.dataset.wipe as keyof typeof MARCAS;
      if (!MARCAS[marca]) return;
      e.preventDefault();
      ocupado.current = true;
      const r = a.getBoundingClientRect();
      const teclado = e.detail === 0;
      setEstado({ marca, x: teclado ? r.left + r.width / 2 : e.clientX, y: teclado ? r.top + r.height / 2 : e.clientY });
      setTimeout(() => { location.href = a.href; }, 760);
    };
    const volver = (e: PageTransitionEvent) => { if (e.persisted) { ocupado.current = false; setEstado(null); } };
    document.addEventListener('click', clic);
    addEventListener('pageshow', volver);
    return () => { document.removeEventListener('click', clic); removeEventListener('pageshow', volver); };
  }, [reducir]);

  if (!estado) return null;
  const m = MARCAS[estado.marca];
  const radio = Math.hypot(Math.max(estado.x, innerWidth - estado.x), Math.max(estado.y, innerHeight - estado.y));
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] grid place-items-center"
      style={{ background: m.fondo }}
      initial={{ clipPath: `circle(0px at ${estado.x}px ${estado.y}px)` }}
      animate={{ clipPath: `circle(${radio}px at ${estado.x}px ${estado.y}px)` }}
      transition={{ duration: 0.62, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 16 }} className="flex items-center gap-4">
        <img src={m.logo.startsWith('/') ? m.logo : recurso(m.logo)} alt="" width={64} height={64} className="size-16 rounded-2xl" />
        <span className="font-display text-4xl text-white sm:text-5xl">{m.nombre}</span>
      </motion.div>
    </motion.div>
  );
}

/** Contenedor de sección con ancho máximo y márgenes laterales de 16 px en teléfonos. */
export function Contenedor({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1120px] px-4 sm:px-6', className)}>{children}</div>;
}
