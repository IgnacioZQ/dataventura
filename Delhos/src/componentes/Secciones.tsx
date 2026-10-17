// Ecosistema, El desafío, Preguntas frecuentes y Contacto, con el marcado y las clases del diseño.
import { useEffect, useRef, useState } from 'react';
import { CORREO } from '@/config';
import { DESTINO, Ico, LOGOS, Partido, Simbolo, useReducir, useVisto } from './Piezas';

const RUTA_DV = 'M112 108C132 120 140 88 156 82 196 64 216 76 236 80C256 76 262 104 282 110 330 124 360 114 378 106C396 100 398 76 414 68';

export function Ecosistema() {
  const reducir = useReducir();
  return (
    <section className="eco" id="ecosistema">
      <div className="wrap">
        <div className="head center rv">
          <span className="kicker">El ecosistema Delhos</span>
          <Partido>Tres mundos, <em>dos formas de aprender.</em></Partido>
          <p className="lead">De la unión entre educación, tecnología e innovación nacen un servicio y un producto.</p>
        </div>

        <div className="tree" id="tree">
          <ul className="forces">
            {[['cap', 'Educación', 'Metodologías activas para programar y pensar con datos.'], ['code', 'Tecnología', 'Plataformas y aplicaciones propias.'], ['bulb', 'Innovación', 'Aprender en vivo, jugando y con IA.']].map(([ico, t, p], i) => (
              <li key={t} className="force rv" style={{ '--d': i } as React.CSSProperties}><span className="badge"><Ico n={ico} /></span><div><h3>{t}</h3><p>{p}</p></div></li>
            ))}
          </ul>

          <svg className="links links-in" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
            <path className="ln" d="M100 0C100 50 300 30 300 80" /><path className="ln" d="M300 0V80" /><path className="ln" d="M500 0C500 50 300 30 300 80" />
          </svg>
          <div className="core rv"><Simbolo etiqueta="Delhos" /></div>
          <svg className="links links-out" viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden="true">
            <path className="ln ln-dv" d="M300 0C300 50 150 30 150 80" /><path className="ln ln-ac" d="M300 0C300 50 450 30 450 80" />
          </svg>

          <div className="branches">
            {/* Productos → Dataventura */}
            <article className="branch is-dv rv" id="productos" style={{ '--d': 0 } as React.CSSProperties}>
              <div className="branch-cover">
                <div className="branch-top"><span className="branch-k">Producto</span><em className="avail">Disponible</em></div>
                <div className="branch-id"><img src={LOGOS.dataventura} alt="" width="56" height="56" /><h3>Dataventura</h3></div>
                <div className="branch-art art-dv" aria-hidden="true">
                  <svg viewBox="0 0 520 150" preserveAspectRatio="xMidYMax slice">
                    <g fill="none" stroke="#D9CCFB" strokeWidth="2.5" strokeLinecap="round" className="waves">
                      <path d="M70 22q6-6 12 0t12 0t12 0" /><path d="M270 20q6-6 12 0t12 0" /><path d="M6 138q6-6 12 0t12 0" /><path d="M350 24q6-6 12 0t12 0" /><path d="M470 130q6-6 12 0t12 0t12 0" />
                    </g>
                    <path d={RUTA_DV} fill="none" stroke="#B9A4FF" strokeWidth="3.5" strokeLinecap="round" strokeDasharray=".1 9" />
                    <use href="#dv-origin" x="8" y="40" width="120" height="90" />
                    <use href="#dv-check" x="98" y="40" width="22" height="22" />
                    <use href="#dv-light" x="132" y="8" width="120" height="90" />
                    <ellipse className="dv-ring" cx="326" cy="115" rx="68" ry="23" />
                    <use href="#dv-volcano" x="262" y="40" width="128" height="96" />
                    <use href="#dv-locked" x="396" y="8" width="116" height="87" />
                    <g className="dv-sail" transform={reducir ? 'translate(156 82)' : undefined}><use href="#dv-ship" x="-19" y="-30" width="38" height="35" />{!reducir && <animateMotion dur="14s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" path={RUTA_DV} />}</g>
                  </svg>
                </div>
              </div>
              <div className="branch-body">
                <p className="branch-tag">Aprende a pensar con datos en 5 minutos al día, sin escribir código.</p>
                <p className="branch-desc">Retos cortos con gráficos y explicación inmediata, mientras navegas el Archipiélago de los Datos.</p>
                <div className="branch-cta">
                  <a className="btn magnetic" href={DESTINO.dataventura} data-wipe="dv"><span>Ir a Dataventura</span><Ico n="arrow" /></a>
                </div>
              </div>
            </article>

            {/* Servicios → Delhos Academy */}
            <article className="branch is-ac rv" id="servicios" style={{ '--d': 1 } as React.CSSProperties}>
              <div className="branch-cover">
                <div className="branch-top"><span className="branch-k">Servicio</span><em className="avail">Disponible</em></div>
                <div className="branch-id"><img src={LOGOS.academy} alt="" width="56" height="56" /><h3>Delhos Academy</h3></div>
                <div className="branch-art art-ac" aria-hidden="true">
                  <div className="acp-next acp-next-lg">
                    <div><span className="acp-pill"><i />Hoy · 19:00 hrs</span><b>Clase 4 · Regresión lineal</b><small>El enlace se activa 15 minutos antes</small></div>
                    <span className="acp-btn">Entrar a la clase</span>
                  </div>
                  <div className="acp-week">
                    <span><em>Lunes</em>Sin clases</span><span className="on"><em>Martes · hoy</em>Clase 4</span><span><em>Miércoles</em>Foro abierto</span><span className="warm"><em>Viernes</em>Entrega</span>
                  </div>
                </div>
              </div>
              <div className="branch-body">
                <p className="branch-tag">Aprende ciencia de datos con criterio y foco en resultados.</p>
                <p className="branch-desc">Cursos en vivo, 100% online, con casos reales del sector público y privado y acompañamiento de tus instructores.</p>
                <div className="branch-cta">
                  <a className="btn magnetic" href={DESTINO.academyCursos} data-wipe="ac"><span>Ver cursos</span><Ico n="arrow" /></a>
                  <a className="text-link" href={DESTINO.academy} data-wipe="ac">Ir a Delhos Academy <Ico n="arrow" /></a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

const DESAFIOS = [
  ['01 · Educación', 'Mucha teoría, poca práctica.', 'Se enseña a repetir, no a resolver.', 'Aprender haciendo.', 'Talleres en vivo con datos reales y retos diarios.'],
  ['02 · Tecnología', 'Avanza más rápido que las aulas.', 'Las herramientas llegan tarde y dispersas.', 'IA como compañera.', 'Herramientas integradas en una misma experiencia.'],
  ['03 · Innovación', 'Los mismos formatos de siempre.', 'Se escucha mucho y se participa poco.', 'Formatos nuevos.', 'Clases en vivo y retos de 5 minutos, isla a isla.']
];

export function Desafio() {
  return (
    <section className="pain" id="desafio">
      <div className="wrap">
        <div className="head center rv">
          <span className="kicker">El desafío</span>
          <Partido>El mundo cambió. <span className="dim">La forma de aprender, no tanto.</span></Partido>
        </div>
        <ul className="dz" id="dz">
          {DESAFIOS.map(([n, pb, ps, sb, ss], i) => (
            <li key={n} className="dz-card rv" style={{ '--d': i } as React.CSSProperties} tabIndex={0} role="button" aria-pressed="false" aria-label={`${n}. ${pb} Nuestra respuesta: ${sb}`}>
              <span className="dz-n">{n}</span>
              <div className="dz-faces">
                <div className="dz-face dz-p"><b>{pb}</b><span>{ps}</span></div>
                <div className="dz-face dz-s"><em>Nuestra respuesta</em><b>{sb}</b><span>{ss}</span></div>
              </div>
              <i className="dz-bar" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pregunta({ i, q, a, abierta, alternar }: { i: number; q: string; a: React.ReactNode; abierta: boolean; alternar: () => void }) {
  const [ref, visto] = useVisto<HTMLDivElement>();
  return (
    <div ref={ref} className={`q rv ${visto ? 'in' : ''} ${abierta ? 'open' : ''}`}>
      <h3 style={{ margin: 0, font: 'inherit' }}><button type="button" aria-expanded={abierta} aria-controls={`a${i + 1}`} id={`q${i + 1}`} onClick={alternar}><span>{q}</span><i /></button></h3>
      <div className="a" id={`a${i + 1}`} role="region" aria-labelledby={`q${i + 1}`}><div><p>{a}</p></div></div>
    </div>
  );
}

export function Preguntas() {
  const [abierta, setAbierta] = useState(0);
  const items = [
    ['¿Qué es Delhos?', <>Un ecosistema que une educación, tecnología e innovación para aprender ciencia de datos e inteligencia artificial. Hoy reúne a Delhos Academy y Dataventura.</>],
    ['¿Qué diferencia a Delhos Academy de Dataventura?', <>Delhos Academy es formación en vivo con instructores. Dataventura es una app para entrenar el pensamiento con datos unos minutos al día, sin programar.</>],
    ['¿Dónde veo cursos, fechas y precios?', <>En el sitio de Delhos Academy, donde cada curso publica su temario y calendario. <a className="text-link" href={DESTINO.academyCursos} data-wipe="ac">Ver cursos <Ico n="arrow" /></a></>],
    ['¿Cómo uso Dataventura?', <>Se abre desde el navegador, sin pasar por tiendas, y puedes instalarla en tu celular. <a className="text-link" href={DESTINO.dataventura} data-wipe="dv">Ir a Dataventura <Ico n="arrow" /></a></>]
  ] as const;
  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="head rv faq-head">
          <span className="kicker">Preguntas frecuentes</span>
          <Partido>Lo esencial, <em>en corto.</em></Partido>
          <p className="lead">El detalle de cursos y de la app está en el sitio de cada plataforma.</p>
        </div>
        <div className="faq-list">
          {items.map(([q, a], i) => <Pregunta key={q} i={i} q={q} a={a} abierta={abierta === i} alternar={() => setAbierta(abierta === i ? -1 : i)} />)}
        </div>
      </div>
    </section>
  );
}

/** Copia un texto; si el navegador no deja, selecciona el elemento de respaldo para copiarlo a mano. */
export async function copiar(texto: string, respaldo?: HTMLElement | null) {
  try { await navigator.clipboard.writeText(texto); return 'Copiado'; } catch {
    if (respaldo) { const r = document.createRange(); r.selectNodeContents(respaldo); const s = getSelection(); s?.removeAllRanges(); s?.addRange(r); }
    return 'Selecciónalo y copia';
  }
}

function BotonCopiar({ texto, respaldo, clase, etiqueta, icono = true, id, contexto }: { texto: string; respaldo?: () => HTMLElement | null; clase: string; etiqueta: string; icono?: boolean; id?: string; contexto?: string }) {
  const [estado, setEstado] = useState('');
  const tiempo = useRef(0);
  useEffect(() => () => clearTimeout(tiempo.current), []);
  return (
    <button id={id} className={`${clase} ${estado === 'Copiado' ? 'done' : ''}`} type="button" onClick={async () => {
      setEstado(await copiar(texto, respaldo?.()));
      clearTimeout(tiempo.current);
      tiempo.current = window.setTimeout(() => setEstado(''), 2200);
    }}>
      {icono && <Ico n="copy" />}<span aria-live="polite">{estado || etiqueta}{!estado && contexto && <span className="sr-only">{contexto}</span>}</span>
    </button>
  );
}

function chispas(x: number, y: number) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colores = ['#FBBF24', '#93C5FD', '#4A90C2', '#FFFFFF'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('i');
    p.className = 'spark-burst';
    p.style.left = `${x}px`; p.style.top = `${y}px`;
    p.style.background = colores[i % colores.length];
    document.body.append(p);
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 140;
    p.animate([
      { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 60}px)) rotate(${Math.random() * 540}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => p.remove();
  }
}

const TEMAS = ['Delhos Academy', 'Dataventura', 'Otro tema'];

export function Contacto() {
  const [v, setV] = useState({ nombre: '', correo: '', tema: TEMAS[0], mensaje: '' });
  const [err, setErr] = useState({ nombre: false, correo: false });
  const [mensaje, setMensaje] = useState('');
  const [form, visto] = useVisto<HTMLFormElement>();
  const ok = useRef<HTMLPreElement>(null);
  const correoOk = /^\S+@\S+\.\S+$/.test(v.correo.trim());

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const malos = { nombre: !v.nombre.trim(), correo: !correoOk };
    setErr(malos);
    if (malos.nombre || malos.correo) { document.getElementById(malos.nombre ? 'f-name' : 'f-mail')?.focus(); return; }
    setMensaje([`Asunto: Contacto web · ${v.tema}`, '', `Nombre: ${v.nombre.trim()}`, `Correo: ${v.correo.trim()}`, `Interés: ${v.tema}`, '', v.mensaje.trim()].join('\n').trim());
    const r = form.current?.getBoundingClientRect();
    if (r) chispas(r.left + r.width / 2, r.top + 80);
    window.setTimeout(() => document.getElementById('copyMsg')?.focus({ preventScroll: true }), 50);
  };

  const mailto = `mailto:${CORREO}?subject=${encodeURIComponent(`Contacto web · ${v.tema}`)}&body=${encodeURIComponent(mensaje)}`;

  return (
    <section className="contact" id="contacto">
      <div className="wrap contact-grid">
        <div className="contact-copy rv">
          <span className="kicker">Contacto</span>
          <Partido>¿Tienes dudas? <em>Conversemos.</em></Partido>
          <p className="lead">Escríbenos si quieres enseñar o aprender en Delhos Academy, o saber más de Dataventura. Te respondemos por correo.</p>
          <div className="mailbox">
            <Ico n="mail" />
            <span className="mail-addr" id="mailAddr" translate="no">{CORREO}</span>
            <BotonCopiar texto={CORREO} respaldo={() => document.getElementById('mailAddr')} clase="copy" etiqueta="Copiar" contexto=" el correo" />
          </div>
        </div>

        <form className={`form rv ${visto ? 'in' : ''} ${mensaje ? 'sent' : ''}`} style={{ '--d': 1 } as React.CSSProperties} id="form" noValidate onSubmit={enviar} ref={form}>
          <div className="form-in">
            <h3>Conversemos</h3>
            <div className="form-row">
              <div className={`field ${err.nombre ? 'err' : ''}`}>
                <input id="f-name" name="name" autoComplete="name" required placeholder=" " value={v.nombre} aria-invalid={err.nombre} aria-describedby={err.nombre ? 'f-name-err' : undefined}
                  onChange={e => { setV({ ...v, nombre: e.target.value }); setErr({ ...err, nombre: false }); }} />
                <label htmlFor="f-name">Nombre</label><small className="field-err" id="f-name-err">Escribe tu nombre.</small>
              </div>
              <div className={`field ${err.correo ? 'err' : ''}`}>
                <input id="f-mail" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} required placeholder=" " value={v.correo} aria-invalid={err.correo} aria-describedby={err.correo ? 'f-mail-err' : undefined}
                  onChange={e => { setV({ ...v, correo: e.target.value }); setErr({ ...err, correo: false }); }} />
                <label htmlFor="f-mail">Correo electrónico</label><small className="field-err" id="f-mail-err">Escribe un correo válido para que podamos responderte.</small>
              </div>
            </div>
            <fieldset className="topics">
              <legend>Me interesa</legend>
              {TEMAS.map((t, i) => (
                <label key={t} className="topic"><input type="radio" name="topic" id={['t-ac', 't-dv', 't-ot'][i]} value={t} checked={v.tema === t} onChange={() => setV({ ...v, tema: t })} /><span>{t}</span></label>
              ))}
            </fieldset>
            <div className="field"><textarea id="f-msg" name="message" rows={3} autoComplete="off" placeholder=" " value={v.mensaje} onChange={e => setV({ ...v, mensaje: e.target.value })} /><label htmlFor="f-msg">Cuéntanos un poco más</label></div>
            <button className="btn btn-block magnetic" type="submit"><span>Preparar mensaje</span><Ico n="arrow" /></button>
          </div>
          <div className="form-ok" id="formOk">
            <svg className="ok-check" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" pathLength="1" /><path d="m15 27 7 7 15-16" pathLength="1" /></svg>
            <h3>¡Casi listo!</h3>
            <p>Tu mensaje está preparado. Cópialo y envíalo a <b>{CORREO}</b>.</p>
            <pre className="ok-msg" id="okMsg" ref={ok} tabIndex={0} aria-label="Mensaje preparado">{mensaje}</pre>
            <div className="ok-actions">
              <BotonCopiar id="copyMsg" texto={mensaje} respaldo={() => ok.current} clase="btn btn-sm" etiqueta="Copiar mensaje" />
              <a className="btn btn-outline btn-sm" id="mailtoLink" href={mailto}>Abrir mi correo</a>
              <button className="text-link" type="button" id="formBack" onClick={() => { setMensaje(''); window.setTimeout(() => document.getElementById('f-name')?.focus(), 30); }}>Editar</button>
            </div>
          </div>
        </form>
        <p className="sr-only" role="status">{mensaje ? '¡Casi listo! Tu mensaje está preparado para copiarlo o abrirlo en tu correo.' : ''}</p>
      </div>
    </section>
  );
}
