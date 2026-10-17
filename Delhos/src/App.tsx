// Landing de Delhos (Claude Design, proyecto «Diseño Landing Page Delhos»), portada a React con el mismo
// marcado y la misma hoja de estilos. La película «Delhos en 20 segundos» está hecha con Remotion.
import { Component, lazy, Suspense, useRef, useState, type ReactNode } from 'react';
import { Indice, Intro, Navegacion } from './componentes/Cabecera';
import { Bandas, Heroe } from './componentes/Heroe';
import type { ControlPelicula } from './componentes/Pelicula';
import { LOGOS } from './componentes/Piezas';
import { Pie, VolverArriba } from './componentes/Pie';
import { Contacto, Desafio, Ecosistema, Preguntas } from './componentes/Secciones';
import { SIMBOLOS } from './diseno/simbolos';
import { useEfectos } from './efectos';

// Remotion pesa: la película se carga recién cuando alguien la pide (o pasa el mouse sobre el botón).
const cargarPelicula = () => import('./componentes/Pelicula');
const Pelicula = lazy(() => cargarPelicula().then(m => ({ default: m.Pelicula })));

/** Si la película no se puede descargar (sin red o tras publicar una versión nueva), la página sigue en pie. */
class SinPelicula extends Component<{ alFallar: () => void; children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() { return { fallo: true }; }
  componentDidCatch() { this.props.alFallar(); }
  render() { return this.state.fallo ? null : this.props.children; }
}

export default function App() {
  useEfectos(LOGOS);
  const pelicula = useRef<ControlPelicula>(null);
  const [pedida, setPedida] = useState(false);
  const [cargando, setCargando] = useState(false);

  const verPelicula = () => {
    if (pelicula.current) { pelicula.current.abrir(); return; }
    setCargando(true);
    setPedida(true);
  };

  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      {/* Símbolo, íconos e ilustraciones del diseño, definidos una vez para usarlos con <use>. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs dangerouslySetInnerHTML={{ __html: SIMBOLOS }} /></svg>

      <Intro />
      <div className="progress" id="progress" />
      <Navegacion />
      <Indice />

      <main id="contenido" tabIndex={-1}>
        <Heroe onPelicula={verPelicula} cargandoPelicula={cargando} precargar={() => { void cargarPelicula(); }} />
        <Bandas />
        {pedida && (
          <SinPelicula alFallar={() => { setCargando(false); setPedida(false); }}>
            <Suspense fallback={null}><Pelicula ref={pelicula} abrirAlMontar onListo={() => setCargando(false)} /></Suspense>
          </SinPelicula>
        )}
        <Ecosistema />
        <Desafio />
        <Preguntas />
        <Contacto />
      </main>

      <Pie />
      <VolverArriba />
    </>
  );
}
