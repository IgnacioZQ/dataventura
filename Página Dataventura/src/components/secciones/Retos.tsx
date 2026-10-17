// Cinta de temas y retos 01–04 del diseño «Dataventura Landing», jugables y traducidos.
import { AnimatePresence, motion } from 'motion/react';
import { Clock3, Flame, Timer } from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';
import { Nexus } from '@/components/Nexus';
import { Llama, lanzarConfeti, origenDe } from '@/components/Piezas';
import { InfiniteSlider } from '@/components/ui/motion-primitives/infinite-slider';
import { Tilt } from '@/components/ui/motion-primitives/tilt';
import { FluidTabs } from '@/components/ui/watermelon/fluid-tabs';
import { useIdioma } from '@/i18n/idioma';
import { cn } from '@/lib/utils';

/** Cinta morada inclinada con los temas (marquee del diseño), con Infinite Slider de Motion Primitives. */
export function Cinta() {
  const { t } = useIdioma();
  return (
    // overflow-x-clip: la cinta inclinada sobresale a los lados sin crear desplazamiento horizontal.
    <div aria-hidden className="relative z-10 overflow-x-clip py-2">
      <div className="-mx-5 -rotate-[1.6deg] overflow-hidden bg-dv py-4 shadow-[0_6px_0_#5a30d6]">
        <InfiniteSlider gap={0} speed={60} speedOnHover={18}>
          {(t.marquee as string[]).map(m => (
            <span key={m} className="inline-flex items-center gap-[18px] px-[18px] font-display text-2xl whitespace-nowrap text-white">
              {m}
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#ffd166" /></svg>
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}

/** Fila de característica: píldora numerada, título, texto y una pieza jugable. */
export function Fila({ n, pill, titulo, texto, children, invertida = false, extra, id }: { n: string; pill: string; titulo: string; texto: string; children: ReactNode; invertida?: boolean; extra?: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-12 px-5 py-14 md:py-16', invertida && 'flex-wrap-reverse md:flex-row-reverse')}>
      <motion.div initial={{ opacity: 0, x: invertida ? 36 : -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }}
        className="flex max-w-[460px] min-w-0 flex-[1_1_360px] flex-col gap-[18px]">
        <span className="pildora"><b>{n}</b>{pill}</span>
        <h2 className="titulo-seccion text-dv">{titulo}</h2>
        <p className="text-lg leading-relaxed font-semibold text-suave">{texto}</p>
        {extra}
      </motion.div>
      {/* min-w-0: en teléfonos de 320 px la columna se encoge y las tarjetas (max-w-full) no se cortan. */}
      <motion.div initial={{ opacity: 0, x: invertida ? -36 : 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }}
        className="flex max-w-[420px] min-w-0 flex-[1_1_320px] justify-center">
        {children}
      </motion.div>
    </section>
  );
}

export const estiloOpcion = (estado: 'normal' | 'bien' | 'mal' | 'marcada') => cn(
  'min-h-[52px] rounded-[14px] border-2 px-2 font-ui text-base font-extrabold transition-[translate,background-color,border-color,box-shadow,color] active:translate-y-[3px]',
  estado === 'normal' && 'border-borde bg-white text-tinta shadow-[0_4px_0_#e5e0f2] hover:bg-lila-50',
  estado === 'marcada' && 'border-dv bg-lila-200 text-dv-700 shadow-[0_4px_0_#cdbcff]',
  estado === 'bien' && 'border-verde bg-[#dff7ec] text-verde-700 shadow-[0_4px_0_#8fe0b8]',
  estado === 'mal' && 'border-coral bg-[#ffe3e8] text-coral-700 shadow-[0_4px_0_#f5aac6]'
);

function RetoGrafico() {
  const { t } = useIdioma();
  const [eleccion, setEleccion] = useState<'torta' | 'lineas' | null>(null);
  const caja = useRef<HTMLDivElement>(null);
  const elegir = (e: 'torta' | 'lineas') => { if (e === 'lineas' && eleccion !== 'lineas') lanzarConfeti(origenDe(caja.current)); setEleccion(e); };
  const [torta, lineas] = t.f1a as string[];
  return (
    <Tilt rotationFactor={6} className="max-w-full">
      <div ref={caja} className="tarjeta flex w-[310px] max-w-full flex-col gap-4 p-[22px]">
        {/* Barra de avance: se recorta con clip-path (compositor) en vez de animar el ancho. */}
        <div className="h-3 overflow-hidden rounded-full bg-[#ece8f6]" aria-hidden>
          <motion.div className="h-full w-full rounded-full bg-dv" initial={false}
            animate={{ clipPath: eleccion === 'lineas' ? 'inset(0% 0% 0% 0% round 999px)' : 'inset(0% 40% 0% 0% round 999px)' }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} />
        </div>
        <p className="font-display text-[19px] leading-tight text-tinta">{t.f1q}</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => elegir('torta')} aria-pressed={eleccion === 'torta'} className={estiloOpcion(eleccion === 'torta' ? 'mal' : 'normal')}>{torta}</button>
          <button type="button" onClick={() => elegir('lineas')} aria-pressed={eleccion === 'lineas'} className={estiloOpcion(eleccion === 'lineas' ? 'bien' : 'normal')}>{lineas}</button>
        </div>
        {/* Región en vivo estable (lo de adentro se vuelve a montar en cada elección). */}
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {eleccion && (
              <motion.div key={eleccion} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={cn('flex items-center gap-2.5 rounded-[14px] px-3 py-2.5', eleccion === 'lineas' ? 'bg-[#dff7ec]' : 'bg-[#ffe3e8]')}>
                <Nexus pose={eleccion === 'lineas' ? 'happy' : 'oops'} cabeza tam={44} decorativo />
                <span className={eleccion === 'lineas' ? 'font-display text-xl text-verde-700' : 'text-[15px] leading-snug font-extrabold text-coral-700'}>{eleccion === 'lineas' ? t.f1ok : t.f1bad}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Tilt>
  );
}

function RetoSinCodigo() {
  const { t } = useIdioma();
  const [on, setOn] = useState(false);
  const altos = on ? [40, 62, 100, 44] : [30, 45, 60, 38];
  return (
    <div className="flex max-w-full flex-col items-center gap-2.5">
      <button type="button" onClick={() => setOn(!on)} onPointerEnter={e => e.pointerType === 'mouse' && setOn(true)} onPointerLeave={e => e.pointerType === 'mouse' && setOn(false)}
        aria-pressed={on} aria-label={t.f2quote} className="relative h-[260px] w-[320px] max-w-full text-left">
        <motion.div className="absolute top-[30px] left-0 w-[200px] rounded-[18px] bg-tinta p-[18px]" animate={{ rotate: on ? -14 : -5, x: on ? -26 : 0, y: on ? 30 : 0, opacity: on ? 0.35 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
          <code translate="no" className="block font-mono text-sm leading-[1.8] text-[#c9bdf0]">=SUMAR.SI(B2:B9;<br />&gt;100)<br />df.groupby()</code>
          <span className="absolute top-1/2 right-2.5 left-2.5 h-1.5 -rotate-12 rounded bg-coral" />
        </motion.div>
        <motion.div className="tarjeta absolute right-0 bottom-2.5 flex w-[190px] flex-col gap-3 !rounded-[22px] p-[18px]" animate={{ rotate: on ? 0 : 4, scale: on ? 1.08 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
          <div className="flex h-20 items-end gap-2">
            {/* Alto de cada barra con clip-path (compositor), no animando height. */}
            {altos.map((h, i) => <motion.span key={i} className="h-full flex-1 rounded-md" style={{ background: i === 2 ? '#7b4dff' : '#cdbcff' }}
              initial={{ clipPath: 'inset(100% 0% 0% 0% round 6px)' }} animate={{ clipPath: `inset(${100 - h}% 0% 0% 0% round 6px)` }} transition={{ type: 'spring', stiffness: 160, damping: 12 }} />)}
          </div>
          <span className="font-ui text-[15px] font-extrabold text-tinta">{t.f2quote}</span>
        </motion.div>
      </button>
      <span className="pista font-ui text-xs font-extrabold tracking-[.1em] text-suave">{t.f2hint}</span>
    </div>
  );
}

function RetoPrediccion() {
  const { t } = useIdioma();
  const [v, setV] = useState(40);
  const [tocado, setTocado] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const meta = 70;
  const estado = !tocado ? 'quieto' : Math.abs(v - meta) <= 10 ? 'bien' : v > meta ? 'alto' : 'bajo';
  const color = estado === 'quieto' ? '#7b4dff' : estado === 'bien' ? '#2fbf8a' : '#f0556f';
  const y = Math.max(14, Math.min(146, 140 - v));
  const mensajes = { quieto: t.f3start, bien: t.f3good, alto: t.f3high, bajo: t.f3low };
  const mover = (n: number) => {
    const antes = tocado && Math.abs(v - meta) <= 10;
    setV(n); setTocado(true);
    if (Math.abs(n - meta) <= 10 && !antes) lanzarConfeti(origenDe(caja.current));
  };
  return (
    <Tilt rotationFactor={5} className="max-w-full">
      <div ref={caja} className="tarjeta flex w-[330px] max-w-full flex-col gap-3 p-[22px]">
        <p className="font-display text-lg leading-tight text-tinta">{t.f3q}</p>
        <svg viewBox="0 0 280 150" className="h-[150px] w-full" aria-hidden>
          {[140, 95, 50].map(l => <line key={l} x1="10" y1={l} x2="270" y2={l} stroke={l === 140 ? '#e5e0f2' : '#f1eefa'} strokeWidth="2" />)}
          <polyline points="20,112 70,104 120,106 170,88 220,80" fill="none" stroke="#7b4dff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <motion.line x1="220" y1="80" x2="262" animate={{ y2: y, stroke: color }} strokeWidth="4" strokeDasharray="6 7" strokeLinecap="round" />
          <motion.circle cx="262" r="15" opacity=".22" animate={{ cy: y, fill: color }} />
          <motion.circle cx="262" r="9" stroke="#fff" strokeWidth="3" animate={{ cy: y, fill: color }} />
        </svg>
        <div className="flex justify-between px-0.5 font-ui text-xs font-extrabold tracking-wide text-gris">{(t.months as string[]).map(m => <span key={m}>{m}</span>)}</div>
        <label htmlFor="prediccion" className="text-[13px] font-extrabold text-gris">{t.f3label}</label>
        <input id="prediccion" type="range" min={20} max={130} value={v} onChange={e => mover(Number(e.target.value))} className="h-7 w-full cursor-pointer accent-dv" />
        <motion.p aria-live="polite" animate={{ backgroundColor: estado === 'quieto' ? '#efe9ff' : estado === 'bien' ? '#dff7ec' : '#ffe3e8' }}
          className={cn('rounded-[14px] px-3.5 py-2.5 text-[15px] leading-snug font-extrabold', estado === 'quieto' ? 'text-dv-700' : estado === 'bien' ? 'text-verde-700' : 'text-coral-700')}>
          {mensajes[estado]}
        </motion.p>
      </div>
    </Tilt>
  );
}

function RetoRacha() {
  const { t } = useIdioma();
  const [dias, setDias] = useState([true, true, true, true, true, true, false]);
  const [meta, setMeta] = useState('5');
  const caja = useRef<HTMLDivElement>(null);
  const racha = dias.filter(Boolean).length;
  const alternar = (i: number) => {
    const n = dias.slice(); n[i] = !n[i];
    if (n.every(Boolean) && !dias.every(Boolean)) lanzarConfeti(origenDe(caja.current));
    setDias(n);
  };
  return (
    <Tilt rotationFactor={5} className="max-w-full">
      <div ref={caja} className="flex w-[330px] max-w-full flex-col items-center gap-4 rounded-[26px] bg-[#fff4e0] p-6 shadow-[0_6px_0_#f4e3c1]">
        <div className="flex items-center gap-3">
          <motion.span className="llamita inline-flex" animate={{ scale: 0.7 + racha * 0.06 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}><Llama tam={64} /></motion.span>
          <div className="flex flex-col">
            <motion.span key={racha} initial={{ y: -10, opacity: 0, scale: 1.3 }} animate={{ y: 0, opacity: 1, scale: 1 }} className="font-display text-[56px] leading-[.9] text-[#c0344f]">{racha}</motion.span>
            <span className="font-ui text-[13px] font-extrabold tracking-[.06em] text-[#8a5a3c]">{t.f4streak}</span>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 gap-1">
          {(t.dayL as string[]).map((d, i) => (
            <button key={i} type="button" onClick={() => alternar(i)} aria-pressed={dias[i]} aria-label={(t.barD as string[])[i] ?? d} className="flex min-h-11 flex-col items-center gap-1.5 active:translate-y-[3px]">
              <span className="font-ui text-xs font-extrabold text-[#8a5a3c]">{d}</span>
              <motion.span animate={{ scale: dias[i] ? 1 : 0.85, backgroundColor: dias[i] ? '#f0556f' : '#ffffff', borderColor: dias[i] ? '#c0344f' : '#f4e3c1' }}
                transition={{ type: 'spring', stiffness: 320, damping: 14 }} className="block size-[30px] rounded-full border-2" />
            </button>
          ))}
        </div>
        <div className="w-full rounded-[14px] bg-white px-3.5 py-2.5 text-center text-sm font-extrabold text-suave">{t.f4tap}</div>
        <div className="flex w-full flex-col items-center gap-2 rounded-[14px] bg-white p-3">
          <span className="font-ui text-xs font-extrabold tracking-[.12em] text-gris uppercase">{t.meta.titulo}</span>
          <FluidTabs ariaLabel={t.meta.titulo} active={meta} onChange={setMeta} tabs={[
            // Tonos -700 de cada color para que el texto blanco de la pestaña activa pase AA (antes 4,1:1 y 3,4:1).
            { id: '3', label: `3 ${t.meta.min}`, icon: <Timer className="size-4" />, color: '#2b6cb0' },
            { id: '5', label: `5 ${t.meta.min}`, icon: <Clock3 className="size-4" />, color: '#7b4dff' },
            { id: '10', label: `10 ${t.meta.min}`, icon: <Flame className="size-4" />, color: '#bd3752' }
          ]} />
        </div>
      </div>
    </Tilt>
  );
}

export function Retos() {
  const { t } = useIdioma();
  return (
    // overflow-x-clip: la entrada desde la derecha (x: 36) no ensancha la página en 320 px.
    <div id="aprende" className="overflow-x-clip bg-white pt-10">
      <Fila n="01" pill={t.f1pill} titulo={t.f1h} texto={t.f1p}><RetoGrafico /></Fila>
      <Fila n="02" pill={t.f2pill} titulo={t.f2h} texto={t.f2p} invertida><RetoSinCodigo /></Fila>
      <Fila n="03" pill={t.f3pill} titulo={t.f3h} texto={t.f3p}><RetoPrediccion /></Fila>
      <Fila n="04" pill={t.f4pill} titulo={t.f4h} texto={t.f4p} invertida><RetoRacha /></Fila>
    </div>
  );
}
