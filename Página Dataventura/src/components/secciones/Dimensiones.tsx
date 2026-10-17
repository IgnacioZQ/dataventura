import { motion } from 'motion/react';
import { Contenedor } from '@/components/Piezas';
import { InView } from '@/components/ui/motion-primitives/in-view';
import { CardSwipe } from '@/components/ui/watermelon/card-swipe';
import { DIMENSIONES } from '@/contenido';
import { useIdioma } from '@/i18n/idioma';

type Dimension = (typeof DIMENSIONES)[number];

/** Dibujo pequeño y animado para cada dimensión. */
function Dibujo({ id, color, causa }: { id: Dimension['id']; color: string; causa: string }) {
  const suave = `${color}55`;
  if (id === 'lectura') return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden>
      {[50, 30, 40, 20].map((v, i) => (
        <motion.rect key={i} x={14 + i * 36} width="26" rx="5" fill={i === 0 ? color : suave} initial={{ y: 92, height: 0 }} whileInView={{ y: 92 - v * 1.6, height: v * 1.6 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 12 }} />
      ))}
      <line x1="8" y1="92" x2="152" y2="92" stroke="#1b1230" strokeOpacity=".15" strokeWidth="3" />
    </svg>
  );
  if (id === 'numeros') return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden>
      <motion.circle cx="80" cy="50" r="38" fill="none" stroke={suave} strokeWidth="16" />
      <motion.circle cx="80" cy="50" r="38" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" transform="rotate(-90 80 50)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 0.62 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      <text x="80" y="58" textAnchor="middle" fontFamily="Lilita One" fontSize="24" fill="#1b1230">62%</text>
    </svg>
  );
  if (id === 'estadistica') return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => {
        const x = 18 + (i * 61) % 124, y = 20 + ((i * 37) % 60);
        return <motion.circle key={i} cx={x} cy={y} r="5" fill={i % 5 === 0 ? color : suave} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} />;
      })}
      <motion.line x1="18" x2="142" y1="52" y2="52" stroke={color} strokeWidth="3" strokeDasharray="6 6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} />
    </svg>
  );
  if (id === 'critico') return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden>
      <motion.polyline points="12,80 44,64 76,58 108,36 148,22" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      <motion.polyline points="12,86 44,72 76,66 108,48 148,30" fill="none" stroke={suave} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
      <motion.text x="80" y="22" textAnchor="middle" fontFamily="Lilita One" fontSize="20" fill="#1b1230" initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1 }}>{causa}</motion.text>
    </svg>
  );
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden>
      {[{ x: 22, v: 70, t: 'A' }, { x: 92, v: 46, t: 'B' }].map((o, i) => (
        <g key={o.t}>
          <motion.rect x={o.x} width="46" rx="8" fill={i === 0 ? suave : color} initial={{ y: 88, height: 0 }} whileInView={{ y: 88 - o.v, height: o.v }} viewport={{ once: true }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 110, damping: 12 }} />
          <text x={o.x + 23} y="98" textAnchor="middle" fontFamily="Outfit" fontWeight="800" fontSize="11" fill="#6b6580">{o.t}</text>
        </g>
      ))}
      <motion.path d="M124 18 l6 6 12 -14" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} />
    </svg>
  );
}

export function Dimensiones() {
  const { t } = useIdioma();
  const lista = DIMENSIONES.map((d, i) => ({ ...d, ...t.dims.lista[i] }));
  return (
    <section id="dimensiones" className="relative overflow-hidden bg-white py-16 md:py-20">
      {/* minmax(0,1fr): en 320 px la columna no se ensancha con la tarjeta y el texto no se corta. */}
      <Contenedor className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 md:grid-cols-[1fr_auto]">
        <InView variants={{ hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0 } }} transition={{ duration: 0.55 }} once>
          <div className="flex min-w-0 flex-col items-start gap-4">
            <span className="pildora"><b>08</b>{t.dims.pill}</span>
            <h2 className="titulo-seccion text-dv">{t.dims.h}</h2>
            <p className="max-w-lg text-lg font-semibold text-suave">{t.dims.p}</p>
            <ul className="mt-2 hidden flex-col gap-2 md:flex">
              {lista.map((d, i) => (
                <li key={d.id} className="flex items-center gap-3 font-ui font-bold text-suave">
                  <span className="grid size-7 place-items-center rounded-lg font-display text-sm text-white" style={{ background: d.texto }}>{i + 1}</span>{d.nombre}
                </li>
              ))}
            </ul>
            <p className="pista mt-2 font-ui text-sm font-extrabold tracking-wide text-suave">{t.dims.arrastra} →</p>
          </div>
        </InView>

        <CardSwipe
          items={lista}
          etiqueta={t.dims.carrusel}
          nombre={d => d.nombre}
          textos={{ anterior: t.dims.anterior, siguiente: t.dims.siguiente, rol: t.dims.rol }}
          render={(d, i) => (
            <div className="flex h-full flex-col p-7">
              <span className="font-ui text-xs font-extrabold tracking-[.14em] uppercase" style={{ color: d.texto }}>{t.dims.de.replace('{n}', String(i + 1))}</span>
              <div className="mt-4 h-[118px] rounded-[22px] p-3" style={{ background: d.fondo }}><Dibujo id={d.id} color={d.color} causa={t.dims.causa} /></div>
              <h3 className="mt-5 font-display text-[28px] leading-[1.05] text-tinta">{d.nombre}</h3>
              <p className="mt-2 font-semibold leading-snug text-suave">{d.idea}</p>
              <div className="mt-auto rounded-2xl border-2 border-dashed px-4 py-3" style={{ borderColor: `${d.color}66` }}>
                <span className="block font-ui text-[11px] font-extrabold tracking-[.12em] text-gris uppercase">{t.dims.caso}</span>
                <span className="font-ui text-[15px] font-bold text-tinta">{d.ejemplo}</span>
              </div>
            </div>
          )}
        />
      </Contenedor>
    </section>
  );
}
