// Pie del diseño: frase con letras que saltan al pasar el mouse, columnas, nombre gigante que se llena con el
// scroll y el botón para volver arriba (su anillo muestra cuánto falta).
import { CORREO } from '@/config';
import { DESTINO, Ico, Simbolo } from './Piezas';

function Letras({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\s+)/).map((p, i) => (/^\s+$/.test(p) ? p : (
        <span key={i} style={{ whiteSpace: 'nowrap', display: 'inline-block' }} aria-hidden="true">
          {[...p].map((c, k) => <span key={k} className="ch-l">{c}</span>)}
        </span>
      )))}
    </>
  );
}

export function Pie() {
  const frase = 'Educación, tecnología e innovación';
  const remate = 'en un mismo ecosistema.';
  return (
    <footer className="footer" id="footer">
      <div className="wrap">
        <div className="footer-top">
          <p className="footer-big" id="footerBig">
            <span className="sr-only">{frase} {remate}</span>
            <Letras texto={frase} /> <em><Letras texto={remate} /></em>
          </p>
          <a className="btn magnetic" href="#contacto"><span>Conversemos</span><Ico n="arrow" /></a>
        </div>
        <div className="footer-grid">
          <div className="foot-brand">
            <a className="brand" href="#inicio" aria-label="Delhos, volver al inicio"><span className="brand-mark"><Simbolo /></span><span className="brand-name" translate="no">Delhos</span></a>
            <p>Aprender a programar y a pensar con datos. 100% online, para todo el mundo de habla hispana.</p>
          </div>
          <nav aria-label="Productos">
            <h4>Productos</h4>
            <ul><li><a href={DESTINO.dataventura} data-wipe="dv">Dataventura</a></li></ul>
          </nav>
          <nav aria-label="Servicios">
            <h4>Servicios</h4>
            <ul>
              <li><a href={DESTINO.academy} data-wipe="ac">Delhos Academy</a></li>
              <li><a href={DESTINO.academyCursos} data-wipe="ac">Cursos</a></li>
              <li><a href={DESTINO.academyWebinars} data-wipe="ac">Webinars y workshops</a></li>
            </ul>
          </nav>
          <nav aria-label="Delhos">
            <h4>Delhos</h4>
            <ul>
              <li><a href="#ecosistema">Ecosistema</a></li>
              <li><a href="#desafio">El desafío</a></li>
              <li><a href="#faq">Preguntas frecuentes</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </nav>
        </div>
        <div className="giant" id="giant" aria-hidden="true"><span>Delhos</span><span className="giant-fill">Delhos</span></div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Delhos. Todos los derechos reservados.</span>
          <a href={`mailto:${CORREO}`} translate="no">{CORREO}</a>
        </div>
      </div>
    </footer>
  );
}

export function VolverArriba() {
  return (
    <button className="to-top" id="toTop" type="button" aria-label="Volver arriba"
      onClick={() => {
        scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        document.querySelector<HTMLElement>('#nav .brand')?.focus({ preventScroll: true });
      }}>
      <svg className="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" pathLength="1" /></svg>
      <Ico n="up" />
    </button>
  );
}
