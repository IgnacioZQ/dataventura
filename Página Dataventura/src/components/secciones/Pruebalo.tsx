// 08 · Pruébalo: resuelve tu primer reto (del diseño «Dataventura Landing»), con NEXUS que reacciona y confeti.
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { Nexus } from '@/components/Nexus';
import { lanzarConfeti, origenDe } from '@/components/Piezas';
import { app } from '@/config';
import { useIdioma } from '@/i18n/idioma';
import { cn } from '@/lib/utils';
import { estiloOpcion } from './Retos';
import { Ola } from './Etapas';

const VISITAS = [120, 135, 128, 190, 210, 260, 240];
const CORRECTA = 1;

export function Pruebalo() {
  const { t } = useIdioma();
  const [elegida, setElegida] = useState<number | null>(null);
  const [revisado, setRevisado] = useState(false);
  const tarjeta = useRef<HTMLDivElement>(null);
  const bien = revisado && elegida === CORRECTA;
  const mal = revisado && elegida !== CORRECTA;
  const dias = t.barD as string[];
  const opciones = t.quizO as string[];

  return (
    <>
      <section id="pruebalo" className="bg-lila-100 px-5 pt-6 pb-20">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-[26px]">
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-2.5 text-center">
            <span className="pildora !self-center"><b>07</b>{t.quizTag}</span>
            <h2 className="titulo-seccion text-tinta">{t.quizH}</h2>
          </motion.div>

          <div className="flex w-full items-end gap-4">
            <div className="shrink-0"><Nexus pose={bien ? 'happy' : mal ? 'oops' : 'think'} tam={110} decorativo /></div>
            <p className="mb-10 min-w-0 flex-1 rounded-[18px] border-2 border-borde bg-white px-[18px] py-3.5 font-ui text-[17px] leading-snug font-bold shadow-[0_4px_0_#e5e0f2]">
              {t.quizQ1}<span className="font-extrabold text-dv">{t.quizQem}</span>{t.quizQ2}
            </p>
          </div>

          <div ref={tarjeta} className="tarjeta w-full overflow-hidden">
            <div className="flex flex-col gap-[18px] px-[26px] pt-[26px] pb-2 max-sm:px-4">
              <div className="flex h-[200px] items-end justify-between gap-2 border-b-2 border-borde px-1" role="img" aria-label={dias.map((d, i) => `${d} ${VISITAS[i]}`).join(', ')}>
                {VISITAS.map((v, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="font-ui text-xs font-extrabold text-gris tabular-nums">{v}</span>
                    <motion.div className="w-full max-w-[54px] origin-bottom rounded-t-[10px] rounded-b-[4px]" style={{ height: Math.round((v / 260) * 150) }}
                      initial={{ scaleY: 0.05 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 140, damping: 14 }}
                      animate={{ backgroundColor: revisado && i === 3 ? '#2fbf8a' : revisado && i === 2 ? '#a98bff' : '#cdbcff' }} />
                  </div>
                ))}
              </div>
              <div className="-mt-2 flex justify-between gap-2 px-1">{dias.map(d => <span key={d} className="flex-1 text-center font-ui text-[13px] font-extrabold text-gris">{d}</span>)}</div>
              <div className="grid grid-cols-2 gap-3">
                {opciones.map((o, i) => (
                  <button key={o} type="button" disabled={revisado} onClick={() => setElegida(i)} aria-pressed={elegida === i}
                    className={cn(estiloOpcion(revisado && i === CORRECTA ? 'bien' : revisado && elegida === i ? 'mal' : elegida === i ? 'marcada' : 'normal'), '!min-h-14 !text-[17px] disabled:cursor-default')}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <motion.div animate={{ backgroundColor: bien ? '#dff7ec' : mal ? '#ffe3e8' : '#ffffff', borderColor: bien ? '#8fe0b8' : mal ? '#f5aac6' : '#e5e0f2' }}
              className="mt-[18px] flex flex-wrap items-center justify-between gap-4 border-t-2 px-[26px] pt-[18px] pb-[22px] max-sm:px-4">
              <div className="min-w-[220px] flex-[1_1_280px]" aria-live="polite">
                <AnimatePresence mode="wait">
                  {bien && <motion.div key="b" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}><p className="font-display text-2xl text-verde-700">{t.rightT}</p><p className="text-[15px] font-bold text-verde-700">{t.rightP}</p></motion.div>}
                  {mal && <motion.div key="m" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}><p className="font-display text-2xl text-coral-700">{t.wrongT}</p><p className="text-[15px] font-bold text-[#a82f47]">{t.wrongP}</p></motion.div>}
                  {!revisado && <motion.p key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[15px] font-bold text-gris">{t.hint}</motion.p>}
                </AnimatePresence>
              </div>
              {/* Un solo botón que cambia de función: el foco no se pierde al pasar de «Revisar» a «Otra vez».
                  Sin elección queda aria-disabled (sigue enfocable y el lector dice que está atenuado). */}
              <button type="button" aria-disabled={!revisado && elegida === null}
                onClick={() => {
                  if (revisado) { setElegida(null); setRevisado(false); return; }
                  if (elegida === null) return;
                  setRevisado(true);
                  if (elegida === CORRECTA) lanzarConfeti(origenDe(tarjeta.current));
                }}
                className={cn('btn-juego',
                  !revisado && elegida === null && '!cursor-not-allowed !bg-[#ece8f6] !text-[#8a84a0] ![--sombra:#e1dcf0] hover:[filter:none] active:[transform:none] active:[box-shadow:0_5px_0_var(--sombra)]',
                  revisado && (bien ? '!bg-verde-700 ![--sombra:#0e5a3e]' : '!bg-coral-700 ![--sombra:#8a2438]'))}>
                {revisado ? t.again : t.check}
              </button>
            </motion.div>
          </div>
          <p className="text-center font-semibold text-gris">{t.quizNote}</p>
          <a href={app('/diagnostico')} data-wipe="dv" className="btn-juego oro">{t.diag.expres.cta}</a>
        </div>
      </section>
      <Ola invertida />
    </>
  );
}
