// Basado en Scroll Island de Watermelon UI (https://ui.watermelon.sh, MIT): una "isla" flotante con el avance
// de lectura en un anillo y un índice que se despliega. Adaptado a Dataventura como la "isla de ruta":
// sigue el scroll de la página, muestra el tramo actual de la travesía y lleva un acceso directo a la app.
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';
import { recurso } from '@/config';

export interface Topic {
  id: string;
  title: string;
}

export function ScrollIsland({ topics, cta }: { topics: Topic[]; cta?: { href: string; label: string } }) {
  const [abierta, setAbierta] = useState(false);
  const [avance, setAvance] = useState(0);
  const [actual, setActual] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [ref, medidas] = useMeasure({ offsetSize: true });

  useEffect(() => {
    const medir = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      setAvance(total > 0 ? Math.min(100, Math.max(0, (scrollY / total) * 100)) : 0);
      setVisible(scrollY > innerHeight * 0.6);
      let enCurso: string | null = null;
      for (const t of topics) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.45) enCurso = t.id;
      }
      setActual(enCurso);
    };
    medir();
    addEventListener('scroll', medir, { passive: true });
    addEventListener('resize', medir);
    return () => { removeEventListener('scroll', medir); removeEventListener('resize', medir); };
  }, [topics]);

  useEffect(() => {
    if (!abierta) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierta(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [abierta]);

  const titulo = topics.find(t => t.id === actual)?.title ?? 'Delhos';

  const isla = (
    <MotionConfig transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}>
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Índice de la página"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
          >
            <motion.div
              className="pointer-events-auto flex flex-col overflow-hidden border border-white/10 bg-noche text-white shadow-[0_18px_40px_-12px_rgba(8,29,53,.7)]"
              initial={{ borderRadius: 32 }}
              animate={{ height: medidas.height > 0 ? medidas.height : 'auto', width: abierta ? 'min(400px, 92vw)' : 'min(360px, 92vw)', borderRadius: abierta ? 26 : 32 }}
            >
              <div ref={ref} className="flex w-full flex-col">
                <AnimatePresence mode="popLayout">
                  {abierta && (
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="max-h-[55dvh] overflow-y-auto px-2 pt-2"
                    >
                      {topics.map(t => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            onClick={() => setAbierta(false)}
                            className={cn('flex min-h-11 items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-semibold text-white/70 hover:bg-white/10 hover:text-white', actual === t.id && 'text-celeste')}
                          >
                            <span className={cn('size-2 rounded-full', actual === t.id ? 'bg-chispa' : 'bg-white/25')} />
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
                    className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full py-1 pr-2 pl-1 text-left"
                  >
                    <motion.span
                      layout
                      className="relative size-9 shrink-0 rounded-full"
                      style={{ background: `conic-gradient(#93C5FD ${avance}%, rgba(255,255,255,.14) 0)` }}
                    >
                      <span className="absolute inset-[3px] grid place-items-center rounded-full bg-noche">
                        <img src={recurso('marca/delhos-simbolo-blanco.svg')} alt="" className="size-5" />
                      </span>
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[11px] font-medium tracking-[.14em] text-white/55 uppercase">Índice · {Math.round(avance)}%</span>
                      <span className="block truncate font-sans text-[15px] font-bold">{titulo}</span>
                    </span>
                    <motion.span animate={{ rotate: abierta ? 180 : 0 }} className="text-white/60"><ChevronUp className="size-5" /></motion.span>
                  </button>
                  {cta && (
                    <a href={cta.href}
                      className="shrink-0 rounded-full bg-celeste px-4 py-2.5 font-sans text-sm font-bold text-noche transition hover:bg-[#BFDBFE]">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[59] bg-noche/30 backdrop-blur-[2px]" onClick={() => setAbierta(false)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );

  return createPortal(isla, document.body);
}
