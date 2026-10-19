// Avance del scroll de la página como MotionValues compartidos (la cabecera y la isla de ruta los leen).
// Reemplaza a useScroll de Motion: ese hook, en cada evento de scroll y por cada componente que lo usa, lee
// scrollWidth/scrollHeight/clientWidth del documento y obliga a recalcular el diseño de toda la página; en un
// celular de gama media eso solo se llevaba unos 2 s de CPU en un recorrido. Aquí se lee scrollY en el evento
// y el alto desplazable se mide solo cuando la página cambia de tamaño.
import { motionValue, type MotionValue } from 'motion/react';

let compartido: { scrollY: MotionValue<number>; scrollYProgress: MotionValue<number> } | null = null;

export function useProgresoScroll() {
  if (!compartido) {
    const scrollYMv = motionValue(scrollY), progreso = motionValue(0);
    let max = 1;
    const actualizar = () => { const y = scrollY; scrollYMv.set(y); progreso.set(Math.min(1, Math.max(0, y / max))); };
    const medir = () => { max = Math.max(1, document.documentElement.scrollHeight - innerHeight); actualizar(); };
    addEventListener('scroll', actualizar, { passive: true });
    addEventListener('resize', medir);
    new ResizeObserver(medir).observe(document.body);
    medir();
    compartido = { scrollY: scrollYMv, scrollYProgress: progreso };
  }
  return compartido;
}
