// Video de lanzamiento de Dataventura (storyboard en video-lanzamiento/STORYBOARD.md): vertical 1080×1920,
// 60 fps, 45 s. Gancho → problema → escalada → presentación → cinco funciones → llamado a la acción.
// Las pantallas de diagnóstico, resultado y mapa son capturas reales de la app; el reto del helado, la racha y el
// certificado están recreados en React con los datos reales del banco de preguntas.
import { AbsoluteFill, Easing, Img, Sequence, useCurrentFrame } from 'remotion';
import { Nexus } from '@/components/Nexus';
import { C, Captura, Cursor, F, Ficha, Fondo, I, lim, Palabras, Pildora, recurso, Telefono, Transicion, useResorte } from './piezas';

export const LANZAMIENTO = { fps: 60, ancho: 1080, alto: 1920, duracion: 2700 };

export type PropsLanzamiento = {
  /** Ruta base de las imágenes en la página (por ejemplo «/dataventura/»); en el render se usa staticFile. */
  base?: string;
  /** Dirección de la app que se muestra en el cierre, sin «https://». */
  url: string;
};

// Escenas en cuadros (60 por segundo).
const T = { gancho: [0, 210], problema: [210, 480], escalada: [480, 690], presenta: [690, 930], diagnostico: [930, 1260], retos: [1260, 1680], mapa: [1680, 1980], habito: [1980, 2250], certificado: [2250, 2430], cierre: [2430, 2700] } as const;
const SOLAPE = 12;

function Escena({ t, children, entra = true, sale = true }: { t: readonly [number, number]; children: React.ReactNode; entra?: boolean; sale?: boolean }) {
  const desde = Math.max(0, t[0] - (entra ? SOLAPE : 0));
  const hasta = t[1] + (sale ? SOLAPE : 0);
  return <Sequence from={desde} durationInFrames={hasta - desde} layout="none"><Transicion entra={entra} sale={sale}>{children}</Transicion></Sequence>;
}

/* 1 · Gancho */
function Gancho() {
  const f = useCurrentFrame();
  const r = useResorte();
  const s = r(f - 16, 90, 14);
  const rebanadas = [0.16, 0.09, 0.13, 0.07, 0.11, 0.05, 0.14, 0.08, 0.1, 0.07];
  const colores = ['#7b4dff', '#a98bff', '#5a30d6', '#cdbcff', '#8f66ff', '#e5e0f2', '#3b2a6e', '#b9a4ff', '#6a3de8', '#d9ccfb'];
  let acc = 0;
  const arcos = rebanadas.map((v, i) => {
    const a0 = acc * Math.PI * 2 - Math.PI / 2; acc += v; const a1 = acc * Math.PI * 2 - Math.PI / 2;
    const p = (a: number) => `${200 + Math.cos(a) * 190} ${200 + Math.sin(a) * 190}`;
    return <path key={i} d={`M200 200 L${p(a0)} A190 190 0 ${v > 0.5 ? 1 : 0} 1 ${p(a1)} Z`} fill={colores[i]} stroke="#fff" strokeWidth="4" />;
  });
  const dudas: [number, number, number, number][] = [[150, 900, -16, 44], [820, 860, 14, 56], [110, 1380, 10, 68], [860, 1330, -12, 80], [480, 820, 6, 92]];
  return (
    <AbsoluteFill>
      <Palabras inicio={4} partes={['¿Un gráfico te deja con más', { t: 'dudas', color: C.dv, subrayado: true }, 'que respuestas?']}
        style={{ position: 'absolute', top: 300, left: 80, right: 80, font: `400 100px/1.06 ${F.display}`, color: C.tinta, textAlign: 'center' }} />
      <div style={{ position: 'absolute', left: 290, top: 900, width: 500, height: 500, scale: String(0.6 + 0.4 * s), opacity: lim(s, 0, 1), rotate: `${Math.sin(f / 9) * 4 + (1 - s) * -40}deg` }}>
        <svg viewBox="0 0 400 400" width="500" height="500" style={{ filter: 'drop-shadow(0 30px 40px rgba(59,42,110,.25))' }}>{arcos}</svg>
      </div>
      {dudas.map(([x, y, rot, d], i) => {
        const q = r(f - d, 180, 12);
        return <span key={i} style={{ position: 'absolute', left: x, top: y + Math.sin((f + i * 20) / 14) * 10, font: `400 120px ${F.display}`, color: i % 2 ? C.dv : C.coral, opacity: lim(q, 0, 1), scale: String(q), rotate: `${rot}deg` }}>?</span>;
      })}
    </AbsoluteFill>
  );
}

const CONCEPTOS = ['Promedio', 'Porcentaje', 'Tendencia', '¿Correlación o causa?', 'Mediana', 'Gráfico de barras', 'Margen de error'];
const ficha = (t: string, extra: React.CSSProperties = {}) => (
  <span style={{ position: 'absolute', whiteSpace: 'nowrap', padding: '20px 36px', borderRadius: 999, background: C.blanco, border: `4px solid ${C.borde}`, boxShadow: `0 8px 0 ${C.borde}`, font: `800 46px ${F.ui}`, color: C.tinta, ...extra }}>{t}</span>
);

/* 2 · Problema */
function Problema() {
  const f = useCurrentFrame();
  const r = useResorte();
  const destinos: [number, number, number][] = [[130, 1400, -5], [520, 1412, 4], [300, 1280, 3], [240, 1152, -3], [700, 1272, 6], [330, 1024, 4], [160, 896, -4]];
  return (
    <AbsoluteFill>
      <Palabras inicio={2} partes={['Los datos están en todas partes:']} style={{ position: 'absolute', top: 300, left: 80, right: 80, font: `400 88px/1.08 ${F.display}`, color: C.tinta, textAlign: 'center' }} />
      <Palabras inicio={30} paso={3} partes={['en el trabajo, en las noticias, en tus cuentas.']} style={{ position: 'absolute', top: 520, left: 110, right: 110, font: `800 52px/1.3 ${F.texto}`, color: C.suave, textAlign: 'center' }} />
      {CONCEPTOS.map((t, i) => {
        const s = r(f - 40 - i * 14, 120, 15);
        const [x, y, rot] = destinos[i];
        return <span key={t}>{ficha(t, { left: x, top: -200 + (y + 200) * s, rotate: `${rot * s}deg`, opacity: lim(s * 2, 0, 1) })}</span>;
      })}
    </AbsoluteFill>
  );
}

/* 3 · Escalada */
function Escalada() {
  const f = useCurrentFrame();
  const r = useResorte();
  const zoom = 1 + I(f, [0, 220], [0, 0.18], Easing.linear);
  const desenfoque = I(f, [0, 160], [1, 9]);
  const fichas = Array.from({ length: 26 }, (_, i) => ({ t: CONCEPTOS[i % CONCEPTOS.length], x: ((i * 397) % 1000) - 120, y: 120 + ((i * 613) % 1700), rot: ((i * 37) % 24) - 12, d: (i % 9) * 4 }));
  const s = r(f - 26, 120, 18);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: String(zoom), filter: `blur(${desenfoque}px)` }}>
        {fichas.map((c, i) => { const q = r(f - c.d, 140, 16); return <span key={i}>{ficha(c.t, { left: c.x, top: c.y, rotate: `${c.rot}deg`, opacity: lim(q, 0, 1) * 0.9, scale: String(0.6 + 0.4 * q) })}</span>; })}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 760, padding: '64px 50px', borderRadius: 56, background: 'rgba(255,255,255,.9)', boxShadow: '0 40px 90px -30px rgba(59,42,110,.5)', opacity: lim(s, 0, 1), scale: String(0.9 + 0.1 * s) }}>
        <Palabras inicio={34} partes={['…y nadie te enseñó a', { t: 'leerlos.', color: C.dv, subrayado: true }]} style={{ font: `400 104px/1.05 ${F.display}`, color: C.tinta, textAlign: 'center' }} />
      </div>
    </AbsoluteFill>
  );
}

/* 4 · Presentación */
function Presentacion({ base }: { base?: string }) {
  const f = useCurrentFrame();
  const r = useResorte();
  const icono = r(f - 14, 130, 13);
  const nexus = r(f - 50, 90, 14);
  return (
    <AbsoluteFill>
      <Img src={recurso(base, 'icons/dataventura-icon.svg')} style={{ position: 'absolute', left: 420, top: 330, width: 240, height: 240, borderRadius: 60, boxShadow: '0 0 0 8px rgba(255,255,255,.9), 0 30px 60px rgba(27,18,48,.35)', scale: String(lim(icono, 0, 1.2)), rotate: `${(1 - icono) * -24}deg` }} />
      <Palabras inicio={30} partes={[{ t: 'Conoce', color: C.blanco }]} style={{ position: 'absolute', top: 610, left: 60, right: 60, font: `400 112px/1 ${F.display}`, textAlign: 'center' }} />
      <Palabras inicio={36} partes={[{ t: 'Dataventura', color: C.oro }]} style={{ position: 'absolute', top: 720, left: 40, right: 40, font: `400 136px/1 ${F.display}`, textAlign: 'center' }} />
      <Palabras inicio={52} paso={3} partes={['Aprende a pensar con datos en 5 minutos al día']} style={{ position: 'absolute', top: 890, left: 130, right: 130, font: `800 52px/1.25 ${F.texto}`, color: C.lila2, textAlign: 'center' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', translate: `0 ${(1 - nexus) * 500 + Math.sin(f / 22) * 10}px`, opacity: lim(nexus * 2, 0, 1) }}>
        <Nexus pose="hello" tam={400} estatico decorativo />
      </div>
    </AbsoluteFill>
  );
}

/* Pantalla: el teléfono va centrado; su pantalla mide 512×1108 y empieza en (284, 434). */
const TEL = { x: 270, y: 420, ancho: 540 };
const PANTALLA = { x: TEL.x + 14, y: TEL.y + 14, w: TEL.ancho - 28, factor: (TEL.ancho - 28) / 540 };
const enPantalla = (x: number, y: number): [number, number] => [PANTALLA.x + x * PANTALLA.factor, PANTALLA.y + y * PANTALLA.factor];
/** Para las pantallas recreadas, que ya están en píxeles de pantalla (512 de ancho). */
const enUI = (x: number, y: number): [number, number] => [PANTALLA.x + x, PANTALLA.y + y];

function Entrada({ children }: { children: React.ReactNode }) {
  const f = useCurrentFrame();
  const r = useResorte();
  const s = r(f - 10, 110, 17);
  return <div style={{ position: 'absolute', left: TEL.x, top: TEL.y, translate: `0 ${(1 - s) * 260}px`, opacity: lim(s * 1.5, 0, 1), rotate: `${(1 - s) * 4}deg` }}>{children}</div>;
}

/* 5 · Diagnóstico gratis */
function Diagnostico({ base }: { base?: string }) {
  const f = useCurrentFrame();
  const resultado = I(f, [196, 216], [0, 1]);
  const marcado = f >= 150;
  const zoom = 1 + I(f, [216, 300], [0, 0.05]);
  return (
    <AbsoluteFill>
      <Pildora partes={['Empieza con un', { t: 'diagnóstico gratis', color: C.dv }]} />
      <Entrada>
        <Telefono ancho={TEL.ancho} style={{ scale: String(zoom) }}>
          <Captura src={recurso(base, 'img/app/app-diagnostico.webp')} />
          {marcado && <div style={{ position: 'absolute', left: 28 * PANTALLA.factor, top: 488 * PANTALLA.factor, width: 484 * PANTALLA.factor, height: 80 * PANTALLA.factor, borderRadius: 18, border: `5px solid ${C.dv}`, background: 'rgba(123,77,255,.12)', opacity: 1 - resultado }} />}
          <Captura src={recurso(base, 'img/app/app-resultado.webp')} style={{ opacity: resultado }} />
        </Telefono>
      </Entrada>
      <Cursor de={[900, 1500]} a={enPantalla(330, 528)} desde={84} hasta={140} clic={150} sale={178} />
      <Ficha inicio={60} y={1508}>5 preguntas · 3 minutos · sin cuenta</Ficha>
    </AbsoluteFill>
  );
}

/* 6 · Retos con explicación al instante (pantalla recreada del primer reto del banco) */
const BARRAS: [string, number][] = [['Chocolate', 50], ['Vainilla', 30], ['Frutilla', 40], ['Menta', 20]];
const OPCIONES = ['Frutilla', 'Menta', 'Chocolate', 'Vainilla'];

function Retos() {
  const f = useCurrentFrame();
  const r = useResorte();
  const elegida = f >= 150, comprobada = f >= 218;
  const panel = r(f - 226, 130, 18);
  const sx = (n: number) => n; // la pantalla recreada ya mide 512 de ancho
  return (
    <AbsoluteFill>
      <Pildora partes={['Retos cortos con', { t: 'explicación al instante', color: C.dv }]} />
      <Entrada>
        <Telefono ancho={TEL.ancho}>
          <div style={{ position: 'absolute', inset: 0, background: C.blanco, fontFamily: F.ui }}>
            <div style={{ position: 'absolute', top: 76, left: 28, right: 28, height: 12, borderRadius: 8, background: C.borde }}><div style={{ width: '20%', height: '100%', borderRadius: 8, background: C.dv }} /></div>
            <div style={{ position: 'absolute', top: 112, left: 28, font: `800 17px ${F.ui}`, letterSpacing: '.08em', color: C.dv }}>ISLA DEL ORIGEN · 1 DE 5</div>
            <div style={{ position: 'absolute', top: 142, left: 28, right: 28, font: `800 30px/1.2 ${F.ui}`, color: C.tinta }}>Según el gráfico, ¿qué sabor de helado se vendió más?</div>
            <div style={{ position: 'absolute', top: 252, left: 28, right: 28, height: 330, borderRadius: 24, border: `3px solid ${C.borde}`, padding: '18px 22px' }}>
              <div style={{ font: `700 17px ${F.texto}`, color: C.gris }}>Helados vendidos por sabor</div>
              <div style={{ position: 'absolute', left: 30, right: 30, bottom: 46, height: 220, display: 'flex', alignItems: 'flex-end', gap: 26, borderBottom: `3px solid ${C.borde}` }}>
                {BARRAS.map(([n, v], i) => {
                  const s = r(f - 40 - i * 7, 110, 14);
                  return <div key={n} style={{ flex: 1, height: `${(v / 50) * 100 * Math.max(0, s)}%`, borderRadius: '10px 10px 3px 3px', background: comprobada && n === 'Chocolate' ? C.verde : '#2f7fd0', transition: 'none' }} />;
                })}
              </div>
              <div style={{ position: 'absolute', left: 30, right: 30, bottom: 12, display: 'flex', gap: 26 }}>
                {BARRAS.map(([n]) => <span key={n} style={{ flex: 1, textAlign: 'center', font: `700 15px ${F.texto}`, color: C.gris }}>{n}</span>)}
              </div>
            </div>
            {OPCIONES.map((o, i) => {
              const esta = i === 2;
              const borde = esta && comprobada ? C.verde : esta && elegida ? C.dv : C.borde;
              const fondo = esta && comprobada ? C.verdeSuave : esta && elegida ? C.lila2 : C.blanco;
              return (
                <div key={o} style={{ position: 'absolute', left: 28, right: 28, top: sx(612 + i * 92), height: 76, borderRadius: 20, border: `3px solid ${borde}`, background: fondo, boxShadow: `0 5px 0 ${borde}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', font: `800 26px ${F.ui}`, color: C.tinta }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: esta && comprobada ? C.verde : C.lila2, color: esta && comprobada ? C.blanco : C.dv7, font: `800 20px ${F.ui}` }}>{esta && comprobada ? <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg> : 'ABCD'[i]}</span>{o}
                </div>
              );
            })}
            <div style={{ position: 'absolute', left: 28, right: 28, top: 992, height: 80, borderRadius: 22, display: 'grid', placeItems: 'center', font: `800 26px ${F.ui}`, letterSpacing: '.06em', color: elegida ? C.blanco : C.gris, background: elegida ? C.dv : C.lila3, boxShadow: elegida ? `0 6px 0 ${C.dv7}` : 'none', translate: f >= 214 && f < 222 ? '0 4px' : undefined }}>COMPROBAR</div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 232, background: C.verdeSuave, borderTop: `4px solid ${C.verde}`, translate: `0 ${(1 - panel) * 250}px`, padding: '22px 26px', display: 'flex', gap: 16 }}>
              <Nexus pose="happy" cabeza tam={108} estatico decorativo />
              <div>
                <div style={{ font: `400 46px ${F.display}`, color: C.verde7 }}>¡Correcto!</div>
                <div style={{ marginTop: 8, font: `800 25px/1.3 ${F.texto}`, color: C.verde7 }}>La barra más alta es Chocolate: 50 helados vendidos.</div>
              </div>
            </div>
          </div>
        </Telefono>
      </Entrada>
      <Cursor de={[940, 1560]} a={enUI(300, 834)} desde={96} hasta={142} clic={150} sale={164} />
      <Cursor de={enUI(300, 834)} a={enUI(300, 1032)} desde={168} hasta={206} clic={214} sale={236} />
    </AbsoluteFill>
  );
}

/* 7 · Mapa de islas (captura real) */
function Mapa({ base }: { base?: string }) {
  const f = useCurrentFrame();
  const escala = I(f, [20, 230], [1.45, 1], Easing.inOut(Easing.cubic));
  const pulso = (f % 50) / 50;
  return (
    <AbsoluteFill>
      <Pildora partes={['Avanza', { t: 'isla por isla', color: C.dv }]} />
      <Entrada>
        <Telefono ancho={TEL.ancho}>
          <div style={{ position: 'absolute', inset: 0, scale: String(escala), transformOrigin: '28% 82%' }}>
            <Captura src={recurso(base, 'img/app/app-mapa.webp')} />
            <div style={{ position: 'absolute', left: 150 * PANTALLA.factor - 60, top: 800 * PANTALLA.factor - 60, width: 120, height: 120, borderRadius: '50%', border: `6px solid ${C.oro}`, opacity: (1 - pulso) * 0.9, scale: String(0.5 + pulso) }} />
          </div>
        </Telefono>
      </Entrada>
      <Ficha inicio={70} y={1508}>5 etapas · 20 mapas · 5 islas cada uno</Ficha>
    </AbsoluteFill>
  );
}

/* 8 · Racha y meta diaria */
function Habito() {
  const f = useCurrentFrame();
  const r = useResorte();
  const tarjeta = r(f - 8, 110, 17);
  const cuenta = Math.round(I(f, [40, 130], [1, 7], Easing.out(Easing.cubic)));
  const meta = I(f, [150, 176], [0, 1], Easing.inOut(Easing.cubic));
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <AbsoluteFill>
      <Pildora partes={['Tu', { t: 'racha', color: C.dv }, 'te mantiene en ruta']} />
      <div style={{ position: 'absolute', left: 110, right: 110, top: 470, padding: '64px 56px', borderRadius: 60, background: C.blanco, boxShadow: '0 16px 0 rgba(27,18,48,.18), 0 60px 120px -30px rgba(27,18,48,.55)', translate: `0 ${(1 - tarjeta) * 300}px`, opacity: lim(tarjeta * 1.5, 0, 1), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <svg width="150" height="180" viewBox="0 0 30 36" style={{ scale: String(1 + Math.sin(f / 7) * 0.04) }}><path d="M15 1c2 6 9 9 9 19a9 9 0 0 1-18 0c0-4 2-7 4-9 0 3 1 5 3 6-1-6 0-11 2-16z" fill={C.coral} /><path d="M15 18c2 3 5 4 5 8a5 5 0 0 1-10 0c0-3 3-5 5-8z" fill={C.oro} /></svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ font: `400 200px/0.9 ${F.display}`, color: C.tinta }}>{cuenta}</span>
            <span style={{ font: `800 40px ${F.ui}`, color: C.gris, letterSpacing: '.04em' }}>DÍAS DE RACHA</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {dias.map((d, i) => {
            const on = cuenta >= i + 1;
            const s = on ? r(f - (40 + (i * 90) / 6), 200, 12) : 0;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 92, height: 92, borderRadius: '50%', background: on ? C.coral : C.lila, border: `4px solid ${on ? '#c0344f' : C.borde}`, scale: String(on ? 0.85 + 0.15 * lim(s, 0, 1.1) : 0.85) }} />
                <span style={{ font: `800 30px ${F.ui}`, color: C.gris }}>{d}</span>
              </div>
            );
          })}
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ font: `800 34px ${F.ui}`, color: C.tinta, textAlign: 'center' }}>Meta diaria</span>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: 8, borderRadius: 999, background: C.lila, border: `3px solid ${C.borde}` }}>
            <div style={{ position: 'absolute', top: 8, bottom: 8, left: `calc(8px + ${meta} * (100% - 16px) / 3)`, width: 'calc((100% - 16px) / 3)', borderRadius: 999, background: C.dv, boxShadow: `0 6px 0 ${C.dv7}` }} />
            {['3 min', '5 min', '10 min'].map((m, i) => <span key={m} style={{ position: 'relative', textAlign: 'center', padding: '22px 0', font: `800 38px ${F.ui}`, color: (i === 0 && meta < 0.5) || (i === 1 && meta >= 0.5) ? C.blanco : C.gris }}>{m}</span>)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* 9 · Certificado por etapa (beneficio Premium) */
function Certificado() {
  const f = useCurrentFrame();
  const r = useResorte();
  const s = r(f - 8, 100, 15);
  const brillo = I(f, [70, 130], [-40, 140], Easing.inOut(Easing.cubic));
  const etiqueta = r(f - 60, 160, 16);
  return (
    <AbsoluteFill>
      <Pildora partes={['Un', { t: 'certificado', color: C.dv }, 'por cada etapa']} />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 560, padding: '60px 56px', borderRadius: 48, background: C.blanco, border: `7px solid ${C.tinta}`, boxShadow: `0 20px 0 ${C.dv}`, overflow: 'hidden', rotate: `${-2 - (1 - s) * 10}deg`, translate: `0 ${(1 - s) * 260}px`, opacity: lim(s * 1.5, 0, 1) }}>
        <div style={{ font: `800 26px ${F.ui}`, letterSpacing: '.16em', color: C.dv7 }}>DELHOS ACADEMY · DATAVENTURA</div>
        <div style={{ marginTop: 18, font: `400 82px/1 ${F.display}`, color: C.tinta }}>Certificado de etapa</div>
        <div style={{ marginTop: 30, font: `800 34px ${F.texto}`, color: C.suave }}>Se certifica que</div>
        <div style={{ font: `400 64px ${F.display}`, color: C.tinta }}>Tu nombre</div>
        <div style={{ marginTop: 6, font: `800 34px/1.3 ${F.texto}`, color: C.suave }}>completó la etapa <span style={{ color: C.dv }}>Explorador</span> de la ruta de pensamiento analítico con datos.</div>
        <div style={{ marginTop: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div><div style={{ font: `800 22px ${F.ui}`, letterSpacing: '.12em', color: C.gris }}>CÓDIGO VERIFICABLE (EJEMPLO)</div><div style={{ font: `700 40px ui-monospace, Consolas, monospace`, color: C.tinta }}>DV-7K2P-Q9XM</div></div>
          <div style={{ width: 170, height: 170, borderRadius: '50%', border: `10px solid ${C.oro}`, background: C.dv, color: C.blanco, display: 'grid', placeItems: 'center', textAlign: 'center', font: `400 30px/1.1 ${F.display}`, rotate: '-10deg', boxShadow: `0 8px 0 ${C.dv7}` }}>Delhos<br />Academy</div>
        </div>
        <div style={{ position: 'absolute', top: -100, bottom: -100, width: 160, left: `${brillo}%`, background: 'linear-gradient(105deg, transparent, rgba(255,255,255,.75), transparent)', rotate: '12deg' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'center', opacity: lim(etiqueta, 0, 1), scale: String(0.8 + 0.2 * etiqueta) }}>
        <span style={{ padding: '16px 30px', borderRadius: 999, background: 'rgba(255,255,255,.16)', border: '3px solid rgba(255,255,255,.35)', font: `800 34px ${F.ui}`, color: C.blanco }}>Beneficio Premium · lo emite Delhos Academy</span>
      </div>
    </AbsoluteFill>
  );
}

/* 10 · Llamado a la acción */
function Cierre({ base, url }: { base?: string; url: string }) {
  const f = useCurrentFrame();
  const r = useResorte();
  const nexus = r(f - 6, 120, 13);
  const firma = r(f - 30, 120, 16);
  const boton = r(f - 64, 160, 14);
  const brillo = ((f - 90) % 110) / 110;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', scale: String(lim(nexus, 0, 1.1)), translate: `0 ${Math.sin(f / 20) * 8}px` }}>
        <Nexus pose="happy" tam={430} estatico decorativo />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: lim(firma, 0, 1), translate: `0 ${(1 - firma) * 60}px` }}>
        <Img src={recurso(base, 'icons/dataventura-icon.svg')} style={{ width: 120, height: 120, borderRadius: 32, boxShadow: '0 0 0 5px rgba(255,255,255,.9)' }} />
        <span style={{ font: `400 132px ${F.display}`, color: C.blanco }}>Dataventura</span>
      </div>
      <Palabras inicio={44} partes={[{ t: 'Piensa con datos.', color: C.oro }]} style={{ position: 'absolute', top: 1030, left: 0, right: 0, font: `400 88px ${F.display}`, textAlign: 'center' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1180, display: 'flex', justifyContent: 'center', scale: String(lim(boton, 0, 1.08)) }}>
        <div style={{ position: 'relative', overflow: 'hidden', padding: '34px 76px', borderRadius: 34, background: C.oro, boxShadow: `0 12px 0 ${C.oro7}`, font: `800 58px ${F.ui}`, letterSpacing: '.02em', color: C.tinta }}>
          Empieza gratis →
          {f > 90 && <span style={{ position: 'absolute', top: -20, bottom: -20, width: 120, left: `${-30 + brillo * 160}%`, background: 'linear-gradient(105deg, transparent, rgba(255,255,255,.7), transparent)', rotate: '14deg' }} />}
        </div>
      </div>
      <Palabras inicio={96} partes={[url]} style={{ position: 'absolute', top: 1360, left: 0, right: 0, font: `800 44px ${F.ui}`, color: C.blanco, textAlign: 'center' }} />
      <Palabras inicio={110} paso={2} partes={['Sin descargas: directo en tu navegador']} style={{ position: 'absolute', top: 1430, left: 0, right: 0, font: `800 36px ${F.texto}`, color: C.lila3, textAlign: 'center' }} />
    </AbsoluteFill>
  );
}

export function Lanzamiento({ base, url }: PropsLanzamiento) {
  const f = useCurrentFrame();
  const morado = I(f, [T.presenta[0] - 10, T.presenta[0] + 50], [0, 1]);
  return (
    <AbsoluteFill style={{ fontFamily: F.texto, color: C.tinta }}>
      <Fondo morado={morado} />
      <Escena t={T.gancho} entra={false}><Gancho /></Escena>
      <Escena t={T.problema}><Problema /></Escena>
      <Escena t={T.escalada}><Escalada /></Escena>
      <Escena t={T.presenta}><Presentacion base={base} /></Escena>
      <Escena t={T.diagnostico}><Diagnostico base={base} /></Escena>
      <Escena t={T.retos}><Retos /></Escena>
      <Escena t={T.mapa}><Mapa base={base} /></Escena>
      <Escena t={T.habito}><Habito /></Escena>
      <Escena t={T.certificado}><Certificado /></Escena>
      <Escena t={T.cierre} sale={false}><Cierre base={base} url={url} /></Escena>
    </AbsoluteFill>
  );
}
