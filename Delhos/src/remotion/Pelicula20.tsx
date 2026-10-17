// «Delhos en 20 segundos» (Claude Design, landing de Delhos): la película que el diseño animaba cuadro a cuadro
// «estilo Remotion», hecha ahora con Remotion. 1920×1080, 30 fps, 600 cuadros, cinco escenas:
// el símbolo se teje → tres mundos → del dato a la decisión → dos formas de aprender → cierre.
// Usa las clases .c-* de la hoja del diseño y los símbolos SVG definidos en la página (#dh-sym, #trama-d, #i-*).
import { Fragment, type CSSProperties } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame } from 'remotion';

export const PELICULA = { fps: 30, ancho: 1920, alto: 1080, duracion: 600 };

export const ESCENAS = [
  { desde: 0, hasta: 100, nombre: 'El símbolo' },
  { desde: 100, hasta: 230, nombre: 'Tres mundos' },
  { desde: 230, hasta: 370, nombre: 'Del dato a la decisión' },
  { desde: 370, hasta: 500, nombre: 'Dos formas de aprender' },
  { desde: 500, hasta: 600, nombre: 'Cierre' }
];

const E = { out: Easing.out(Easing.cubic), expo: Easing.out(Easing.exp), inOut: Easing.inOut(Easing.cubic), lin: Easing.linear };
const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const I = (f: number, [a, b]: [number, number], [c, d]: [number, number], easing = E.out) =>
  interpolate(f, [a, b], [c, d], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });
const R = (f: number, stiffness = 120, damping = 12, from = 0, to = 1) =>
  (f <= 0 ? from : spring({ frame: f, fps: PELICULA.fps, from, to, config: { stiffness, damping, mass: 1 } }));

const LINEAS = ['import pandas as pd', 'df = pd.read_csv("ventas.csv")', 'df.groupby("mes").sum().plot()'];
const BARRAS: [string, number, boolean?][] = [['Ene', 0.42], ['Feb', 0.58], ['Mar', 0.35], ['Abr', 0.66], ['May', 0.94, true], ['Jun', 0.72]];

function Ico({ n }: { n: string }) {
  return <svg className="ico" aria-hidden="true"><use href={`#i-${n}`} /></svg>;
}

export type PropsPelicula = { correo: string; logoAcademy: string; logoDataventura: string };

export function Pelicula20({ correo, logoAcademy, logoDataventura }: PropsPelicula) {
  const f = useCurrentFrame();

  const escena = (i: number): CSSProperties => {
    const sc = ESCENAS[i];
    if (f < sc.desde - 1 || f > sc.hasta + 1) return { opacity: 0, visibility: 'hidden' };
    const fin = i === 0 ? 1 : I(f - sc.desde, [0, 12], [0, 1]);
    const fout = I(f, [sc.hasta - 12, sc.hasta], [1, 0], E.inOut);
    const o = Math.min(fin, fout);
    return { visibility: 'visible', opacity: o, filter: o < 1 ? `blur(${(1 - o) * 14}px)` : 'none', scale: String(fout < 1 ? 1 + (1 - fout) * 0.08 : 1 - (1 - fin) * 0.05) };
  };
  const destello = ESCENAS.slice(1).reduce((m, sc) => Math.max(m, I(f, [sc.desde - 2, sc.desde], [0, 0.1]) * I(f, [sc.desde, sc.desde + 6], [1, 0])), 0);

  // Escena 1
  const relleno = I(f, [36, 56], [0, 1]);
  // Escena 2
  const l2 = f - 100;
  const activa = Math.floor(lim((l2 - 40) / 18, 0, 3));
  // Escena 3
  const l3 = f - 230;
  const tramos: [number, number][] = [[10, 34], [36, 66], [68, 100]];
  // Escena 4
  const l4 = f - 370;
  const a4 = R(l4 - 8, 90, 13), d4 = R(l4 - 16, 90, 13), p4 = R(l4 - 30, 140, 10);
  // Escena 5
  const l5 = f - 500;
  const s5 = R(l5 - 4, 100, 12);

  return (
    <AbsoluteFill>
      <div className="comp">
        <svg className="c-trama" width="1920" height="1080"><rect width="1920" height="1080" fill="url(#trama-d)" /></svg>
        <div className="c-glow" style={{ translate: `${Math.sin(f / 40) * 160 + (f > 230 ? Math.cos(f / 55) * 220 : 0)}px ${Math.cos(f / 50) * 90}px`, opacity: 0.7 + Math.sin(f / 20) * 0.3 }} />

        {/* Escena 1 · el símbolo se teje */}
        <div className="c-scene" data-scene="0" style={escena(0)}>
          <svg className="c-sym" viewBox="40 40 944 944" style={{
            strokeDashoffset: I(f, [0, 46], [1, 0], E.inOut), fill: `rgba(255,255,255,${relleno})`, strokeWidth: 2.5 * (1 - relleno) + 0.01,
            scale: String(R(f, 80, 11, 0.55, 1)), rotate: `${I(f, [0, 56], [-45, 0], E.expo)}deg`
          }}><use href="#dh-sym" /></svg>
          <p className="c-name">
            {'Delhos'.split('').map((c, i) => { const s = R(f - 44 - i * 3, 160, 14); return <span key={i} style={{ translate: `0 ${(1 - s) * 140}px`, opacity: lim(s * 1.4, 0, 1) }}>{c}</span>; })}
          </p>
          <p className="c-k" style={{ opacity: I(f, [68, 84], [0, 1]), letterSpacing: `${I(f, [68, 96], [0.6, 0.16], E.expo)}em` }}>Educación · Tecnología · Innovación</p>
        </div>

        {/* Escena 2 · tres mundos que se entrelazan */}
        <div className="c-scene" data-scene="1" style={escena(1)}>
          <div className="c-words">
            {[['cap', 'Educación.'], ['code', 'Tecnología.'], ['bulb', 'Innovación.']].map(([ico, t], i) => {
              const s = R(l2 - i * 10, 110, 14);
              return (
                <div key={t} className="c-word" style={{ translate: `${(1 - s) * -260}px 0`, opacity: lim(s, 0, 1), filter: `blur(${(1 - lim(s, 0, 1)) * 10}px)`, color: l2 > 40 && activa % 3 === i ? '#93C5FD' : '#fff' }}>
                  <span className="c-badge"><Ico n={ico} /></span>{t}
                </div>
              );
            })}
          </div>
          <div className="c-weave" style={{ rotate: `${l2 * 0.35}deg`, scale: String(1 + Math.sin(l2 / 14) * 0.02) }}>
            {[0, 1, 2].map(i => {
              const s = R(l2 - 18 - i * 8, 70, 13);
              const dirs = [[1100, 0], [-900, -700], [-900, 700]][i], ang = [0, 60, 120][i];
              return <i key={i} className={`b${i + 1}`} style={{ transform: `translate(${dirs[0] * (1 - s)}px, ${dirs[1] * (1 - s)}px) rotate(${ang + (1 - s) * 60}deg) scaleX(${0.4 + 0.6 * lim(s, 0, 1.2)})`, opacity: lim(s * 1.5, 0, 1) }} />;
            })}
          </div>
          {(() => { const s = R(l2 - 72, 120, 15); return <p className="c-line" style={{ opacity: lim(s, 0, 1), translate: `0 ${(1 - s) * 60}px` }}>Unidas para <em>aprender distinto.</em></p>; })()}
        </div>

        {/* Escena 3 · del dato a la decisión */}
        <div className="c-scene" data-scene="2" style={escena(2)}>
          {(() => { const s = R(l3, 90, 15); return (
            <div className="c-code" style={{ translate: `${(1 - s) * -500}px 0`, rotate: `${(1 - s) * -6}deg` }}>
              <div className="c-code-bar"><i /><i /><i /><span>analisis.py</span></div>
              <pre>{LINEAS.map((txt, i) => <span key={i} className="c-ln">{txt.slice(0, Math.round(I(l3, tramos[i], [0, txt.length], E.lin)))}{i < LINEAS.length - 1 ? '\n' : ''}</span>)}<span className="c-caret" style={{ opacity: Math.floor(l3 / 8) % 2 ? 0.2 : 1 }} /></pre>
            </div>
          ); })()}
          {(() => { const s = R(l3 - 10, 90, 15); return (
            <div className="c-chart" style={{ translate: `${(1 - s) * 500}px 0`, rotate: `${(1 - s) * 6}deg` }}>
              <span className="c-chart-k">ventas por mes</span>
              <div className="c-bars">
                {BARRAS.map(([m, h, caliente], i) => {
                  const sb = R(l3 - 74 - i * 4, 110, 12);
                  return <b key={m} className={caliente ? 'hot' : undefined} style={{ '--h': h, transform: `scaleY(${Math.max(0, sb)})`, boxShadow: caliente ? `0 0 ${I(l3, [100, 116], [0, 60])}px rgba(251,191,36,.8)` : undefined } as CSSProperties}><em>{m}</em></b>;
                })}
              </div>
            </div>
          ); })()}
          {(() => { const s = R(l3 - 100, 120, 15); return <p className="c-line c-line-low" style={{ opacity: lim(s, 0, 1), translate: `0 ${(1 - s) * 60}px` }}>Del dato <em>a la decisión.</em></p>; })()}
        </div>

        {/* Escena 4 · dos formas de aprender */}
        <div className="c-scene" data-scene="3" style={escena(3)}>
          <p className="c-k c-k-top" style={{ opacity: I(l4, [0, 14], [0, 1]) }}>Un ecosistema · dos formas de aprender</p>
          <div className="c-cards">
            <div className="c-card is-ac" style={{ translate: `${(1 - a4) * -800}px ${Math.sin(l4 / 16) * 8}px`, rotate: `${(1 - a4) * -14}deg` }}>
              <Img src={logoAcademy} alt="" width={120} height={120} />
              <span className="c-tag">Servicio</span>
              <b>Delhos Academy</b>
              <p>Cursos en vivo de ciencia de datos e IA</p>
              <span className="c-live">En vivo</span>
            </div>
            <div className="c-plus" style={{ scale: String(Math.max(0, p4)), rotate: `${(1 - lim(p4, 0, 1)) * 270}deg` }}><svg viewBox="40 40 944 944"><use href="#dh-sym" /></svg></div>
            <div className="c-card is-dv" style={{ translate: `${(1 - d4) * 800}px ${Math.cos(l4 / 16) * 8}px`, rotate: `${(1 - d4) * 14}deg` }}>
              <Img src={logoDataventura} alt="" width={120} height={120} />
              <span className="c-tag">Producto</span>
              <b>Dataventura</b>
              <p>Piensa con datos en 5 minutos al día</p>
              <span className="c-soon">Disponible</span>
            </div>
          </div>
        </div>

        {/* Escena 5 · cierre */}
        <div className="c-scene" data-scene="4" style={escena(4)}>
          <div className="c-sign" style={{ scale: String(0.6 + 0.4 * s5), opacity: lim(s5, 0, 1) }}>
            <svg viewBox="40 40 944 944"><use href="#dh-sym" /></svg><span>Delhos</span>
          </div>
          <p className="c-final">
            {['Se', 'aprende', 'haciendo.'].map((w, i) => {
              const s = R(l5 - 24 - i * 6, 140, 14);
              const estilo = { translate: `0 ${(1 - s) * 80}px`, opacity: lim(s, 0, 1) };
              return <Fragment key={w}>{i > 0 && ' '}{i === 2 ? <em style={estilo}>{w}</em> : <span style={estilo}>{w}</span>}</Fragment>;
            })}
          </p>
          <p className="c-mail" style={{ opacity: I(l5, [50, 66], [0, 1]) * I(l5, [88, 100], [1, 0]) }}>{correo}</p>
        </div>

        <div className="c-flash" style={{ opacity: destello }} />
      </div>
    </AbsoluteFill>
  );
}
