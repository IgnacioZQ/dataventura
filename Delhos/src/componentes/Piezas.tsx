// Piezas pequeñas que se repiten: íconos del diseño, títulos que entran por palabra y enlaces a las plataformas.
import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { SITIO, recurso } from '@/config';

export function Ico({ n }: { n: string }) {
  return <svg className="ico" aria-hidden="true"><use href={`#i-${n}`} /></svg>;
}

export function Simbolo({ className, etiqueta }: { className?: string; etiqueta?: string }) {
  return (
    <svg className={className} viewBox="40 40 944 944" role={etiqueta ? 'img' : undefined} aria-label={etiqueta} aria-hidden={etiqueta ? undefined : true}>
      <use href="#dh-sym" />
    </svg>
  );
}

/**
 * Título del diseño que entra por palabra (.split): cada palabra queda en <span class="sw"><span style="--i">,
 * también dentro de <em> y <span class="dim">. Equivale a lo que hacía el script del diseño al cargar.
 */
export function Partido({ as: Etiqueta = 'h2', className = '', children }: { as?: 'h1' | 'h2' | 'p'; className?: string; children: ReactNode }) {
  let i = 0;
  const partir = (nodo: ReactNode): ReactNode => Children.map(nodo, hijo => {
    if (typeof hijo === 'string') {
      return hijo.split(/(\s+)/).filter(Boolean).map((parte, k) => /^\s+$/.test(parte)
        ? parte
        : <span className="sw" key={`${i}-${k}`}><span style={{ '--i': i++ } as React.CSSProperties}>{parte}</span></span>);
    }
    if (isValidElement(hijo)) {
      const el = hijo as ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, {}, partir(el.props.children));
    }
    return hijo;
  });
  // Las palabras van en spans inline-block para animarlas; el lector de pantalla lee el texto de corrido.
  return <Etiqueta className={`split ${className}`.trim()}><span className="sr-only">{textoPlano(children)}</span><span aria-hidden="true">{partir(children)}</span></Etiqueta>;
}

/** Texto plano de un árbol de React (para la versión que leen los lectores de pantalla). */
export function textoPlano(nodo: ReactNode): string {
  return Children.toArray(nodo).map(h => (typeof h === 'string' || typeof h === 'number' ? String(h) : isValidElement(h) ? textoPlano((h as ReactElement<{ children?: ReactNode }>).props.children) : '')).join('');
}

/** true si la persona pidió reducir el movimiento (se lee una vez al montar). */
export function useReducir() {
  const [reducir, setReducir] = useState(false);
  useEffect(() => { setReducir(matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  return reducir;
}

/** Destinos de las plataformas dentro del mismo dominio. */
export const DESTINO = {
  academy: SITIO.academy,
  academyCursos: SITIO.academyCursos,
  academyWebinars: SITIO.academyWebinars,
  dataventura: SITIO.dataventura
};

export const LOGOS = {
  academy: recurso('assets/academy/academy-logo-192.png'),
  academy192: recurso('assets/academy/academy-logo-192.png'),
  dataventura: recurso('assets/dataventura/dataventura-icon.svg')
};

/**
 * Aparición al entrar en pantalla manejada por React, para los elementos .rv cuyo className cambia con el estado
 * (preguntas abiertas, formulario enviado): si la clase «in» la pusiera solo el efecto global, React la borraría
 * al volver a dibujar el elemento y este quedaría invisible.
 */
export function useVisto<T extends Element>() {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { setVisto(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visto] as const;
}
