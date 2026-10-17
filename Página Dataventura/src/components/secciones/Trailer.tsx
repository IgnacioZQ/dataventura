// 05 · Así se juega: video de Remotion dibujado en vivo (no es un archivo de video), en el idioma elegido.
// Se reproduce solo cuando está a la vista y se puede saltar por capítulos.
import { Player, type PlayerRef } from '@remotion/player';
import { motion, useInView } from 'motion/react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CAPITULOS, Partida, PARTIDA } from '@/remotion/Partida';
import { useIdioma } from '@/i18n/idioma';
import { cn } from '@/lib/utils';

export function Trailer() {
  const { t } = useIdioma();
  const player = useRef<PlayerRef>(null);
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: '-25% 0px' });
  const [cuadro, setCuadro] = useState(0);
  const titulo = useId();
  const props = useMemo(() => ({ t: t.partida, etapas: (t.st.stages as string[][]).map(s => s[0]) }), [t]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (visible && !matchMedia('(prefers-reduced-motion: reduce)').matches) p.play(); else p.pause();
  }, [visible]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const alCambiar = (e: { detail: { frame: number } }) => setCuadro(e.detail.frame);
    p.addEventListener('frameupdate', alCambiar);
    return () => p.removeEventListener('frameupdate', alCambiar);
  }, []);

  const actual = [...CAPITULOS].reverse().find(c => cuadro >= c.desde)?.id;

  return (
    <section id="partida" className="bg-white px-5 py-16 md:py-20">
      <div className="mx-auto max-w-[1040px]">
        <motion.div initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="pildora !self-center"><b>05</b>{t.trailer.pill}</span>
          <h2 id={titulo} className="titulo-seccion text-dv">{t.trailer.h}</h2>
          <p className="text-lg leading-relaxed font-semibold text-suave">{t.trailer.p}</p>
        </motion.div>

        {/* El Player no acepta aria-label: el grupo que lo contiene toma el nombre del título de la sección. */}
        <div ref={caja} role="group" aria-labelledby={titulo} className="mx-auto mt-10 max-w-[960px]">
          <div className="overflow-hidden rounded-[28px] border-2 border-borde bg-white shadow-[0_8px_0_#e5e0f2,0_30px_60px_-30px_rgba(59,42,110,.35)]">
            <Player ref={player} component={Partida} inputProps={props} durationInFrames={PARTIDA.duracion} fps={PARTIDA.fps}
              compositionWidth={PARTIDA.ancho} compositionHeight={PARTIDA.alto}
              style={{ width: '100%', aspectRatio: `${PARTIDA.ancho} / ${PARTIDA.alto}` }}
              errorFallback={() => null}
              controls loop clickToPlay doubleClickToFullscreen acknowledgeRemotionLicense initiallyMuted />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label={t.trailer.grupo}>
            {CAPITULOS.map((c, i) => (
              <button key={c.id} type="button" aria-current={actual === c.id ? 'true' : undefined} onClick={() => { player.current?.seekTo(c.desde); player.current?.play(); }}
                className={cn('min-h-11 rounded-full border-2 px-4 font-ui text-sm font-extrabold tracking-wide transition active:translate-y-[3px]',
                  actual === c.id ? 'border-dv bg-dv text-white shadow-[0_3px_0_#5a30d6]' : 'border-borde bg-white text-suave shadow-[0_3px_0_#e5e0f2] hover:bg-lila-50')}>
                {t.trailer.capitulos[i]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
