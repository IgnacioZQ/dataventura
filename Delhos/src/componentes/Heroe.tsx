// Héroe del diseño: red de datos en canvas, título con la palabra que se descifra, botones (uno abre la
// película de 20 s hecha con Remotion) y el escenario con las dos plataformas. Debajo, la banda de temas.
import { Fragment } from 'react';
import { DESTINO, Ico, LOGOS } from './Piezas';

const TEMAS = ['Programación', 'Ciencia de datos', 'Inteligencia artificial', 'Machine learning', 'Pensamiento de datos', 'Visualización'];

export function Heroe({ onPelicula, cargandoPelicula = false, precargar }: { onPelicula: () => void; cargandoPelicula?: boolean; precargar?: () => void }) {
  return (
    <section className="hero" id="inicio">
      <svg className="hero-trama" aria-hidden="true"><rect width="100%" height="100%" fill="url(#trama-l)" /></svg>
      <canvas className="hero-net" id="net" aria-hidden="true" />
      <div className="hero-spot" id="heroSpot" aria-hidden="true" />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker ld" style={{ '--d': 0 } as React.CSSProperties}>Educación · Tecnología · Innovación</span>
          <h1 className="hero-title">
            <span className="line"><span className="w ld" style={{ '--d': 1 } as React.CSSProperties}>Un</span> <span className="w ld" style={{ '--d': 2 } as React.CSSProperties}>ecosistema</span></span>
            <span className="line"><span className="w ld" style={{ '--d': 3 } as React.CSSProperties}>para</span> <span className="w ld" style={{ '--d': 4 } as React.CSSProperties}>aprender</span> <span className="w ld" style={{ '--d': 5 } as React.CSSProperties}>a</span></span>
            <span className="line"><span className="sr-only">programar, pensar con datos, analizar, crear con IA y decidir mejor.</span><span className="scramble ld" style={{ '--d': 6 } as React.CSSProperties} id="scramble" aria-hidden="true">programar.</span></span>
          </h1>
          <p className="hero-sub ld" style={{ '--d': 7 } as React.CSSProperties}>Delhos une educación, tecnología e innovación para aprender ciencia de datos e inteligencia artificial, acompañado por la IA.</p>
          <div className="hero-cta ld" style={{ '--d': 8 } as React.CSSProperties}>
            <a className="btn magnetic" href="#ecosistema"><span>Conocer el ecosistema</span><Ico n="down" /></a>
            <button className={`btn btn-outline magnetic ${cargandoPelicula ? 'cargando' : ''}`} type="button" onClick={onPelicula} onPointerEnter={precargar} onFocus={precargar} aria-haspopup="dialog" aria-busy={cargandoPelicula || undefined}><span className="play-dot"><Ico n="play" /></span><span>Ver Delhos en 20 s</span></button>
          </div>
        </div>

        {/* Las dos plataformas, cada una con su propia identidad */}
        <div className="stage ld" style={{ '--d': 5 } as React.CSSProperties} id="stage">
          <div className="stage-in" id="stageIn">
            <a className="show is-ac" href={DESTINO.academy} data-wipe="ac">
              <span className="glare" aria-hidden="true" />
              <div className="show-head">
                <img src={LOGOS.academy} alt="" width="36" height="36" />
                <b>Delhos Academy</b>
                <small><i>Servicio</i>Cursos en vivo, 100% online</small>
              </div>
              <div className="acp" aria-hidden="true">
                <div className="acp-bar"><span className="acp-dots"><i /><i /><i /></span><span>Panel del estudiante</span></div>
                <div className="acp-body">
                  <p className="acp-hi">Hola, Camila</p>
                  <p className="acp-sub">Machine learning aplicado · Semana 4 de 12</p>
                  <div className="acp-next">
                    <div><span className="acp-pill"><i />Hoy · 19:00 hrs</span><b>Clase 4 · Regresión lineal</b></div>
                    <span className="acp-btn">Entrar a la clase</span>
                  </div>
                  <div className="acp-row">
                    <div className="acp-card acp-ring">
                      <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" className="rb" /><circle cx="50" cy="50" r="40" className="rf" pathLength="1" transform="rotate(-90 50 50)" /><text x="50" y="57" textAnchor="middle">33%</text></svg>
                      <div><b>Tu avance</b><span>4 de 12 clases</span></div>
                    </div>
                    <div className="acp-card acp-tasks">
                      <b>Tareas pendientes</b>
                      <span className="acp-task"><i className="hot" />Limpieza de datos<em>2 días</em></span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="show-go">Ir a Delhos Academy <Ico n="arrow" /></span>
            </a>

            <a className="show is-dv" href={DESTINO.dataventura} data-wipe="dv">
              <span className="glare" aria-hidden="true" />
              <div className="show-head">
                <img src={LOGOS.dataventura} alt="" width="36" height="36" />
                <b>Dataventura</b>
                <small><i>Producto</i>Piensa con datos, 5 min al día</small>
              </div>
              <div className="phone" aria-hidden="true">
                <div className="phone-in">
                  <div className="dv-hud">
                    <div className="dv-hud-top">
                      <span className="dv-ava"><img src={LOGOS.dataventura} alt="" width="25" height="25" /></span>
                      <span className="dv-stat fl"><Ico n="flame" />8</span>
                      <span className="dv-stat"><Ico n="gem" />1.420</span>
                    </div>
                    <p className="dv-hud-k">Disponible · 0/3</p>
                    <p className="dv-hud-t">Isla de las Anomalías</p>
                  </div>
                  <svg className="dv-mini" viewBox="0 0 190 226">
                    <g fill="none" stroke="#D9CCFB" strokeWidth="2.5" strokeLinecap="round" className="waves">
                      <path d="M8 26q5-5 10 0t10 0" /><path d="M150 104q5-5 10 0t10 0t10 0" /><path d="M8 170q5-5 10 0t10 0t10 0" /><path d="M24 212q5-5 10 0t10 0" /><path d="M50 14q5-5 10 0t10 0" />
                    </g>
                    <path d="M150 222C120 206 96 192 104 168 110 148 126 140 122 120 118 100 96 94 100 72 102 60 112 54 118 46" fill="none" stroke="#B9A4FF" strokeWidth="3.5" strokeLinecap="round" strokeDasharray=".1 9" />
                    <use href="#dv-locked" x="98" y="10" width="90" height="67.5" />
                    <use href="#dv-lock" x="134" y="3" width="18" height="18" />
                    <ellipse className="dv-ring" cx="58" cy="128" rx="56" ry="20" />
                    <use href="#dv-volcano" x="4" y="64" width="108" height="81" />
                    <use href="#dv-light" x="84" y="142" width="104" height="78" />
                    <use href="#dv-check" x="164" y="146" width="20" height="20" />
                    <use href="#dv-chest" x="130" y="98" width="18" height="16" />
                    <use href="#dv-chest" x="56" y="180" width="18" height="16" />
                    <g className="dv-boat"><use href="#dv-ship" x="62" y="28" width="36" height="33" /></g>
                  </svg>
                </div>
              </div>
              <span className="show-go">Ir a Dataventura <Ico n="arrow" /></span>
            </a>
          </div>
          <p className="stage-cap">Vistas ilustrativas de cada plataforma</p>
        </div>
      </div>
    </section>
  );
}

export function Bandas() {
  const lista = [...TEMAS, ...TEMAS];
  return (
    <div className="bands" aria-hidden="true">
      <div className="band">
        <div className="band-track" data-speed="1">
          {lista.map((t, i) => <Fragment key={i}><span>{t}</span><i /></Fragment>)}
        </div>
      </div>
    </div>
  );
}
