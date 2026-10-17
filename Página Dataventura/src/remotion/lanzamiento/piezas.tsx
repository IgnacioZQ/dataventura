// Piezas compartidas del video de lanzamiento: tokens de marca, fondo vivo, píldora de subtítulo, texto que entra
// por palabra, teléfono, cursor y la transición entre escenas (desenfoque + escala). Todo se calcula desde el
// número de cuadro, sin animaciones CSS, para que el render sea idéntico al reproductor.
import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const C = {
  dv: '#7b4dff', dv7: '#5a30d6', dv9: '#3b2a6e', tinta: '#1b1230', oro: '#ffd166', oro7: '#d6a572',
  lila: '#f4f0ff', lila2: '#efe9ff', lila3: '#cdbcff', borde: '#e5e0f2', suave: '#4a4360', gris: '#6b6580',
  verde: '#2fbf8a', verde7: '#167a55', verdeSuave: '#dff7ec', coral: '#f0556f', blanco: '#ffffff'
};
export const F = { display: '"Lilita One", Outfit, sans-serif', ui: 'Outfit, sans-serif', texto: 'Nunito, sans-serif' };

export const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
export const I = (f: number, r: [number, number], v: [number, number], easing = ease) =>
  interpolate(f, r, v, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Resorte con amortiguación alta (sin rebote exagerado), como pide la guía de estilo del video. */
export function useResorte() {
  const { fps } = useVideoConfig();
  return (f: number, rigidez = 140, amortiguacion = 18) => (f <= 0 ? 0 : spring({ frame: f, fps, config: { stiffness: rigidez, damping: amortiguacion, mass: 1 } }));
}

/** Imagen de public/: en el render usa staticFile; en la página, la ruta base del sitio. */
export const recurso = (base: string | undefined, ruta: string) => (base !== undefined ? `${base}${ruta}` : staticFile(ruta));

/** Fondo: lila claro con manchas que flotan, o morado de marca con una luz dorada que viaja. */
export function Fondo({ morado }: { morado: number }) {
  const f = useCurrentFrame();
  const t = f / 60;
  return (
    <AbsoluteFill style={{ background: C.lila, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: '#e1d8ff', filter: 'blur(120px)', left: -260 + Math.sin(t / 3) * 90, top: -200 + Math.cos(t / 4) * 70 }} />
      <div style={{ position: 'absolute', width: 760, height: 760, borderRadius: '50%', background: '#ffe9b8', opacity: 0.7, filter: 'blur(130px)', right: -300 + Math.cos(t / 3.5) * 80, bottom: 120 + Math.sin(t / 2.8) * 90 }} />
      <AbsoluteFill style={{ opacity: morado, background: `radial-gradient(1200px 1000px at ${50 + Math.sin(t / 2.4) * 18}% ${30 + Math.cos(t / 3) * 10}%, #8f66ff 0%, ${C.dv7} 55%, #4a25b8 100%)` }}>
        <div style={{ position: 'absolute', width: 820, height: 820, borderRadius: '50%', background: 'rgba(255,209,102,.30)', filter: 'blur(140px)', left: 140 + Math.sin(t / 1.9) * 260, top: 980 + Math.cos(t / 2.3) * 200 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Escena con entrada y salida por desenfoque + escala; `desde`/`hasta` en cuadros del video. */
export function Transicion({ children, entra = true, sale = true }: { children: ReactNode; entra?: boolean; sale?: boolean }) {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const fin = entra ? I(f, [0, 20], [0, 1]) : 1;
  const fout = sale ? I(f, [d - 20, d], [1, 0], Easing.inOut(Easing.cubic)) : 1;
  const o = Math.min(fin, fout);
  return (
    <AbsoluteFill style={{ opacity: o, filter: o < 1 ? `blur(${(1 - o) * 18}px)` : undefined, scale: String(fout < 1 ? 1 + (1 - fout) * 0.07 : 0.95 + 0.05 * fin) }}>
      {children}
    </AbsoluteFill>
  );
}

type Parte = string | { t: string; color?: string; subrayado?: boolean };

/** Texto que entra palabra por palabra (desenfoque → nítido y un leve ascenso). */
export function Palabras({ partes, inicio = 0, paso = 4, style }: { partes: Parte[]; inicio?: number; paso?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const r = useResorte();
  let i = 0;
  const palabras = partes.flatMap(p => {
    const obj = typeof p === 'string' ? { t: p } : p;
    return obj.t.split(' ').filter(Boolean).map(w => ({ w, color: obj.color, subrayado: obj.subrayado }));
  });
  return (
    <div style={style}>
      {palabras.map(({ w, color, subrayado }, k) => {
        const s = r(f - inicio - i++ * paso, 120, 20);
        return (
          <span key={k} style={{
            display: 'inline-block', marginRight: '0.24em', opacity: lim(s * 1.3, 0, 1), filter: `blur(${(1 - lim(s, 0, 1)) * 10}px)`, translate: `0 ${(1 - s) * 28}px`, color,
            ...(subrayado ? { backgroundImage: `linear-gradient(${C.oro}, ${C.oro})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 92%', backgroundSize: `${I(f - inicio - k * paso, [14, 34], [0, 100])}% 0.26em` } : {})
          }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

/** Píldora de subtítulo de cada función, arriba y fuera de la zona de la interfaz de Instagram. */
export function Pildora({ partes, inicio = 6 }: { partes: Parte[]; inicio?: number }) {
  const f = useCurrentFrame();
  const r = useResorte();
  const s = r(f - inicio, 150, 18);
  return (
    <div style={{ position: 'absolute', top: 236, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lim(s, 0, 1), translate: `0 ${(1 - s) * -40}px` }}>
      <div style={{ maxWidth: 960, padding: '24px 40px', borderRadius: 999, background: C.blanco, boxShadow: '0 10px 0 rgba(27,18,48,.18), 0 30px 60px -20px rgba(27,18,48,.45)', textAlign: 'center' }}>
        <Palabras partes={partes} inicio={inicio + 4} paso={3} style={{ font: `800 46px/1.15 ${F.ui}`, color: C.tinta, letterSpacing: '-0.01em' }} />
      </div>
    </div>
  );
}

/** Ficha dorada para datos breves («5 preguntas · 3 minutos»). */
export function Ficha({ children, inicio, y = 1500 }: { children: ReactNode; inicio: number; y?: number }) {
  const f = useCurrentFrame();
  const r = useResorte();
  const s = r(f - inicio, 160, 16);
  return (
    <div style={{ position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: lim(s, 0, 1), scale: String(0.7 + 0.3 * s) }}>
      <div style={{ padding: '18px 34px', borderRadius: 26, background: C.oro, boxShadow: `0 8px 0 ${C.oro7}`, font: `800 38px ${F.ui}`, color: C.tinta, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/** Teléfono con isla y esquinas redondeadas; el contenido llena la pantalla (540×1169 de las capturas). */
export function Telefono({ children, ancho = 560, style }: { children: ReactNode; ancho?: number; style?: CSSProperties }) {
  const pantallaAncho = ancho - 28;
  const pantallaAlto = Math.round((pantallaAncho * 1169) / 540);
  return (
    <div style={{ width: ancho, padding: 14, borderRadius: 74, background: C.tinta, boxShadow: '0 18px 0 rgba(27,18,48,.22), 0 60px 120px -30px rgba(27,18,48,.6)', ...style }}>
      <div style={{ position: 'relative', width: pantallaAncho, height: pantallaAlto, borderRadius: 60, overflow: 'hidden', background: C.blanco }}>
        {children}
        <div style={{ position: 'absolute', top: 18, left: '50%', translate: '-50% 0', width: 150, height: 40, borderRadius: 20, background: C.tinta }} />
      </div>
    </div>
  );
}

/** Captura real de la app dentro del teléfono. */
export function Captura({ src, style }: { src: string; style?: CSSProperties }) {
  return <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', ...style }} />;
}

/**
 * Cursor (dedo) que viaja en curva desde `de` hasta `a` entre los cuadros indicados y hace clic en `clic`.
 * Coordenadas relativas al contenedor.
 */
export function Cursor({ de, a, desde, hasta, clic, sale }: { de: [number, number]; a: [number, number]; desde: number; hasta: number; clic: number; sale?: number }) {
  const f = useCurrentFrame();
  const k = I(f, [desde, hasta], [0, 1], Easing.inOut(Easing.cubic));
  const x = de[0] + (a[0] - de[0]) * k;
  const y = de[1] + (a[1] - de[1]) * k - Math.sin(k * Math.PI) * 120;
  const presion = f >= clic && f < clic + 10 ? 0.82 : 1;
  const o = Math.min(I(f, [desde - 10, desde], [0, 1]), sale ? I(f, [sale, sale + 12], [1, 0]) : 1);
  const onda = I(f, [clic, clic + 22], [0, 1]);
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o, pointerEvents: 'none' }}>
      {f >= clic && onda < 1 && <div style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', border: `6px solid ${C.dv}`, opacity: 1 - onda, scale: String(0.4 + onda) }} />}
      <svg width="86" height="96" viewBox="0 0 86 96" style={{ scale: String(presion), transformOrigin: '22px 6px', filter: 'drop-shadow(0 10px 14px rgba(27,18,48,.35))', translate: '-22px -6px' }}>
        <path d="M22 6c-6 0-10 4-10 10v38l-6-6c-5-4-11-3-14 2s-1 10 3 14l22 24c5 5 11 8 19 8h14c13 0 24-11 24-24V52c0-6-4-10-10-10-2 0-4 1-6 2 0-5-4-9-9-9-3 0-5 1-7 3-1-4-5-7-9-7-2 0-4 1-5 2V16c0-6-4-10-10-10z" fill="#fff" stroke={C.tinta} strokeWidth="5" strokeLinejoin="round" transform="translate(8 0)" />
      </svg>
    </div>
  );
}
