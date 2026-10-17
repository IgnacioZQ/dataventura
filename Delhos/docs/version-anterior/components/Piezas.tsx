// Piezas compartidas: ícono de la marca, firma de Delhos, contenedor, aparición al hacer scroll y barrido de color.
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { recurso } from '@/config';
import { ICONOS, type NombreIcono } from '@/iconos-datos';
import { cn } from '@/lib/utils';

/** Ícono de la marca en línea: hereda el color del texto (currentColor). */
export function Icono({ nombre, tam = 22, className, trazo = 2 }: { nombre: NombreIcono; tam?: number; className?: string; trazo?: number }) {
  return (
    <svg
      viewBox="0 0 24 24" width={tam} height={tam} fill="none" stroke="currentColor" strokeWidth={trazo}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn('shrink-0', className)}
      dangerouslySetInnerHTML={{ __html: ICONOS[nombre] }}
    />
  );
}

/**
 * Firma de Delhos (componente Logo del sistema): símbolo + nombre en Bricolage Grotesque 700, interletra −0.03em.
 * Sobre fondos claros, el ícono de app; sobre oscuros, el símbolo blanco sin contenedor.
 */
export function Firma({ oscuro = false, tam = 40, className }: { oscuro?: boolean; tam?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: tam * 0.3 }}>
      <img src={recurso(oscuro ? 'marca/delhos-simbolo-blanco.svg' : 'marca/delhos-icono-app.svg')} alt="" width={tam} height={tam} style={{ width: tam, height: tam }} />
      <span className="font-display font-bold tracking-[-0.03em]" style={{ fontSize: tam * 0.65, lineHeight: 1, color: oscuro ? '#fff' : '#081D35' }}>Delhos</span>
    </span>
  );
}

export function Contenedor({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-4 sm:px-6', className)}>{children}</div>;
}

/** Entrada al hacer scroll según el sistema: sube 16–24 px con desvanecido, 250–350 ms, escalonada 80 ms. */
export function Revelar({ children, className, retraso = 0, as = 'div' }: { children: ReactNode; className?: string; retraso?: number; as?: 'div' | 'li' | 'article' | 'header' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: retraso * 0.08 }}
    >
      {children}
    </M>
  );
}

/** Encabezado de sección (EncabezadoSeccion): kicker, título con la segunda parte destacada y bajada. */
export function Encabezado({ kicker, titulo, destacado, bajada, centrado = false, className }: { kicker: string; titulo: string; destacado?: string; bajada?: string; centrado?: boolean; className?: string }) {
  return (
    <Revelar as="header" className={cn('flex flex-col gap-4', centrado && 'items-center text-center', className)}>
      <span className="dh-kicker">{kicker}</span>
      <h2 className="dh-h1 max-w-[22ch]">{titulo}{destacado && <> <span className="text-enlace">{destacado}</span></>}</h2>
      {bajada && <p className="dh-lead">{bajada}</p>}
    </Revelar>
  );
}

/**
 * Barrido de color: un enlace con data-wipe="ac" (Delhos Academy) o "dv" (Dataventura) cubre la pantalla con un
 * círculo del color y la marca de destino, nacido en el clic, y recién entonces navega. Al usuario le gusta este efecto.
 */
const MARCAS = {
  ac: { fondo: 'linear-gradient(135deg, #1E3D59, #2B7CB3)', logo: 'assets/academy/academy-logo-192.png', nombre: 'Delhos Academy', fuente: 'font-display' },
  dv: { fondo: 'radial-gradient(circle at 30% 20%, #8f66ff, #5a30d6)', logo: 'assets/dataventura/dataventura-icon.svg', nombre: 'Dataventura', fuente: 'font-display' }
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
        <img src={recurso(m.logo)} alt="" className="size-16 rounded-2xl" />
        <span className={cn(m.fuente, 'text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl')}>{m.nombre}</span>
      </motion.div>
    </motion.div>
  );
}
