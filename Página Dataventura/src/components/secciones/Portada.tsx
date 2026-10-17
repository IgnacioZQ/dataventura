// Portada del diseño «Dataventura Landing» (Hero.dc.html): manchas a la deriva, foco que sigue al cursor, rejilla
// de puntos, círculo con anillo punteado, fichas animadas y el Capitán NEXUS que mira y cambia de pose al tocarlo.
// Mejoras: palabras del título con entrada escalonada, botón con brillo de Watermelon UI e imán de Motion Primitives.
import { AnimatePresence, motion, type MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { type PointerEvent, type ReactNode, useRef, useState } from 'react';
import { Nexus, type Pose } from '@/components/Nexus';
import { Gema, Llama } from '@/components/Piezas';
import { Magnetic } from '@/components/ui/motion-primitives/magnetic';
import { ShimmerLink } from '@/components/ui/watermelon/shimmer-button';
import { app } from '@/config';
import { useIdioma } from '@/i18n/idioma';

const POSES: Pose[] = ['hello', 'idle', 'happy', 'think', 'oops'];

function Ficha({ className, children, x, y, giro = 0 }: { className: string; children: ReactNode; x: MotionValue<number>; y: MotionValue<number>; giro?: number }) {
  return (
    <motion.div className={`absolute z-20 ${className}`} style={{ x, y, rotate: giro }}
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.7 }}>
      {children}
    </motion.div>
  );
}

export function Portada() {
  const { t } = useIdioma();
  const reducir = useReducedMotion();
  const [i, setI] = useState(0);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 }), sy = useSpring(my, { stiffness: 120, damping: 18 });
  // El foco de luz es un círculo fijo que se mueve con transform (antes se repintaba el gradiente en cada cuadro).
  const medida = useRef({ ancho: 0, alto: 0 });
  const focoX = useTransform(sx, v => (v * medida.current.ancho) / 2), focoY = useTransform(sy, v => (v * medida.current.alto) / 2);
  // La mirada de NEXUS va por variables CSS (--nx-mx / --nx-my), sin re-renderizar la portada en cada movimiento.
  const botonNexus = useRef<HTMLButtonElement>(null);
  useMotionValueEvent(mx, 'change', v => botonNexus.current?.style.setProperty('--nx-mx', v.toFixed(3)));
  useMotionValueEvent(my, 'change', v => botonNexus.current?.style.setProperty('--nx-my', v.toFixed(3)));
  const p0x = useTransform(sx, v => v * -8), p0y = useTransform(sy, v => v * -8);
  const p1x = useTransform(sx, v => v * 18), p1y = useTransform(sy, v => v * 18);
  const p2x = useTransform(sx, v => v * -22), p2y = useTransform(sy, v => v * -22);
  const p3x = useTransform(sx, v => v * 12), p3y = useTransform(sy, v => v * 12);

  const mover = (e: PointerEvent<HTMLElement>) => {
    if (reducir) return;
    const r = e.currentTarget.getBoundingClientRect();
    medida.current = { ancho: r.width, alto: r.height };
    const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    mx.set(nx); my.set(ny);
  };
  const salir = (e: PointerEvent<HTMLElement>) => { if (e.pointerType !== 'touch') { mx.set(0); my.set(0); } };
  const burbuja = (t.bubbles as string[])[i % t.bubbles.length];

  const pose = POSES[i % POSES.length];
  const acentos = new Set(t.heroAccent as number[]);
  const palabras = t.heroWords as string[];

  return (
    <section id="inicio" onPointerMove={mover} onPointerDown={mover} onPointerLeave={salir} className="relative overflow-clip bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]">
        <div className="mancha-viva mv1" /><div className="mancha-viva mv2" /><div className="mancha-viva mv3" />
        <motion.div className="absolute top-1/2 left-1/2 -mt-[520px] -ml-[520px] size-[1040px] will-change-transform"
          style={{ x: focoX, y: focoY, background: 'radial-gradient(circle closest-side, rgba(123,77,255,.12), transparent 65%)' }} />
        <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(#e5e0f2_1.5px,transparent_1.5px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-14 gap-y-10 px-5 pt-12 pb-20">
        {/* Arte: NEXUS con fichas */}
        <div className="relative flex min-h-[470px] max-w-[480px] flex-[1_1_380px] flex-col items-center justify-center max-sm:min-h-0 max-sm:pb-16">
          <motion.div aria-hidden style={{ x: p0x, y: p0y }} className="absolute top-[66px] left-1/2 -ml-[180px] size-[360px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4f0ff,#e1d8ff)] max-sm:top-[84px] max-sm:-ml-[150px] max-sm:size-[300px]" />
          <div aria-hidden className="anillo absolute top-[41px] left-1/2 -ml-[205px] size-[410px] rounded-full border-2 border-dashed border-lila-300 max-sm:hidden" />

          <Ficha className="top-[118px] left-0 max-sm:top-auto max-sm:bottom-0" x={p1x} y={p1y} giro={-6}>
            <div className="flota flex items-center gap-2 rounded-2xl border-2 border-borde bg-white px-3.5 py-2.5 shadow-[0_4px_0_#e5e0f2]">
              <span className="llamita inline-flex"><Llama tam={22} /></span>
              <span className="font-ui text-[15px] font-extrabold text-[#c0344f]">{String(t.chipStreak).replace('{n}', '6')}</span>
            </div>
          </Ficha>
          <Ficha className="right-0 bottom-[84px] max-sm:bottom-0" x={p2x} y={p2y} giro={5}>
            <div className="flota d2 flex items-center gap-2 rounded-2xl bg-oro px-4 py-2.5 shadow-[0_4px_0_#d6a572]">
              <span className="gema-gira inline-flex"><Gema tam={20} /></span>
              <span className="font-display text-xl text-tinta">{t.chipGems}</span>
            </div>
          </Ficha>
          <Ficha className="top-[178px] right-1 max-sm:hidden" x={p3x} y={p3y}>
            <div className="flota d3 box-content flex h-[46px] items-end gap-[5px] rounded-[14px] border-2 border-borde bg-white p-2.5 shadow-[0_4px_0_#e5e0f2]" aria-hidden>
              {[18, 30, 24, 44].map((h, k) => <span key={k} className={`eq eq${k + 1} block w-2.5 rounded-[4px]`} style={{ height: h, background: k === 3 ? '#7b4dff' : '#cdbcff' }} />)}
            </div>
          </Ficha>

          {/* Región en vivo estable: el globo visible se vuelve a montar en cada toque y no se anunciaría. */}
          <p className="sr-only" aria-live="polite">{burbuja}</p>
          <AnimatePresence mode="popLayout">
            <motion.p key={i} aria-hidden initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 360, damping: 20 }}
              className="relative z-30 mb-4 max-w-[280px] rounded-[18px] border-2 border-borde bg-white px-[18px] py-3 text-center font-ui text-[17px] leading-tight font-bold shadow-[0_4px_0_#e5e0f2]">
              {burbuja}
              <svg width="22" height="12" viewBox="0 0 22 12" className="absolute -bottom-[11px] left-1/2 -ml-[11px]" aria-hidden><path d="M1 0 L11 10 L21 0Z" fill="#fff" /><path d="M1 0 L11 10 L21 0" fill="none" stroke="#e5e0f2" strokeWidth="2" strokeLinejoin="round" /></svg>
            </motion.p>
          </AnimatePresence>
          <motion.button ref={botonNexus} type="button" onClick={() => setI(i + 1)} aria-label={t.tapHint} whileHover={{ scale: 1.04, rotate: -2 }} whileTap={{ scale: 0.96 }} className="relative z-30 cursor-pointer rounded-3xl">
            <Nexus pose={pose} tam={236} saludo={pose === 'hello'} seguirCursor decorativo />
          </motion.button>
          <span className="pista relative z-30 mt-2.5 inline-flex items-center gap-1.5 font-ui text-xs font-extrabold tracking-[.1em] text-suave">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 11V5a2 2 0 0 1 4 0v6" /><path d="M13 9a2 2 0 0 1 4 0v3" /><path d="M17 11a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L4.5 15a2 2 0 0 1 3.3-2.2L9 14" /></svg>
            {t.tapHint}
          </span>
        </div>

        {/* Texto */}
        <div className="flex max-w-[500px] flex-[1_1_400px] flex-col items-start gap-[22px]">
          <motion.span initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#e1d8ff] bg-lila-200 py-1.5 pr-3.5 pl-2 font-ui text-xs font-extrabold tracking-[.14em] text-dv-700">
            <span className="size-2 rounded-full bg-verde shadow-[0_0_0_4px_#dff7ec]" />{t.eyebrow}
          </motion.span>
          <h1 className="font-display text-[clamp(38px,5.2vw,60px)] leading-[1.04] tracking-[-0.01em] text-balance text-tinta">
            {palabras.map((w, k) => (
              <motion.span key={`${w}-${k}`} className="inline-block" style={{ color: acentos.has(k) ? '#7b4dff' : undefined }}
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.75, delay: 0.08 + k * 0.07, ease: [0.2, 0.8, 0.2, 1] }}>
                {w}{k < palabras.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.6 }} className="max-w-[460px] text-[19px] leading-[1.55] font-bold text-suave">{t.heroSub}</motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54, duration: 0.6 }} className="flex w-full flex-wrap gap-3">
            <Magnetic intensity={0.2} range={110}>
              <ShimmerLink href={app('/')} data-wipe="dv" className="brillo !min-h-[58px] w-full !px-6 sm:w-auto">
                {t.start}
                <svg className="empuja" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </ShimmerLink>
            </Magnetic>
            <a href={app('/login')} data-wipe="dv" className="btn-juego blanco !min-h-[54px] flex-[1_1_200px] sm:flex-none">{t.have}</a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.66 }} className="flex flex-wrap gap-x-[18px] gap-y-2">
            {(t.trust as string[]).map(x => (
              <li key={x} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-suave">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="11" fill="#dff7ec" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#167a55" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{x}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
