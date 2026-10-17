// Video de lanzamiento (Remotion, vertical 9:16) dentro de la página: se reproduce solo cuando está a la vista,
// sin sonido y en bucle; con «reducir movimiento» queda quieto en el cuadro del cierre.
import { Player, type PlayerRef } from '@remotion/player';
import { useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import { APP_DOMINIO } from '@/config';
import { Lanzamiento, LANZAMIENTO } from '@/remotion/lanzamiento/Lanzamiento';

export default function VideoLanzamiento({ etiqueta }: { etiqueta: string }) {
  const player = useRef<PlayerRef>(null);
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: '-20% 0px' });
  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { p.pause(); p.seekTo(2620); return; }
    if (visible) p.play(); else p.pause();
  }, [visible]);
  return (
    // El Player no reenvía aria-label: el nombre accesible va en el contenedor.
    <div ref={caja} role="group" aria-label={etiqueta}
      className="overflow-hidden rounded-[28px] border-4 border-white/90 bg-dv-700 shadow-[0_14px_0_rgba(27,18,48,.25),0_40px_80px_-30px_rgba(27,18,48,.6)]">
      <Player ref={player} component={Lanzamiento} inputProps={{ base: import.meta.env.BASE_URL, url: APP_DOMINIO }}
        durationInFrames={LANZAMIENTO.duracion} fps={LANZAMIENTO.fps} compositionWidth={LANZAMIENTO.ancho} compositionHeight={LANZAMIENTO.alto}
        style={{ width: '100%', aspectRatio: '9 / 16' }} controls loop clickToPlay initiallyMuted acknowledgeRemotionLicense
        errorFallback={() => null} initialFrame={2620} />
    </div>
  );
}
