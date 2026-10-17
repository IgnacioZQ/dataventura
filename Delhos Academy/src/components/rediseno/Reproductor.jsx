// Reproduce una composición de Remotion en vivo con @remotion/player: arranca solo cuando está a la vista,
// se pausa al salir y no se mueve si la persona pidió reducir el movimiento (queda en un cuadro representativo).
// Las animaciones que se reproducen solas tienen un botón para pausarlas (visible al llegar con el teclado).
import { Player } from '@remotion/player';
import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function Reproductor({ component, inputProps, duracion, fps = 30, ancho, alto, cuadroQuieto = 60, controles = false, etiqueta, className, style }) {
  const player = useRef(null);
  const caja = useRef(null);
  const visible = useInView(caja, { margin: '-15% 0px' });
  const reducir = useReducedMotion();
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (reducir) { p.pause(); p.seekTo(cuadroQuieto); return; }
    if (visible && !pausado) p.play(); else p.pause();
  }, [visible, cuadroQuieto, reducir, pausado]);

  return (
    <div ref={caja} className={`relative ${className ?? ''}`} style={style}>
      <div role={controles ? undefined : 'img'} aria-label={controles ? undefined : etiqueta}>
        <Player
          ref={player}
          component={component}
          inputProps={inputProps}
          durationInFrames={duracion}
          fps={fps}
          compositionWidth={ancho}
          compositionHeight={alto}
          style={{ width: '100%', aspectRatio: `${ancho} / ${alto}` }}
          loop
          controls={controles}
          clickToPlay={controles}
          initiallyMuted
          acknowledgeRemotionLicense
          initialFrame={cuadroQuieto}
        />
      </div>
      {!controles && !reducir && (
        <button type="button" onClick={() => setPausado(v => !v)}
          className="btn btn-w sr-only !min-h-9 !px-3 !text-sm focus:not-sr-only focus:absolute focus:bottom-3 focus:right-3">
          {pausado ? 'Reanudar animación' : 'Pausar animación'}
        </button>
      )}
    </div>
  );
}
