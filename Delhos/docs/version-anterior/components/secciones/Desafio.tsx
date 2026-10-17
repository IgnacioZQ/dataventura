// El desafío: el problema general de la educación, la tecnología y la innovación, y la respuesta de Delhos.
// Animado e interactivo (pedido del usuario): pestañas fluidas, interruptor desafío/respuesta y escenas que
// pasan del problema a la solución. Avanza solo mientras está a la vista y se detiene si la persona interactúa.
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Mancha } from '@/components/Fondos';
import { Contenedor, Encabezado, Icono, Revelar } from '@/components/Piezas';
import { FluidTabs } from '@/components/ui/watermelon/fluid-tabs';
import { recurso } from '@/config';
import { DESAFIOS } from '@/contenido';
import { cn } from '@/lib/utils';

const RESORTE = { type: 'spring' as const, stiffness: 140, damping: 18 };

function EscenaEducacion({ resuelto }: { resuelto: boolean }) {
  const barras = [38, 62, 50, 88, 74];
  const codigo = ['import pandas as pd', 'df = pd.read_csv("datos.csv")', 'df.groupby("mes").sum().plot()'];
  return (
    <div className="relative grid h-full grid-cols-2 gap-4 p-5">
      <motion.div layout transition={RESORTE} className={cn('flex flex-col gap-2.5 rounded-[18px] border-[1.5px] border-linea bg-superficie p-4', resuelto ? 'col-span-1' : 'col-span-2')}>
        <span className="font-mono text-[11px] tracking-[.14em] text-texto-suave uppercase">Teoría</span>
        {[92, 78, 85, 60, 88, 70, 45].slice(0, resuelto ? 5 : 7).map((w, i) => (
          <motion.span key={i} layout className="h-2.5 rounded-full bg-linea" style={{ width: `${w}%` }} />
        ))}
        {!resuelto && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2 self-end rounded-full bg-superficie-alt px-3 py-1 font-mono text-[12px] text-texto-suave">memorizar · repetir</motion.span>}
      </motion.div>
      <AnimatePresence>
        {resuelto && (
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={RESORTE} className="flex flex-col gap-3 rounded-[18px] bg-noche p-4">
            <span className="font-mono text-[11px] tracking-[.14em] text-celeste uppercase">Práctica</span>
            <div className="font-mono text-[11.5px] leading-5 text-[#DCE7F2]">
              {codigo.map((l, i) => <motion.p key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.25 }} className="truncate">{l}</motion.p>)}
            </div>
            <div className="mt-auto flex h-20 items-end gap-1.5">
              {barras.map((h, i) => <motion.span key={i} className="flex-1 rounded-t-md" style={{ background: i === 3 ? '#FBBF24' : '#4A90C2' }} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.7 + i * 0.08, ...RESORTE }} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const HERRAMIENTAS = ['Python', 'SQL', 'IA', 'Datos', 'Gráficos', 'R'];
const DISPERSAS = [{ x: 8, y: 12, r: -12 }, { x: 64, y: 6, r: 9 }, { x: 74, y: 62, r: -6 }, { x: 4, y: 70, r: 14 }, { x: 38, y: 78, r: -10 }, { x: 44, y: 30, r: 7 }];

function EscenaTecnologia({ resuelto }: { resuelto: boolean }) {
  return (
    <div className="relative h-full">
      <AnimatePresence>
        {resuelto && (
          <motion.svg key="lineas" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {HERRAMIENTAS.map((_, i) => {
              const a = (i / HERRAMIENTAS.length) * Math.PI * 2 - Math.PI / 2;
              return <motion.line key={i} x1="50" y1="50" x2={50 + Math.cos(a) * 34} y2={50 + Math.sin(a) * 34} stroke="#93C5FD" strokeWidth="0.6" strokeDasharray="1.5 1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }} />;
            })}
          </motion.svg>
        )}
      </AnimatePresence>
      <motion.div className="absolute top-1/2 left-1/2 grid size-[74px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22px] bg-gradient-to-br from-degradado-inicio to-azul shadow-[0_24px_50px_-18px_rgba(22,50,77,.8)]"
        animate={{ scale: resuelto ? 1 : 0, rotate: resuelto ? 0 : -90 }} transition={RESORTE}>
        <img src={recurso('marca/delhos-simbolo-blanco.svg')} alt="" className="size-11" />
      </motion.div>
      {HERRAMIENTAS.map((h, i) => {
        const a = (i / HERRAMIENTAS.length) * Math.PI * 2 - Math.PI / 2;
        const d = DISPERSAS[i];
        return (
          <motion.span key={h} className="absolute rounded-full border-[1.5px] px-3.5 py-1.5 font-mono text-[13px] font-medium whitespace-nowrap"
            animate={resuelto
              ? { left: `${50 + Math.cos(a) * 34}%`, top: `${50 + Math.sin(a) * 34}%`, x: '-50%', y: '-50%', rotate: 0, opacity: 1, backgroundColor: '#ffffff', borderColor: '#1E6194', color: '#081D35' }
              : { left: `${d.x}%`, top: `${d.y}%`, x: '0%', y: '0%', rotate: d.r, opacity: 0.55, backgroundColor: '#EFF6FF', borderColor: '#DBE6F0', color: '#5B7186' }}
            transition={{ ...RESORTE, delay: resuelto ? i * 0.05 : 0 }}>
            {h}
          </motion.span>
        );
      })}
    </div>
  );
}

function EscenaInnovacion({ resuelto }: { resuelto: boolean }) {
  const asientos = Array.from({ length: 15 }, (_, i) => i);
  const colores = ['#1E6194', '#4A90C2', '#93C5FD', '#FBBF24', '#2B7CB3', '#7b4dff'];
  return (
    <div className="relative flex h-full flex-col items-center gap-4 p-5">
      <motion.div layout transition={RESORTE} className={cn('flex items-center justify-center gap-2 rounded-[16px] font-mono text-[12px] tracking-[.12em] uppercase', resuelto ? 'h-10 w-48 bg-chispa text-on-chispa' : 'h-16 w-[85%] bg-linea text-texto-suave')}>
        {resuelto ? <><span className="size-2 animate-pulse rounded-full bg-[#B91C1C]" /> En vivo · retos · juego</> : 'Pizarra'}
      </motion.div>
      <div className={cn('grid gap-3 transition-all', resuelto ? 'grid-cols-5' : 'grid-cols-5')}>
        {asientos.map(i => (
          <motion.span key={i} className="relative grid size-9 place-items-center rounded-full"
            animate={resuelto
              ? { backgroundColor: colores[i % colores.length], y: [0, -6, 0], scale: 1 }
              : { backgroundColor: '#DBE6F0', y: 0, scale: 0.85 }}
            transition={resuelto ? { y: { repeat: Infinity, duration: 1.4 + (i % 4) * 0.2, delay: i * 0.05 }, default: { duration: 0.3, delay: i * 0.03 } } : { duration: 0.3 }}>
            {resuelto && i % 4 === 1 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.04 }} className="absolute -top-5 -right-3 rounded-full bg-white px-1.5 font-mono text-[10px] text-tinta shadow">?</motion.span>}
            {resuelto && i % 5 === 3 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.04 }} className="text-white"><Icono nombre="check" tam={16} /></motion.span>}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const ESCENAS = { educacion: EscenaEducacion, tecnologia: EscenaTecnologia, innovacion: EscenaInnovacion };

export function Desafio() {
  const [activo, setActivo] = useState(DESAFIOS[0].id);
  const [estado, setEstado] = useState<'problema' | 'respuesta'>('problema');
  const [manual, setManual] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: '-20% 0px' });

  // Avance automático: el desafío, luego la respuesta y luego el siguiente tema.
  useEffect(() => {
    if (manual || !visible || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t1 = setTimeout(() => setEstado('respuesta'), 2600);
    const t2 = setTimeout(() => {
      const i = DESAFIOS.findIndex(d => d.id === activo);
      setActivo(DESAFIOS[(i + 1) % DESAFIOS.length].id);
      setEstado('problema');
    }, 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [activo, manual, visible]);

  const d = DESAFIOS.find(x => x.id === activo)!;
  const i = DESAFIOS.indexOf(d);
  const Escena = ESCENAS[d.id as keyof typeof ESCENAS];
  const resuelto = estado === 'respuesta';

  return (
    <section id="desafio" className="relative overflow-hidden bg-superficie py-20 sm:py-[120px]">
      <Mancha color="rgba(147,197,253,.16)" semilla={71} tam={600} className="-right-56 top-10" />
      <Contenedor className="relative">
        <Encabezado kicker="El desafío" titulo="El mundo cambió." destacado="La forma de aprender, no tanto." centrado
          bajada="Hoy hace falta saber programar y pensar con datos, pero la educación, la tecnología y la innovación siguen avanzando cada una por su lado. Estos son los tres desafíos que nos mueven." />

        <div ref={caja} className="mt-12 flex flex-col items-center gap-8">
          <FluidTabs ariaLabel="Desafíos" panelId="panel-desafio" active={activo}
            onChange={id => { setManual(true); setActivo(id); setEstado('problema'); }}
            tabs={DESAFIOS.map(x => ({ id: x.id, label: x.nombre, icon: <Icono nombre={x.icono} tam={18} />, color: '#1E6194' }))} />

          <div id="panel-desafio" role="tabpanel" className="grid w-full items-stretch gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="dh-tarjeta relative h-[340px] overflow-hidden bg-fondo sm:h-[380px]">
              <div className="flex items-center justify-between border-b border-linea px-5 py-3">
                <span className="font-mono text-[12px] tracking-[.12em] text-texto-suave uppercase">
                  <AnimatePresence mode="wait"><motion.span key={`${activo}-${estado}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-block">{d.estados[resuelto ? 1 : 0]}</motion.span></AnimatePresence>
                </span>
                <div className="flex rounded-full border border-linea bg-superficie p-0.5" role="group" aria-label="Ver el desafío o la respuesta">
                  {(['problema', 'respuesta'] as const).map(e => (
                    <button key={e} type="button" aria-pressed={estado === e} onClick={() => { setManual(true); setEstado(e); }}
                      className={cn('relative min-h-9 rounded-full px-3 text-[13px] font-bold transition-colors', estado === e ? 'text-white' : 'text-texto-suave hover:text-tinta')}>
                      {estado === e && <motion.span layoutId="interruptor-desafio" className="absolute inset-0 rounded-full bg-azul" transition={{ type: 'spring', stiffness: 300, damping: 26 }} />}
                      <span className="relative">{e === 'problema' ? 'El desafío' : 'La respuesta'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[calc(100%-53px)]"><Escena resuelto={resuelto} /></div>
              {!manual && visible && (
                <motion.span key={`${activo}-barra`} aria-hidden className="absolute bottom-0 left-0 h-1 bg-chispa" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 9.5, ease: 'linear' }} />
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activo} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="flex flex-col justify-center gap-4" aria-live="polite">
                <span className="dh-kicker">Desafío 0{i + 1} · {d.nombre}</span>
                <h3 className="dh-h2">{d.titulo}</h3>
                <p className="text-texto">{d.texto}</p>
                <motion.div animate={{ backgroundColor: resuelto ? '#EFF6FF' : 'rgba(239,246,255,0)', borderColor: resuelto ? '#1E6194' : '#DBE6F0' }} transition={{ duration: 0.3 }}
                  className="rounded-[18px] border-[1.5px] p-4">
                  <span className="flex items-center gap-2 font-bold text-tinta"><Icono nombre="objetivo" tam={20} className="text-azul" />Nuestra respuesta</span>
                  <p className="mt-1 text-texto">{d.respuesta}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Revelar className="flex flex-wrap items-center justify-center gap-3 pt-2 text-center">
            <span className="font-display text-xl font-semibold tracking-[-0.015em] text-tinta">Por eso Delhos une los tres mundos</span>
            <a href="#productos" className="flex items-center gap-2 rounded-full border-[1.5px] border-linea bg-superficie px-3 py-1.5 font-semibold text-tinta transition hover:-translate-y-0.5 hover:border-dv">
              <img src={recurso('assets/dataventura/dataventura-icon.svg')} alt="" className="size-7 rounded-lg" />Dataventura
            </a>
            <a href="#servicios" className="flex items-center gap-2 rounded-full border-[1.5px] border-linea bg-superficie px-3 py-1.5 font-semibold text-tinta transition hover:-translate-y-0.5 hover:border-academy">
              <img src={recurso('assets/academy/academy-logo-192.png')} alt="" className="size-7 rounded-lg" />Delhos Academy
            </a>
          </Revelar>
        </div>
      </Contenedor>
    </section>
  );
}
