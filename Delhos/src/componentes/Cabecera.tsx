// Intro (el símbolo se teje), barra de progreso, navegación con los desplegables Productos y Servicios,
// menú del celular e índice lateral de secciones. Mismo marcado y clases que el diseño.
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { DESTINO, Ico, LOGOS, Simbolo } from './Piezas';

const reducir = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const movil = () => matchMedia('(max-width: 920px)').matches;

/** La intro se muestra una vez por sesión; al terminar, la portada carga escalonada (html.loaded). */
export function Intro() {
  const [estado, setEstado] = useState<'' | 'run' | 'run out'>('');
  const terminarRef = useRef<() => void>(() => {});
  useEffect(() => {
    const raiz = document.documentElement;
    let ya = false;
    try { ya = !!sessionStorage.getItem('dh-intro'); } catch { /* sin almacenamiento */ }
    if (reducir() || ya) {
      const r = requestAnimationFrame(() => raiz.classList.add('loaded'));
      return () => cancelAnimationFrame(r);
    }
    setEstado('run');
    document.body.classList.add('lock');
    const tiempos: number[] = [];
    let listo = false;
    const terminar = () => {
      if (listo) return;
      listo = true;
      try { sessionStorage.setItem('dh-intro', '1'); } catch { /* sin almacenamiento */ }
      removeEventListener('keydown', terminar);
      setEstado('run out');
      document.body.classList.remove('lock');
      tiempos.push(window.setTimeout(() => raiz.classList.add('loaded'), 250));
      tiempos.push(window.setTimeout(() => setEstado(''), 1100));
    };
    terminarRef.current = terminar;
    addEventListener('keydown', terminar);
    tiempos.push(window.setTimeout(terminar, 2300));
    return () => { tiempos.forEach(clearTimeout); removeEventListener('keydown', terminar); document.body.classList.remove('lock'); };
  }, []);
  return (
    <div className={`intro ${estado}`} id="intro" aria-hidden="true" onClick={() => terminarRef.current()}>
      <div className="intro-in">
        <Simbolo className="intro-sym" />
        <p className="intro-name">{'Delhos'.split('').map((l, i) => <span key={i}>{l}</span>)}</p>
        <p className="intro-k">Educación · Tecnología · Innovación</p>
      </div>
    </div>
  );
}

type Desplegable = 'prod' | 'serv' | null;

export function Navegacion() {
  const [abierto, setAbierto] = useState<Desplegable>(null);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const tinta = useRef<HTMLSpanElement>(null);
  const botones = { prod: useRef<HTMLButtonElement>(null), serv: useRef<HTMLButtonElement>(null) };
  const cierre = useRef(0);

  // El subrayado del menú se mueve hasta el desplegable abierto.
  useEffect(() => {
    const ink = tinta.current, m = menuRef.current;
    if (!ink || !m) return;
    const btn = abierto ? botones[abierto].current : null;
    if (!btn || movil()) { ink.style.opacity = '0'; return; }
    const mr = m.getBoundingClientRect(), r = btn.getBoundingClientRect();
    ink.style.width = `${r.width}px`;
    ink.style.transform = `translateX(${r.left - mr.left}px)`;
    ink.style.opacity = '1';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  useEffect(() => { document.getElementById('nav')?.classList.toggle('dd-open', !!abierto && !movil()); }, [abierto]);

  const abrirMenu = useCallback((v: boolean) => {
    setMenu(v);
    document.body.classList.toggle('lock', v);
    // Con el menú abierto, el resto de la página queda fuera del orden de tabulación.
    ['main', 'footer', '#toTop'].forEach(s => document.querySelector(s)?.toggleAttribute('inert', v));
    if (!v) setAbierto(null);
  }, []);

  useEffect(() => {
    const fuera = (e: PointerEvent) => { if (!(e.target as Element).closest?.('[data-dd]')) setAbierto(null); };
    const tecla = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (abierto) { const b = botones[abierto].current; setAbierto(null); b?.focus(); return; }
      if (menu) { abrirMenu(false); document.getElementById('burger')?.focus(); }
    };
    const tam = () => { if (!movil() && menu) abrirMenu(false); };
    document.addEventListener('pointerdown', fuera);
    addEventListener('keydown', tecla);
    addEventListener('resize', tam);
    return () => { document.removeEventListener('pointerdown', fuera); removeEventListener('keydown', tecla); removeEventListener('resize', tam); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, menu, abrirMenu]);

  const propsDesplegable = (id: 'prod' | 'serv') => ({
    'data-dd': true,
    className: `dd ${abierto === id ? 'open' : ''}`,
    onPointerEnter: () => { if (!fino() || movil()) return; clearTimeout(cierre.current); setAbierto(id); },
    onPointerLeave: () => { if (!fino() || movil()) return; cierre.current = window.setTimeout(() => setAbierto(a => (a === id ? null : a)), 220); },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => { if (!movil() && !e.currentTarget.contains(e.relatedTarget as Node)) setAbierto(a => (a === id ? null : a)); },
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      const items = [botones[id].current, ...Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('.dd-panel a'))].filter(Boolean) as HTMLElement[];
      const k = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown' && k > -1) { e.preventDefault(); setAbierto(id); items[Math.min(k + 1, items.length - 1)].focus(); }
      if (e.key === 'ArrowUp' && k > 0) { e.preventDefault(); items[k - 1].focus(); }
    }
  });

  const alPulsarEnlace = (e: React.MouseEvent) => { if ((e.target as Element).closest('a')) { abrirMenu(false); setAbierto(null); } };

  return (
    <header className="nav" id="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#inicio" aria-label="Delhos, inicio">
          <span className="brand-mark"><Simbolo /></span>
          <span className="brand-name" translate="no">Delhos</span>
        </a>
        <nav className={`menu ${menu ? 'open' : ''}`} id="menu" aria-label="Principal" ref={menuRef} onClick={alPulsarEnlace}>
          <span className="menu-ink" id="menuInk" aria-hidden="true" ref={tinta} />

          <div {...propsDesplegable('prod')}>
            <button ref={botones.prod} className="dd-btn" type="button" aria-expanded={abierto === 'prod'} aria-controls="dd-prod" id="dd-prod-btn" onClick={() => setAbierto(abierto === 'prod' ? null : 'prod')}>Productos<Ico n="chevron" /></button>
            <div className="dd-panel" id="dd-prod" role="region" aria-labelledby="dd-prod-btn">
              <div className="dd-in">
                <a className="dd-card is-dv" href={DESTINO.dataventura} data-wipe="dv">
                  <span className="dd-art dd-art-dv" aria-hidden="true">
                    <svg viewBox="0 0 220 120"><use href="#dv-volcano" x="8" y="22" width="110" height="82" /><use href="#dv-light" x="104" y="34" width="104" height="78" /><g className="dv-boat"><use href="#dv-ship" x="92" y="4" width="34" height="31" /></g></svg>
                  </span>
                  <span className="dd-body">
                    <span className="dd-top"><img src={LOGOS.dataventura} alt="" width="36" height="36" /><b>Dataventura</b><em className="avail">Disponible</em></span>
                    <span className="dd-desc">Aprende a pensar con datos en 5 minutos al día, sin escribir código.</span>
                    <span className="dd-go">Ir a Dataventura<Ico n="arrow" /></span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div {...propsDesplegable('serv')}>
            <button ref={botones.serv} className="dd-btn" type="button" aria-expanded={abierto === 'serv'} aria-controls="dd-serv" id="dd-serv-btn" onClick={() => setAbierto(abierto === 'serv' ? null : 'serv')}>Servicios<Ico n="chevron" /></button>
            <div className="dd-panel" id="dd-serv" role="region" aria-labelledby="dd-serv-btn">
              <div className="dd-in">
                <a className="dd-card is-ac" href={DESTINO.academy} data-wipe="ac">
                  <span className="dd-art dd-art-ac" aria-hidden="true">
                    <span className="live">En vivo</span>
                    <span className="dd-bars">{['40%', '62%', '52%', '80%', '100%'].map(h => <i key={h} style={{ '--h': h } as React.CSSProperties} />)}</span>
                  </span>
                  <span className="dd-body">
                    <span className="dd-top"><img src={LOGOS.academy} alt="" width="36" height="36" /><b>Delhos Academy</b><em className="avail">Disponible</em></span>
                    <span className="dd-desc">Cursos en vivo de ciencia de datos e IA, 100% online.</span>
                    <span className="dd-go">Ir a Delhos Academy<Ico n="arrow" /></span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <a className="btn btn-sm magnetic menu-cta" href="#contacto"><span>Conversemos</span><Ico n="arrow" /></a>
        </nav>
        <button className="burger" id="burger" type="button" aria-label={menu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menu} aria-controls="menu" onClick={() => abrirMenu(!menu)}><span /><span /></button>
      </div>
      <div className="dd-scrim" id="ddScrim" aria-hidden="true" onClick={() => setAbierto(null)} />
    </header>
  );
}

export const SECCIONES = [['inicio', 'Inicio'], ['ecosistema', 'Ecosistema'], ['desafio', 'El desafío'], ['faq', 'Preguntas'], ['contacto', 'Contacto']] as const;

export function Indice() {
  return (
    <nav className="toc" id="toc" aria-label="Secciones de la página">
      {SECCIONES.map(([id, t]) => <a key={id} href={`#${id}`}><span>{t}</span><i /></a>)}
    </nav>
  );
}
