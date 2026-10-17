// Fondos estilo Haikei, generados con semilla (src/lib/haikei.ts) y animados con Motion.
import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { mancha, ola, olasEnCapas, puntosDispersos } from '@/lib/haikei';
import { cn } from '@/lib/utils';

/** Olas en capas que se desplazan en bucle, cada capa a su ritmo (efecto de mar). */
export function OlasEnCapas({ colores, semilla = 7, alto = 260, picos = 6, amplitud = 24, className, velocidad = 1 }: {
  colores: string[]; semilla?: number; alto?: number; picos?: number; amplitud?: number; className?: string; velocidad?: number;
}) {
  const reducir = useReducedMotion();
  const caminos = useMemo(() => olasEnCapas({ ancho: 1440, alto, capas: colores.length, picos, amplitud, semilla, desde: 0.2, hasta: 0.72 }), [alto, colores.length, picos, amplitud, semilla]);
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-x-0 overflow-hidden', className)} style={{ height: alto }}>
      {caminos.map((d, i) => (
        <motion.svg
          key={i}
          viewBox={`0 0 2880 ${alto}`}
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full"
          style={{ width: '200%' }}
          animate={reducir ? undefined : { x: i % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: (26 - i * 4) / velocidad, ease: 'linear', repeat: Infinity }}
        >
          <path d={d} fill={colores[i]} />
          <path d={d} fill={colores[i]} transform="translate(1440 0)" />
        </motion.svg>
      ))}
    </div>
  );
}

/** Separador de sección con forma de ola. */
export function Ola({ color, semilla = 3, alto = 90, invertida = false, className }: { color: string; semilla?: number; alto?: number; invertida?: boolean; className?: string }) {
  const d = useMemo(() => ola({ alto, semilla, nivel: 0.45 }), [alto, semilla]);
  return (
    <svg aria-hidden viewBox={`0 0 1440 ${alto}`} preserveAspectRatio="none" className={cn('block w-full', className)} style={{ height: alto, transform: invertida ? 'scaleY(-1)' : undefined }}>
      <path d={d} fill={color} />
    </svg>
  );
}

/** Mancha orgánica que respira pasando suavemente entre dos formas. */
export function Mancha({ color, semilla = 11, tam = 420, className, puntas = 7 }: { color: string; semilla?: number; tam?: number; className?: string; puntas?: number }) {
  const reducir = useReducedMotion();
  const [a, b] = useMemo(() => [
    mancha({ cx: 200, cy: 200, radio: 170, puntas, semilla }),
    mancha({ cx: 200, cy: 200, radio: 170, puntas, semilla: semilla + 97 })
  ], [semilla, puntas]);
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={cn('pointer-events-none absolute', className)} style={{ width: tam, height: tam }}>
      <motion.path
        fill={color}
        initial={{ d: a }}
        animate={reducir ? undefined : { d: [a, b, a] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
    </svg>
  );
}

/** Puntos dispersos que titilan, como estrellas o espuma. */
export function Puntos({ color = '#cdbcff', semilla = 21, cantidad = 26, className }: { color?: string; semilla?: number; cantidad?: number; className?: string }) {
  const puntos = useMemo(() => puntosDispersos({ cantidad, semilla }), [cantidad, semilla]);
  return (
    <svg aria-hidden viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      {puntos.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity={p.o}>
          <animate attributeName="opacity" values={`${p.o};${p.o * 0.3};${p.o}`} dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
