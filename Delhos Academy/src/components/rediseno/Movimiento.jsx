// Movimiento del rediseño con Motion (motion/react): aparición al entrar en pantalla, botones con imán,
// inclinación 3D y el brillo que sigue al cursor. El imán y la inclinación usan valores de movimiento (sin
// re-renderizar React) y se apagan en pantallas táctiles o con «reducir movimiento».
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';

const SALIDA = [0.2, 0.7, 0.2, 1];

/** Aparece subiendo y enfocándose cuando entra en pantalla (una sola vez). */
export function Revelar({ as = 'div', retraso = 0, y = 28, className, style, children, ...resto }) {
  const Comp = motion[as] ?? motion.div;
  const reducir = useReducedMotion();
  return (
    <Comp
      initial={reducir ? false : { opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: SALIDA, delay: retraso }}
      className={className}
      style={style}
      {...resto}
    >
      {children}
    </Comp>
  );
}

/** Lista que entra en cascada: cada hijo directo aparece un poco después del anterior. */
export function Cascada({ as = 'div', className, style, children, paso = 0.08 }) {
  const Comp = motion[as] ?? motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: paso } } }}
    >
      {children}
    </Comp>
  );
}

export const itemCascada = {
  oculto: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SALIDA } }
};

const puedeMover = () =>
  typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Envoltorio con imán: el contenido se acerca un poco al cursor (resorte, sin estado de React). */
export function Iman({ children, fuerza = 0.22, className, as = 'span' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });
  const Comp = motion[as] ?? motion.span;
  return (
    <Comp
      className={className}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse' || !puedeMover()) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * fuerza);
        y.set((e.clientY - r.top - r.height / 2) * fuerza * 1.4);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </Comp>
  );
}

/** Inclinación 3D que sigue al mouse (como el .tilt del diseño). */
export function Inclinar({ children, className, maxX = 7, maxY = 9, style }) {
  const reducir = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, v => -v * maxX), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(px, v => v * maxY), { stiffness: 120, damping: 18 });
  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX: reducir ? 0 : rotateX, rotateY: reducir ? 0 : rotateY, transformPerspective: 1100 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse' || !puedeMover()) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Brillo bajo el cursor para todo elemento con la clase .spot, y desplazamiento suave de las manchas del hero
 * (variables --px/--py en el elemento con .hero). Un solo oyente para toda la página.
 */
export function useBrilloCursor(raiz) {
  const ultimo = useRef(null);
  useEffect(() => {
    const el = raiz.current;
    if (!el || !puedeMover()) return;
    let cuadro = 0;
    const mover = e => {
      ultimo.current = e;
      if (cuadro) return;
      cuadro = requestAnimationFrame(() => {
        cuadro = 0;
        const ev = ultimo.current;
        const objetivo = ev?.target;
        if (!objetivo?.closest) return;
        const spot = objetivo.closest('.spot');
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty('--mx', `${ev.clientX - r.left}px`);
          spot.style.setProperty('--my', `${ev.clientY - r.top}px`);
        }
        const hero = el.querySelector('.hero');
        if (hero) {
          const r = hero.getBoundingClientRect();
          if (ev.clientY >= r.top && ev.clientY <= r.bottom) {
            hero.style.setProperty('--px', (ev.clientX / Math.max(r.width, 1) - 0.5).toFixed(3));
            hero.style.setProperty('--py', ((ev.clientY - r.top) / Math.max(r.height, 1) - 0.5).toFixed(3));
          }
        }
      });
    };
    el.addEventListener('pointermove', mover);
    return () => { el.removeEventListener('pointermove', mover); cancelAnimationFrame(cuadro); };
  }, [raiz]);
}
