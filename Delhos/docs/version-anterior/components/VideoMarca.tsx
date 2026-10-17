// Reproductor del video de marca (Remotion). Se carga aparte, solo cuando la sección del ecosistema lo necesita.
import { Player, type PlayerRef } from '@remotion/player';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CAPITULOS, Entrelazar, VIDEO } from '@/remotion/Entrelazar';
import { cn } from '@/lib/utils';

export default function VideoMarca() {
  const player = useRef<PlayerRef>(null);
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: '-25% 0px' });
  const [cuadro, setCuadro] = useState(0);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (visible && !matchMedia('(prefers-reduced-motion: reduce)').matches) p.play(); else p.pause();
  }, [visible]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const f = (e: { detail: { frame: number } }) => setCuadro(e.detail.frame);
    p.addEventListener('frameupdate', f);
    return () => p.removeEventListener('frameupdate', f);
  }, []);

  const actual = [...CAPITULOS].reverse().find(c => cuadro >= c.desde)?.id;
  return (
    <div ref={caja}>
      <div className="overflow-hidden rounded-[32px] border border-linea bg-noche shadow-[0_24px_60px_-24px_rgba(30,61,89,.55)]">
        <Player ref={player} component={Entrelazar} durationInFrames={VIDEO.duracion} fps={VIDEO.fps}
          compositionWidth={VIDEO.ancho} compositionHeight={VIDEO.alto}
          style={{ width: '100%', aspectRatio: `${VIDEO.ancho} / ${VIDEO.alto}` }}
          controls loop clickToPlay initiallyMuted acknowledgeRemotionLicense />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Capítulos del video">
        {CAPITULOS.map(c => (
          <button key={c.id} type="button" aria-pressed={actual === c.id} onClick={() => { player.current?.seekTo(c.desde); player.current?.play(); }}
            className={cn('min-h-11 rounded-full border-[1.5px] px-4 text-sm font-bold transition', actual === c.id ? 'border-azul bg-azul text-white' : 'border-linea bg-superficie text-texto hover:border-borde-control')}>
            {c.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
