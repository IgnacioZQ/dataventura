// Ventana de «Delhos en 20 segundos»: el reproductor de Remotion con los controles del diseño
// (reproducir/pausar, barra para adelantar, capítulos y tiempo). Se abre con el botón del héroe.
import { Player, type PlayerRef } from '@remotion/player';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { CORREO } from '@/config';
import { ESCENAS, Pelicula20, PELICULA } from '@/remotion/Pelicula20';
import { Ico, LOGOS } from './Piezas';

export type ControlPelicula = { abrir: () => void };

const reducir = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const mmss = (f: number) => `00:${String(Math.floor(f / PELICULA.fps)).padStart(2, '0')}`;
const PROPS = { correo: CORREO, logoAcademy: LOGOS.academy, logoDataventura: LOGOS.dataventura };

export const Pelicula = forwardRef<ControlPelicula, { abrirAlMontar?: boolean; onListo?: () => void }>(function Pelicula({ abrirAlMontar = false, onListo }, ref) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const player = useRef<PlayerRef>(null);
  const quienAbrio = useRef<Element | null>(null);
  const reanudar = useRef(false);
  const arranque = useRef(0);
  const [cuadro, setCuadro] = useState(70);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    const alCuadro = (e: { detail: { frame: number } }) => setCuadro(e.detail.frame);
    const alPlay = () => setReproduciendo(true);
    const alPausa = () => setReproduciendo(false);
    p.addEventListener('frameupdate', alCuadro);
    p.addEventListener('play', alPlay);
    p.addEventListener('pause', alPausa);
    return () => { p.removeEventListener('frameupdate', alCuadro); p.removeEventListener('play', alPlay); p.removeEventListener('pause', alPausa); };
  }, []);

  const ir = (f: number) => { player.current?.seekTo(Math.max(0, Math.min(PELICULA.duracion - 1, Math.round(f)))); setCuadro(f); };
  const alternar = useCallback(() => { const p = player.current; if (!p) return; if (p.isPlaying()) p.pause(); else p.play(); }, []);

  const abrir = () => {
    const d = dialogo.current;
    if (!d) return;
    quienAbrio.current = document.activeElement;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    document.body.classList.add('lock');
    // Con movimiento reducido no hay reproducción automática: se muestra un cuadro con el símbolo ya dibujado.
    ir(reducir() ? 70 : 0);
    clearTimeout(arranque.current);
    if (!reducir()) arranque.current = window.setTimeout(() => player.current?.play(), 350);
  };

  useImperativeHandle(ref, () => ({ abrir }));

  // La primera vez se monta al pedirla: avisa que terminó de cargar y se abre sola.
  useEffect(() => {
    onListo?.();
    if (abrirAlMontar) abrir();
    return () => clearTimeout(arranque.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrar = () => { clearTimeout(arranque.current); player.current?.pause(); if (dialogo.current?.open) dialogo.current.close(); };

  return (
    <dialog className="film-modal" id="filmModal" aria-labelledby="filmTitle" aria-describedby="filmDesc" ref={dialogo}
      onClose={() => { clearTimeout(arranque.current); player.current?.pause(); document.body.classList.remove('lock'); (quienAbrio.current as HTMLElement | null)?.focus?.(); }}
      onClick={e => { if (e.target === dialogo.current) cerrar(); }}>
      <div className="film-modal-in">
        <div className="film-modal-head">
          <div><span className="kicker">Delhos en movimiento</span><h2 id="filmTitle">Delhos en 20 segundos.</h2></div>
          <p id="filmDesc" className="sr-only">Video sin sonido de 20 segundos en cinco escenas: el símbolo de Delhos se teje; educación, tecnología e innovación se entrelazan; un análisis en Python convierte datos de ventas en un gráfico; Delhos Academy, cursos en vivo, y Dataventura, la app para pensar con datos, aparecen juntas; y el cierre: «Se aprende haciendo», con el correo contacto@delhosacademy.cl.</p>
          <button className="film-close" type="button" id="filmClose" aria-label="Cerrar video" onClick={cerrar}>
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className={`film ${reproduciendo ? '' : 'paused'}`} id="film">
          <div className="film-screen" id="filmScreen" onClick={e => { if (!(e.target as Element).closest('.film-big')) alternar(); }}>
            <div className="reproductor" aria-hidden="true">
              <Player ref={player} component={Pelicula20} inputProps={PROPS} durationInFrames={PELICULA.duracion} fps={PELICULA.fps}
                compositionWidth={PELICULA.ancho} compositionHeight={PELICULA.alto} style={{ width: '100%', height: '100%' }}
                loop initialFrame={70} acknowledgeRemotionLicense />
            </div>
            <button className="film-big" id="filmBig" type="button" aria-label="Reproducir" tabIndex={reproduciendo ? -1 : undefined} aria-hidden={reproduciendo || undefined} onClick={() => player.current?.play()}><Ico n="play" /></button>
          </div>

          <div className="film-ctrl">
            <button className="film-btn" id="filmPlay" type="button" aria-label={reproduciendo ? 'Pausar' : 'Reproducir'} onClick={alternar}><Ico n={reproduciendo ? 'pause' : 'play'} /></button>
            <div className="film-track">
              <input type="range" id="filmScrub" min={0} max={PELICULA.duracion - 1} step={1} value={cuadro} aria-label="Posición del video"
                aria-valuetext={`${Math.floor(cuadro / PELICULA.fps)} de 20 segundos`}
                onKeyDown={e => { const d = ({ ArrowRight: 30, ArrowUp: 30, ArrowLeft: -30, ArrowDown: -30 } as Record<string, number>)[e.key]; if (d) { e.preventDefault(); ir(cuadro + d); } }}
                style={{ '--fp': `${(cuadro / (PELICULA.duracion - 1)) * 100}%` } as React.CSSProperties}
                onPointerDown={() => { if (player.current?.isPlaying()) { reanudar.current = true; player.current.pause(); } }}
                onChange={e => ir(+e.target.value)}
                onPointerUp={() => { if (reanudar.current) { reanudar.current = false; player.current?.play(); } }}
                onPointerCancel={() => { if (reanudar.current) { reanudar.current = false; player.current?.play(); } }} />
              <div className="film-chapters" id="filmChapters">
                {ESCENAS.map(sc => (
                  <button key={sc.nombre} type="button" className={cuadro >= sc.desde && cuadro < sc.hasta ? 'on' : ''} aria-current={cuadro >= sc.desde && cuadro < sc.hasta ? 'true' : undefined} style={{ left: `${(sc.desde / PELICULA.duracion) * 100}%` }}
                    onClick={() => { ir(sc.desde); player.current?.play(); }}>{sc.nombre}</button>
                ))}
              </div>
            </div>
            <span className="film-time" id="filmTime">{mmss(cuadro)} / {mmss(PELICULA.duracion)}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
});
