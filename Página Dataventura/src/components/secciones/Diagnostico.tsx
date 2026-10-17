// 09 · Diagnóstico gratis: las dos versiones (exprés y completo), un ejemplo de informe y el resultado real de la app.
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Clock3, ListChecks, Zap } from 'lucide-react';
import { useRef } from 'react';
import { Contenedor, Telefono } from '@/components/Piezas';
import { BorderTrail } from '@/components/ui/motion-primitives/border-trail';
import { app } from '@/config';
import { DIMENSIONES } from '@/contenido';
import { useIdioma } from '@/i18n/idioma';

function Pentagono({ etiqueta }: { etiqueta: string }) {
  const niveles = [0.85, 0.5, 0.65, 0.35, 0.55];
  const punto = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [100 + Math.cos(a) * r * 78, 100 + Math.sin(a) * r * 78];
  };
  const forma = (r: (i: number) => number) => Array.from({ length: 5 }, (_, i) => punto(i, r(i)).join(',')).join(' ');
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[230px]" role="img" aria-label={etiqueta}>
      {[1, 0.66, 0.33].map(r => <polygon key={r} points={forma(() => r)} fill="none" stroke="#e5e0f2" strokeWidth="2" />)}
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1="100" y1="100" x2={punto(i, 1)[0]} y2={punto(i, 1)[1]} stroke="#e5e0f2" strokeWidth="2" />)}
      <motion.polygon points={forma(i => niveles[i])} fill="#7b4dff33" stroke="#7b4dff" strokeWidth="3" strokeLinejoin="round" style={{ transformOrigin: '100px 100px' }}
        initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 90, damping: 12, delay: 0.2 }} />
      {niveles.map((n, i) => { const [x, y] = punto(i, n); return <motion.circle key={i} cx={x} cy={y} r="5" fill={DIMENSIONES[i].color} stroke="#fff" strokeWidth="2" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.08 }} />; })}
    </svg>
  );
}

export function Diagnostico() {
  const { t } = useIdioma();
  // El borde que recorre la tarjeta destacada es un bucle infinito en JS: solo con la sección a la vista y sin
  // «reducir movimiento».
  const reducir = useReducedMotion();
  const tarjetas = useRef<HTMLDivElement>(null);
  const aLaVista = useInView(tarjetas);
  const versiones = [
    { ...t.diag.expres, icono: Zap, ruta: '/diagnostico' as const, destacado: true },
    { ...t.diag.completo, icono: ListChecks, ruta: '/diagnostico?tipo=completo' as const, destacado: false }
  ];
  return (
    <section id="diagnostico" className="overflow-x-clip bg-lila-50 py-16 md:py-20">
      <Contenedor className="grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        <div>
          <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }} className="flex flex-col items-start gap-4">
            <span className="pildora"><b>09</b>{t.diag.pill}</span>
            <h2 className="titulo-seccion text-dv">{t.diag.h}</h2>
            <p className="text-lg font-semibold text-suave">{t.diag.p}</p>
          </motion.div>
          <div ref={tarjetas} className="mt-8 grid gap-4 sm:grid-cols-2">
            {versiones.map(d => (
              <a key={d.t} href={app(d.ruta)} data-wipe="dv" className="tarjeta group relative flex flex-col gap-2 overflow-hidden p-6 transition-transform hover:-translate-y-1 active:translate-y-0">
                {d.destacado && !reducir && aLaVista && <BorderTrail className="bg-gradient-to-l from-dv via-oro to-dv" size={90} />}
                <span className="flex items-center gap-2 font-ui text-xs font-extrabold tracking-[.14em] text-dv-700 uppercase"><d.icono className="size-4" strokeWidth={3} />{d.t}</span>
                <span className="flex items-center gap-1.5 font-display text-2xl text-tinta"><Clock3 className="size-5 shrink-0 text-gris" />{d.d}</span>
                <span className="font-semibold text-suave">{d.p}</span>
                <span className="mt-2 font-ui text-sm font-extrabold text-dv group-hover:underline">{d.cta} →</span>
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-6 rounded-[26px] border-2 border-borde bg-white p-6 sm:flex-row">
            <Pentagono etiqueta={t.diag.grafico} />
            <div>
              <p className="font-ui text-xs font-extrabold tracking-[.14em] text-gris">{t.diag.informe}</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {t.dims.lista.map((d, i) => <li key={d.nombre} className="flex items-center gap-2 font-bold text-suave"><span className="size-3 rounded-full" style={{ background: DIMENSIONES[i].color }} />{d.nombre}</li>)}
              </ul>
              <p className="mt-3 text-sm font-semibold text-gris">{t.diag.niveles}</p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto">
          <motion.div initial={{ rotate: 6, y: 40, opacity: 0 }} whileInView={{ rotate: 3, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 80, damping: 14 }}>
            <Telefono src="img/app/app-resultado.webp" alt={t.diag.alt} ancho={270} />
          </motion.div>
          <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }}
            className="absolute top-20 -left-10 rounded-2xl bg-oro px-3.5 py-2 font-display text-lg text-tinta shadow-[0_4px_0_#d6a572] max-sm:-left-2">{t.diag.etapa}</motion.span>
        </div>
      </Contenedor>
    </section>
  );
}
