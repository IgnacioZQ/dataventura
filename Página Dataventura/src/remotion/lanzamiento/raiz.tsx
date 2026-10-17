// Punto de entrada para exportar el video con @remotion/renderer (scripts/renderizar-lanzamiento.mjs).
// En la página, el video se reproduce con @remotion/player y no usa este archivo.
import { Composition, continueRender, delayRender, registerRoot } from 'remotion';
import { Lanzamiento, LANZAMIENTO, type PropsLanzamiento } from './Lanzamiento';
import './fuentes.css';

// Espera a que las tipografías estén listas antes de dibujar el primer cuadro.
const esperaFuentes = delayRender('Cargando tipografías');
Promise.all(['400 40px "Lilita One"', '800 40px Nunito', '800 40px Outfit'].map(f => document.fonts.load(f))).then(() => continueRender(esperaFuentes));

function Raiz() {
  return (
    <Composition
      id="Lanzamiento"
      component={Lanzamiento}
      durationInFrames={LANZAMIENTO.duracion}
      fps={LANZAMIENTO.fps}
      width={LANZAMIENTO.ancho}
      height={LANZAMIENTO.alto}
      defaultProps={{ url: 'datamind-three.vercel.app' } satisfies PropsLanzamiento}
    />
  );
}

registerRoot(Raiz);
