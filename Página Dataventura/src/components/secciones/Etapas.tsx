// 05 · Las 5 etapas, del componente Stages.dc.html del diseño: avanzan solas cada 3,4 s (pausa al pasar el cursor
// o al elegir una), NEXUS recorre la ruta punteada y un medidor muestra la dificultad. Mejora: los temas reales de
// cada etapa (banco de preguntas) y sus 4 mapas con los colores de su mar.
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import { Nexus } from '@/components/Nexus';
import { MARES } from '@/contenido';
import { useIdioma } from '@/i18n/idioma';

const COLORES = [['#2fbf8a', '#167a55'], ['#8fc4ff', '#2b6cb0'], ['#ffd166', '#8a5a00'], ['#f0556f', '#bd3752'], ['#7b4dff', '#5a30d6']];

export function Ola({ invertida = false }: { invertida?: boolean }) {
  return (
    <svg width="100%" height="70" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden className="block" style={{ transform: invertida ? 'scaleY(-1)' : undefined }}>
      <path d="M0 40 C240 0 480 70 720 36 C960 2 1200 64 1440 30 V70 H0 Z" fill="#f4f0ff" />
    </svg>
  );
}

export function Etapas() {
  const { t } = useIdioma();
  const reducir = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  // Pausa mientras el cursor está encima o el foco del teclado está dentro.
  const encima = useRef(false);
  const enfocado = useRef(false);
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: '-20% 0px' });
  const etapas = t.st.stages as string[][];
  // Ancho de la ruta punteada: NEXUS avanza con transform (x en px) en vez de animar `left`.
  const [ruta, { width: anchoRuta }] = useMeasure();

  useEffect(() => {
    if (reducir || !auto || !visible) return;
    const iv = setInterval(() => { if (!encima.current && !enfocado.current) setIdx(i => (i + 1) % 5); }, 3400);
    return () => clearInterval(iv);
  }, [reducir, auto, visible]);

  const [nombre, ceja, desc] = etapas[idx];
  const c = COLORES[idx];
  const mapas = MARES.slice(idx * 4, idx * 4 + 4);
  // Mientras avanza sola, la tarjeta no se anuncia (si no, el lector repetiría todo cada 3,4 s).
  const anunciar = !auto || !!reducir;

  return (
    <div ref={caja} onMouseEnter={() => { encima.current = true; }} onMouseLeave={() => { encima.current = false; }}
      onFocus={() => { enfocado.current = true; }} onBlur={() => { enfocado.current = false; }} className="flex w-full flex-col gap-[22px]">
      <div className="relative pt-[88px]">
        <div ref={ruta} className="absolute top-[115px] right-[10%] left-[10%] h-1.5 rounded-[3px] bg-[repeating-linear-gradient(90deg,#cdbcff_0_10px,transparent_10px_18px)]" />
        {/* Tramo recorrido: se recorta con clip-path (compositor) en vez de animar el ancho. */}
        <motion.div className="absolute top-[115px] left-[10%] h-1.5 w-[80%] rounded-[3px] bg-dv" initial={false}
          animate={{ clipPath: `inset(0% ${100 - idx * 25}% 0% 0% round 3px)` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
        <motion.div className="pointer-events-none absolute top-1.5 left-[10%] z-10 -translate-x-1/2" initial={false} animate={{ x: (anchoRuta * idx) / 4 }} transition={{ type: 'spring', stiffness: 140, damping: 15 }}>
          <div className="flota relative grid size-14 place-items-center rounded-full border-[3px] border-dv bg-white shadow-[0_4px_0_#5a30d6] max-sm:size-[46px]">
            <Nexus pose={idx === 4 ? 'happy' : idx === 3 ? 'think' : 'idle'} cabeza tam={42} decorativo />
            <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden className="absolute -bottom-3 left-1/2 -ml-[7px]"><path d="M0 0 L7 8 L14 0Z" fill="#5a30d6" /></svg>
          </div>
        </motion.div>
        <div className="relative grid grid-cols-5 gap-1" role="group" aria-label={t.stH}>
          {etapas.map((s, i) => {
            const on = i === idx, hecha = i < idx, col = COLORES[i];
            return (
              <button key={s[0]} type="button" onClick={() => { setIdx(i); setAuto(false); }} aria-pressed={on} aria-label={`${s[0]} · ${s[1]}`}
                className="group flex min-h-11 min-w-0 cursor-pointer flex-col items-center gap-2 active:translate-y-[2px]">
                {/* Círculo de 60 px que se escala (antes animaba ancho, alto, margen y tamaño de letra). El texto
                    es tinta sobre los colores claros y gris AA en las pendientes. */}
                <motion.span className="grid size-[60px] place-items-center rounded-full border-[3px] font-display text-[26px] transition-[translate] group-hover:-translate-y-1"
                  initial={false}
                  animate={{ scale: on ? 1 : 0.8,
                    backgroundColor: on || hecha ? col[0] : '#ffffff', borderColor: on || hecha ? col[1] : '#e5e0f2', color: on || hecha ? (i <= 2 ? '#1b1230' : '#ffffff') : '#6b6580',
                    boxShadow: `0 5px 0 ${on || hecha ? col[1] : '#e5e0f2'}` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}>
                  {hecha
                    ? <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    : i + 1}
                </motion.span>
                <motion.span initial={false} animate={{ y: on ? 0 : -6 }} transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  className="w-full text-center font-ui text-[clamp(11px,1.6vw,15px)] font-extrabold hyphens-auto transition-colors [overflow-wrap:anywhere]" style={{ color: on ? '#1b1230' : '#6b6580' }}>{s[0]}</motion.span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-live={anunciar ? 'polite' : 'off'}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="tarjeta flex flex-wrap items-center gap-x-7 gap-y-[18px] !rounded-3xl px-6 py-[22px]">
          <div className="flex flex-[1_1_320px] flex-col gap-1.5">
            <span className="font-ui text-xs font-extrabold tracking-[.12em]" style={{ color: c[1] }}>{ceja}</span>
            <span className="font-display text-[30px] leading-[1.05] text-tinta">{nombre}</span>
            <span className="text-[17px] leading-relaxed font-semibold text-suave">{desc}</span>
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={t.etapas.temas}>
              {t.etapas.temasPorEtapa[idx].map(tema => <li key={tema} className="rounded-full bg-lila-200 px-2.5 py-1 font-ui text-[12px] font-extrabold text-dv-700">{tema}</li>)}
            </ul>
          </div>
          {/* flex-[0_1_auto]: en 320 px la columna se encoge (antes la lista de mapas se salía de la tarjeta). */}
          <div className="flex max-w-full min-w-[190px] flex-[0_1_auto] flex-col gap-2">
            <span className="font-ui text-xs font-extrabold tracking-[.1em] text-gris">{t.st.diffLabel}</span>
            <div className="flex h-10 items-end gap-1.5" aria-hidden>
              {[0, 1, 2, 3, 4].map(i => <motion.span key={i} className="block w-[30px] rounded-md" style={{ height: 14 + i * 6 }} animate={{ backgroundColor: i <= idx ? c[0] : '#ece8f6' }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} />)}
            </div>
            <span className="mt-2 font-ui text-xs font-extrabold tracking-[.1em] text-gris uppercase">{t.etapas.mapas}</span>
            <ul className="grid grid-cols-2 gap-1.5">
              {mapas.map(m => (
                <li key={m.nombre} className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] leading-tight font-bold" style={{ background: m.mar, borderColor: m.ola, color: 'oscuro' in m ? '#fff' : '#1b1230' }}>
                  <span className="size-2 shrink-0 rounded-full" style={{ background: m.ruta }} />{m.nombre}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
      <p className="text-center font-ui text-sm font-bold text-gris">{t.etapas.nota}</p>
    </div>
  );
}

export function SeccionEtapas() {
  const { t } = useIdioma();
  return (
    <>
      <Ola />
      <section id="etapas" className="bg-lila-100 px-5 pt-12 pb-20">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-[30px]">
          <motion.div initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
            className="flex flex-col items-center gap-3 text-center">
            <span className="pildora !self-center"><b>06</b>{t.stPill}</span>
            <h2 className="titulo-seccion text-tinta">{t.stH}</h2>
            <p className="max-w-[560px] text-lg leading-relaxed font-semibold text-suave">{t.stP}</p>
          </motion.div>
          <Etapas />
        </div>
      </section>
    </>
  );
}
