// Basado en Card Swipe de Watermelon UI (https://ui.watermelon.sh, MIT): una fila de tarjetas que se arrastra
// con el dedo o el mouse, con giro 3D según la velocidad y paginación con resorte. Adaptado a Dataventura:
// tarjetas con contenido libre, flechas, puntos accesibles y teclado. El ancho de la tarjeta (320 px) se ajusta
// al contenedor en teléfonos angostos (320 px de pantalla) para que no se corte.
import { motion, useMotionValue, useTransform, type MotionValue, type PanInfo, type Transition } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';

const ANCHO = 320;
const ALTO = 440;
const ESPACIO = 16;
const TOLERANCIA = 50;
const VELOCIDAD = 500;
const RESORTE: Transition = { type: 'spring', stiffness: 330, damping: 30 };

function Tarjeta({ index, x, children, activa, ancho, paso }: { index: number; x: MotionValue<number>; children: ReactNode; activa: boolean; ancho: number; paso: number }) {
  const rango = [-(index + 1) * paso, -index * paso, -(index - 1) * paso];
  const rotateY = useTransform(x, rango, [90, 0, -90], { clamp: false });
  return (
    // minHeight (no height): con textos largos (inglés) o tarjetas angostas la tarjeta crece en vez de cortar el
    // caso de abajo; la fila estira todas a la altura de la más alta.
    <motion.div
      style={{ width: ancho, minHeight: ALTO, rotateY, flexShrink: 0 }}
      transition={RESORTE}
      aria-hidden={!activa}
      className="relative cursor-grab overflow-hidden rounded-[36px] border-2 border-borde bg-white shadow-[0_6px_0_#e5e0f2] active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}

const estiloFlecha = 'grid size-11 place-items-center rounded-full border-2 border-borde bg-white text-dv shadow-[0_3px_0_#e5e0f2] transition hover:bg-lila-50 active:translate-y-[3px] active:shadow-none aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-white aria-disabled:active:translate-y-0 aria-disabled:active:shadow-[0_3px_0_#e5e0f2]';

export function CardSwipe<T>({ items, render, etiqueta, nombre, className, textos = { anterior: 'Tarjeta anterior', siguiente: 'Tarjeta siguiente', rol: 'carrusel' } }: {
  items: T[];
  render: (item: T, index: number) => ReactNode;
  /** Nombre accesible del carrusel. */
  etiqueta: string;
  /** Nombre corto de cada tarjeta, para los puntos de paginación. */
  nombre: (item: T, index: number) => string;
  className?: string;
  textos?: { anterior: string; siguiente: string; rol: string };
}) {
  const [actual, setActual] = useState(0);
  const x = useMotionValue(0);
  const [medidor, { width: disponible }] = useMeasure();
  const ancho = disponible > 0 ? Math.min(ANCHO, Math.floor(disponible)) : ANCHO;
  const paso = ancho + ESPACIO;
  const ir = (i: number) => setActual(Math.max(0, Math.min(items.length - 1, i)));
  const primera = actual === 0;
  const ultima = actual === items.length - 1;

  const soltar = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -TOLERANCIA || info.velocity.x < -VELOCIDAD) ir(actual + 1);
    else if (info.offset.x > TOLERANCIA || info.velocity.x > VELOCIDAD) ir(actual - 1);
  };

  return (
    <div
      className={cn('flex min-w-0 flex-col items-center', className)}
      role="region"
      aria-roledescription={textos.rol}
      aria-label={etiqueta}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
      }}
    >
      {/* Mide el espacio disponible (máximo 320 px) para el ancho de la tarjeta. */}
      <div ref={medidor} className="w-full max-w-[320px]" aria-hidden />
      <div className="relative" style={{ width: ancho, minHeight: ALTO + 12 }}>
        <div className="overflow-hidden pb-3" style={{ width: ancho }}>
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: -paso * (items.length - 1), right: 0 }}
            style={{ gap: ESPACIO, perspective: 1000, x }}
            onDragEnd={soltar}
            animate={{ x: -actual * paso }}
            transition={RESORTE}
          >
            {items.map((item, i) => (
              <Tarjeta key={i} index={i} x={x} activa={i === actual} ancho={ancho} paso={paso}>{render(item, i)}</Tarjeta>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        {/* aria-disabled en vez de disabled: el botón enfocado no pierde el foco al llegar al extremo. */}
        <button type="button" onClick={() => !primera && ir(actual - 1)} aria-disabled={primera} aria-label={textos.anterior} className={estiloFlecha}>
          <ChevronLeft className="size-5" strokeWidth={3} />
        </button>
        {/* Puntos de 32 px (antes 24): más fáciles de tocar en el celular, con menos espacio entre ellos. */}
        <div className="flex gap-0.5">
          {items.map((item, i) => (
            <button key={i} type="button" onClick={() => ir(i)} aria-label={nombre(item, i)} aria-current={i === actual}
              className="grid size-8 place-items-center">
              <span className={cn('block h-2.5 rounded-full transition-[width,background-color] duration-300', i === actual ? 'w-7 bg-dv' : 'w-2.5 bg-lila-300')} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => !ultima && ir(actual + 1)} aria-disabled={ultima} aria-label={textos.siguiente} className={estiloFlecha}>
          <ChevronRight className="size-5" strokeWidth={3} />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{nombre(items[actual], actual)}, {actual + 1} / {items.length}</p>
    </div>
  );
}
