// Basado en Scroll Island de Watermelon UI (https://ui.watermelon.sh, MIT): una "isla" flotante con el avance
// de lectura en un anillo y un índice que se despliega. Adaptado a Dataventura como la "isla de ruta":
// sigue el scroll de la página, muestra el tramo actual de la travesía y lleva un acceso directo a la app.
// Rendimiento: el avance (anillo y porcentaje) va por MotionValues de un seguidor de scroll compartido, sin
// re-renderizar en cada scroll; el tramo actual lo avisa un IntersectionObserver.
import { AnimatePresence, motion, MotionConfig, useTransform } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import useMeasure from 'react-use-measure';
import { useProgresoScroll } from '@/lib/scroll';
import { cn } from '@/lib/utils';

export interface Topic {
  id: string;
  title: string;
}

export function ScrollIsland({ topics, cta, textos = { inicio: 'La travesía', indice: 'Índice de la página', avance: 'Travesía' }, locale = 'es-CL' }: {
  topics: Topic[];
  cta?: { href: string; label: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void };
  textos?: { inicio: string; indice: string; avance: string };
  /** Idioma para formatear el porcentaje con Intl. */
  locale?: string;
}) {
  const [abierta, setAbierta] = useState(false);
  const [actual, setActual] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [ref, medidas] = useMeasure({ offsetSize: true });
  const idLista = useId();

  const { scrollYProgress } = useProgresoScroll();
  const formato = useMemo(() => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }), [locale]);
  const porcentaje = useTransform(scrollYProgress, p => formato.format(Math.min(1, Math.max(0, p))));
  const anillo = useTransform(scrollYProgress, p => `conic-gradient(#ffd166 ${Math.min(100, Math.max(0, p * 100))}%, rgba(255,255,255,.14) 0)`);

  // Visibilidad con scrollY (barato) y tramo actual con IntersectionObserver: antes se medía cada sección con
  // getBoundingClientRect en cada cuadro de scroll, lo que forzaba a recalcular el diseño (lento en celulares).
  useEffect(() => {
    const alScroll = () => setVisible(scrollY > innerHeight * 0.6);
    alScroll();
    addEventListener('scroll', alScroll, { passive: true });
    // Una sección «ya empezó» si su borde superior pasó el 45 % de la pantalla: corta la franja de arriba
    // (rootMargin) o quedó entera por encima. El tramo actual es la última que empezó.
    const empezo = new Map<string, boolean>();
    const io = new IntersectionObserver(es => {
      for (const e of es) empezo.set(e.target.id, e.isIntersecting || e.boundingClientRect.bottom <= 0);
      let enCurso: string | null = null;
      for (const t of topics) if (empezo.get(t.id)) enCurso = t.id;
      setActual(enCurso);
    }, { rootMargin: '0px 0px -55% 0px' });
    for (const t of topics) { const el = document.getElementById(t.id); if (el) io.observe(el); }
    return () => { removeEventListener('scroll', alScroll); io.disconnect(); };
  }, [topics]);

  useEffect(() => {
    if (!abierta) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierta(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [abierta]);

  const titulo = topics.find(t => t.id === actual)?.title ?? textos.inicio;

  const isla = (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}>
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label={textos.indice}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex justify-center px-4"
          >
            <motion.div
              className="pointer-events-auto flex flex-col overflow-hidden border-2 border-white/10 bg-tinta text-white shadow-[0_10px_40px_rgba(27,18,48,.45)]"
              initial={{ borderRadius: 32 }}
              animate={{ height: medidas.height > 0 ? medidas.height : 'auto', width: abierta ? 'min(400px, 92vw)' : 'min(360px, 92vw)', borderRadius: abierta ? 26 : 32 }}
            >
              <div ref={ref} className="flex w-full flex-col">
                <AnimatePresence mode="popLayout">
                  {abierta && (
                    <motion.ul
                      id={idLista}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-h-[55dvh] overflow-y-auto overscroll-contain px-2 pt-2"
                    >
                      {topics.map(t => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            onClick={() => setAbierta(false)}
                            aria-current={actual === t.id ? 'location' : undefined}
                            className={cn('flex min-h-11 items-center gap-3 rounded-xl px-3 font-ui text-[15px] font-bold text-white/70 hover:bg-white/10 hover:text-white', actual === t.id && 'text-oro')}
                          >
                            <span className={cn('size-2 rounded-full', actual === t.id ? 'bg-oro' : 'bg-white/25')} />
                            {t.title}
                          </a>
                        </li>
                      ))}
                      <li className="mx-3 my-1 h-px bg-white/10" aria-hidden />
                    </motion.ul>
                  )}
                </AnimatePresence>

                <div className="flex h-14 items-center gap-2 pr-2 pl-2">
                  <button
                    type="button"
                    onClick={() => setAbierta(!abierta)}
                    aria-expanded={abierta}
                    aria-controls={abierta ? idLista : undefined}
                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full py-1 pr-2 pl-1 text-left active:scale-[.98]"
                  >
                    <motion.span
                      className="relative size-9 shrink-0 rounded-full"
                      style={{ background: anillo }}
                    >
                      <span className="absolute inset-[3px] grid place-items-center rounded-full bg-tinta">
                        <svg viewBox="-54 -50 120 64" className="w-5" aria-hidden>
                          <path d="M-50 -30 L-26 -30 L-26 -18 L30 -18 Q42 -22 58 -38 Q56 -6 26 4 L-30 4 Q-48 0 -50 -16Z" fill="#7b4dff" />
                          <path d="M-3 -48 V-16" stroke="#fff" strokeWidth="7" />
                          <path d="M-26 -46 L26 -42 L22 -22 L-24 -24Z" fill="#fff" />
                        </svg>
                      </span>
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-ui text-[11px] font-extrabold tracking-[.14em] text-white/55 uppercase tabular-nums">
                        {textos.avance} · <motion.span>{porcentaje}</motion.span>
                      </span>
                      <span className="block truncate font-ui text-[15px] font-bold">{titulo}</span>
                    </span>
                    <motion.span animate={{ rotate: abierta ? 180 : 0 }} className="text-white/60"><ChevronUp className="size-5" /></motion.span>
                  </button>
                  {cta && (
                    <a href={cta.href} onClick={cta.onClick} data-wipe="dv"
                      className="shrink-0 rounded-full bg-oro px-4 py-2.5 font-ui text-sm font-extrabold tracking-wide text-tinta uppercase shadow-[0_3px_0_#d6a572] transition hover:brightness-105 active:translate-y-[3px] active:shadow-none">
                      {cta.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {abierta && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden
            className="fixed inset-0 z-[59] bg-tinta/30 backdrop-blur-[2px]" onClick={() => setAbierta(false)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );

  return createPortal(isla, document.body);
}
