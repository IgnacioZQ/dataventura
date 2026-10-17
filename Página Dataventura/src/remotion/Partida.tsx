// "Una partida en 26 segundos": composición de Remotion que se reproduce dentro de la landing con @remotion/player.
// Todo se calcula cuadro a cuadro (useCurrentFrame), sin video grabado: se ve nítido en cualquier pantalla.
// La pregunta es real (Isla del Origen, «¿qué sabor de helado se vendió más?») y las cifras salen de la app.
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Nexus, type Pose } from '@/components/Nexus';
import { olasEnCapas } from '@/lib/haikei';
import { MARES } from '@/contenido';
import type { Textos } from '@/i18n/textos';

export type PropsPartida = { t: Textos['partida']; etapas: string[] };

export const PARTIDA = { fps: 30, ancho: 1280, alto: 720, duracion: 780 };

/** Capítulos del video (cuadro de inicio), para saltar desde la página. */
export const CAPITULOS = [
  { id: 'zarpa', nombre: 'Zarpa', desde: 0 },
  { id: 'pregunta', nombre: 'Una pregunta', desde: 130 },
  { id: 'racha', nombre: 'Tu racha', desde: 330 },
  { id: 'ruta', nombre: 'La ruta', desde: 450 },
  { id: 'certificado', nombre: 'Certificado', desde: 590 },
  { id: 'cierre', nombre: 'A navegar', desde: 690 }
] as const;

const C = { dv: '#7b4dff', dv7: '#5a30d6', tinta: '#1b1230', oro: '#ffd166', borde: '#e5e0f2', lila: '#f4f0ff', verde: '#2fbf8a', verde7: '#167a55', coral: '#f0556f' };
const display = '"Lilita One", "Outfit", sans-serif';
const ui = '"Outfit", sans-serif';
const cuerpo = '"Nunito", sans-serif';

const OLAS = olasEnCapas({ ancho: 1280, alto: 240, capas: 3, picos: 5, amplitud: 20, semilla: 12, desde: 0.3, hasta: 0.75 });

function Mar({ colores = ['#cdbcff', '#a98bff', '#7b4dff'], velocidad = 1 }: { colores?: string[]; velocidad?: number }) {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 240, overflow: 'hidden' }}>
      {OLAS.map((d, i) => {
        const x = -((f * (1.2 + i * 0.7) * velocidad) % 1280);
        return (
          <svg key={i} viewBox="0 0 2560 240" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: x, width: 2560, height: 240 }}>
            <path d={d} fill={colores[i]} /><path d={d} fill={colores[i]} transform="translate(1280 0)" />
          </svg>
        );
      })}
    </div>
  );
}

function Galeon({ tam = 220, color = C.dv }: { tam?: number; color?: string }) {
  return (
    <svg width={tam} height={tam * 0.55} viewBox="-54 -50 120 64">
      <path d="M-50 -30 L-26 -30 L-26 -18 L30 -18 Q42 -22 58 -38 Q56 -6 26 4 L-30 4 Q-48 0 -50 -16Z" fill={color} stroke={C.tinta} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-3 -48 V-16" stroke={C.tinta} strokeWidth="6" />
      <path d="M-26 -46 L26 -42 L22 -22 L-24 -24Z" fill="#fff" stroke={C.tinta} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-3 -50 L14 -56 L-3 -60Z" fill={C.oro} stroke={C.tinta} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

const aparecer = (f: number, inicio: number, fps: number, cfg = { damping: 14, stiffness: 140 }) => spring({ frame: f - inicio, fps, config: cfg });

// ------------------------------------------------------------------ escenas

function Zarpa({ t }: PropsPartida) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = interpolate(f, [0, 90], [-260, 330], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const balanceo = Math.sin(f / 9) * 4;
  const titulo = aparecer(f, 18, fps);
  const sub = aparecer(f, 34, fps);
  const nx = aparecer(f, 50, fps, { damping: 9, stiffness: 120 });
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#efe9ff 0%,#ffffff 70%)' }}>
      <Mar />
      <div style={{ position: 'absolute', left: x, bottom: 150, transform: `rotate(${balanceo}deg)` }}><Galeon tam={260} /></div>
      <div style={{ position: 'absolute', top: 110, right: 120, textAlign: 'right' }}>
        <div style={{ fontFamily: display, fontSize: 120, color: C.dv, lineHeight: 1, transform: `scale(${titulo})`, transformOrigin: 'right center' }}>Dataventura</div>
        <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 34, letterSpacing: '.12em', color: C.tinta, opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>{t.marca}</div>
      </div>
      <div style={{ position: 'absolute', right: 150, top: 290, transform: `scale(${nx}) rotate(${(1 - nx) * -20}deg)`, transformOrigin: 'bottom center' }}>
        <Nexus pose="hello" tam={170} estatico decorativo />
      </div>
    </AbsoluteFill>
  );
}

const VALORES = [50, 30, 40, 20];
/** Orden de las alternativas en la app: Frutilla, Menta, Chocolate, Vainilla (índices de los sabores). */
const ORDEN = [2, 3, 0, 1];

function Pregunta({ t }: PropsPartida) {
  const BARRAS = t.sabores.map((sabor, i) => ({ sabor, v: VALORES[i] }));
  const OPCIONES = ORDEN.map(i => t.sabores[i]);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = aparecer(f, 0, fps, { damping: 16, stiffness: 120 });
  const elegida = f >= 112;
  const correcta = f >= 120;
  const pose: Pose = correcta ? 'happy' : f > 40 ? 'think' : 'idle';
  // cursor que va a la alternativa C
  const cx = interpolate(f, [70, 108], [1180, 905], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(f, [70, 108], [690, 468], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const clic = f >= 108 && f < 116 ? 0.8 : 1;
  const premio = aparecer(f, 124, fps, { damping: 10, stiffness: 160 });
  const xp = interpolate(f, [128, 180], [0, -90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.lila }}>
      <div style={{ position: 'absolute', left: 70, top: 40 + (1 - entra) * 60, opacity: entra, width: 700, background: '#fff', borderRadius: 34, border: `3px solid ${C.borde}`, boxShadow: `0 8px 0 ${C.borde}`, padding: '28px 34px' }}>
        <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 20, letterSpacing: '.1em', color: '#b07d00' }}>{t.isla}</div>
        <div style={{ fontFamily: display, fontSize: 38, lineHeight: 1.1, color: C.tinta, marginTop: 8 }}>{t.pregunta}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26, height: 250, marginTop: 22, padding: '0 18px', borderBottom: `3px solid ${C.borde}` }}>
          {BARRAS.map((b, i) => {
            const h = aparecer(f, 14 + i * 7, fps, { damping: 12, stiffness: 110 }) * b.v * 4.4;
            const gana = correcta && i === 0;
            return (
              <div key={b.sabor} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: ui, fontWeight: 800, fontSize: 22, color: '#8a84a0' }}>{Math.round((h / 4.4))}</span>
                <div style={{ width: '100%', height: h, borderRadius: '14px 14px 4px 4px', background: gana ? C.verde : '#2b78d6' }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 26, padding: '10px 18px 0' }}>
          {BARRAS.map(b => <span key={b.sabor} style={{ flex: 1, textAlign: 'center', fontFamily: ui, fontWeight: 800, fontSize: 20, color: '#6b6580' }}>{b.sabor}</span>)}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 820, top: 150, width: 390, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {OPCIONES.map((o, i) => {
          const a = aparecer(f, 30 + i * 6, fps);
          const esC = i === 2;
          const bien = esC && correcta;
          const marcada = esC && elegida && !correcta;
          return (
            <div key={o} style={{ opacity: a, transform: `translateX(${(1 - a) * 60}px)`, display: 'flex', alignItems: 'center', gap: 16, height: 70, padding: '0 20px', borderRadius: 18, background: bien ? '#dff7ec' : marcada ? '#efe9ff' : '#fff', border: `3px solid ${bien ? C.verde : marcada ? C.dv : C.borde}`, boxShadow: `0 5px 0 ${bien ? '#8fe0b8' : C.borde}` }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: bien ? C.verde : '#efe9ff', color: bien ? '#fff' : C.dv7, fontFamily: ui, fontWeight: 800, fontSize: 20 }}>{'ABCD'[i]}</span>
              <span style={{ fontFamily: ui, fontWeight: 800, fontSize: 28, color: bien ? C.verde7 : C.tinta }}>{o}</span>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 860, bottom: -10 }}><Nexus pose={pose} tam={150} estatico decorativo /></div>
      {correcta && (
        <div style={{ position: 'absolute', left: 70, bottom: 34, transform: `scale(${premio})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 18, background: '#dff7ec', border: `3px solid #8fe0b8`, borderRadius: 22, padding: '14px 24px' }}>
          <span style={{ fontFamily: display, fontSize: 40, color: C.verde7 }}>{t.excelente}</span>
          <span style={{ fontFamily: cuerpo, fontWeight: 800, fontSize: 24, color: C.verde7 }}>{t.explica}</span>
        </div>
      )}
      {correcta && <div style={{ position: 'absolute', left: 1040, top: 120 + xp, opacity: interpolate(f, [150, 185], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontFamily: display, fontSize: 52, color: C.oro, WebkitTextStroke: `2px ${C.tinta}` }}>+10 XP</div>}
      {f >= 70 && f < 150 && (
        <svg width="46" height="54" viewBox="0 0 24 28" style={{ position: 'absolute', left: cx, top: cy, transform: `scale(${clic})` }}>
          <path d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.5 L12 15.8 L19.5 15.8Z" fill="#fff" stroke={C.tinta} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
}

function Racha({ t }: PropsPartida) {
  const DIAS = t.dias;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const encendidos = Math.min(7, Math.floor(interpolate(f, [10, 80], [0, 7.99], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const llama = 0.7 + encendidos * 0.06 + Math.sin(f / 4) * 0.02;
  const meta = interpolate(f, [20, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const titulo = aparecer(f, 0, fps);
  const R = 92, L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: '#fff4e0', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 110 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="130" height="130" viewBox="0 0 24 24" style={{ transform: `scale(${llama})` }}>
            <path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-6 1-9z" fill={C.coral} />
            <path d="M12 13c.6 2 3 3 3 5a3 3 0 0 1-6 0c0-1.5 1-2.5 3-5z" fill={C.oro} />
          </svg>
          <div>
            <div style={{ fontFamily: display, fontSize: 120, lineHeight: .9, color: '#c0344f' }}>{encendidos}</div>
            <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 24, letterSpacing: '.08em', color: '#8a5a3c' }}>{t.racha}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {DIAS.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: ui, fontWeight: 800, fontSize: 22, color: '#8a5a3c' }}>{d}</span>
              <span style={{ width: 52, height: 52, borderRadius: '50%', background: i < encendidos ? C.coral : '#fff', border: `3px solid ${i < encendidos ? '#c0344f' : '#f4e3c1'}`, transform: `scale(${i < encendidos ? 1 : 0.85})` }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${titulo})` }}>
        <svg width="230" height="230" viewBox="0 0 230 230">
          <circle cx="115" cy="115" r={R} fill="none" stroke="#f4e3c1" strokeWidth="22" />
          <circle cx="115" cy="115" r={R} fill="none" stroke={C.dv} strokeWidth="22" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - meta)} transform="rotate(-90 115 115)" />
          <text x="115" y="112" textAnchor="middle" fontFamily={display} fontSize="64" fill={C.tinta}>{Math.round(meta * 5)}</text>
          <text x="115" y="150" textAnchor="middle" fontFamily={ui} fontWeight={800} fontSize="22" fill="#6b6580">{t.de5}</text>
        </svg>
        <div style={{ fontFamily: display, fontSize: 46, color: C.tinta }}>{t.metaOk}</div>
      </div>
    </AbsoluteFill>
  );
}

function Ruta({ t, etapas }: PropsPartida) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const avance = interpolate(f, [16, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: C.tinta, alignItems: 'center', paddingTop: 70 }}>
      <div style={{ fontFamily: display, fontSize: 66, color: '#fff', opacity: aparecer(f, 0, fps) }}>{t.ruta}</div>
      <div style={{ position: 'relative', width: 1100, marginTop: 70 }}>
        <div style={{ height: 14, borderRadius: 7, background: '#3b2a6e' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, height: 14, borderRadius: 7, width: `${avance * 100}%`, background: `linear-gradient(90deg, ${C.dv}, ${C.oro})` }} />
        <div style={{ position: 'absolute', top: -60, left: `calc(${avance * 100}% - 60px)` }}><Galeon tam={120} color={C.oro} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
          {etapas.map((nombre, i) => {
            const llega = avance >= i / 4 - 0.001;
            return (
              <div key={nombre} style={{ width: 200, textAlign: 'center', transform: `scale(${llega ? 1 : 0.9})`, opacity: llega ? 1 : 0.45 }}>
                <div style={{ fontFamily: display, fontSize: 36, color: llega ? C.oro : '#cdbcff' }}>{nombre}</div>
                <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 18, color: '#a98bff' }}>{t.etapa} {i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 70 }}>
        {MARES.map((m, i) => {
          const a = aparecer(f, 20 + i * 4, fps, { damping: 12, stiffness: 160 });
          return <div key={m.nombre} title={m.nombre} style={{ width: 44, height: 44, borderRadius: 14, background: m.mar, border: `4px solid ${m.ola}`, transform: `scale(${a}) translateY(${Math.sin((f + i * 6) / 8) * 4}px)` }} />;
        })}
      </div>
      <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 22, letterSpacing: '.1em', color: '#a98bff', marginTop: 22 }}>{t.recorrido}</div>
    </AbsoluteFill>
  );
}

function Certificado({ t, etapas }: PropsPartida) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = aparecer(f, 0, fps, { damping: 13, stiffness: 100 });
  const sello = aparecer(f, 34, fps, { damping: 8, stiffness: 180 });
  const codigo = 'DV-7K2P-Q9XM';
  const letras = Math.floor(interpolate(f, [44, 80], [0, codigo.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg,#efe9ff,#ffffff)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 860, height: 500, background: '#fff', borderRadius: 30, border: `4px solid ${C.tinta}`, boxShadow: `0 14px 0 ${C.dv}`, padding: 46, position: 'relative', transform: `translateY(${(1 - entra) * 300}px) rotate(${(1 - entra) * -8}deg)` }}>
        <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 22, letterSpacing: '.16em', color: C.dv7 }}>{t.certMarca}</div>
        <div style={{ fontFamily: display, fontSize: 64, color: C.tinta, marginTop: 14 }}>{t.certTitulo}</div>
        <div style={{ fontFamily: cuerpo, fontWeight: 800, fontSize: 30, color: '#4a4360', marginTop: 10 }}>{t.certTexto[0]}<span style={{ color: C.dv }}>{etapas[1]}</span>{t.certTexto[1]}</div>
        <div style={{ position: 'absolute', left: 46, bottom: 42 }}>
          <div style={{ fontFamily: ui, fontWeight: 800, fontSize: 18, letterSpacing: '.12em', color: '#8a84a0' }}>{t.codigo}</div>
          <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontWeight: 700, fontSize: 40, color: C.tinta }}>{codigo.slice(0, letras)}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>▍</span></div>
        </div>
        <div style={{ position: 'absolute', right: 50, bottom: 40, width: 190, height: 190, borderRadius: '50%', border: `8px solid ${C.oro}`, background: C.dv, display: 'grid', placeItems: 'center', transform: `scale(${sello}) rotate(${(1 - sello) * 90 - 10}deg)`, boxShadow: `0 6px 0 ${C.dv7}` }}>
          <div style={{ textAlign: 'center', color: '#fff', fontFamily: display, fontSize: 30, lineHeight: 1.05 }}>Delhos<br />Academy</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Cierre({ t }: PropsPartida) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = aparecer(f, 0, fps);
  const b = aparecer(f, 14, fps);
  return (
    <AbsoluteFill style={{ background: C.dv, alignItems: 'center', justifyContent: 'center' }}>
      <Mar colores={['#a98bff', '#6a3de8', '#5a30d6']} velocidad={1.4} />
      <div style={{ textAlign: 'center', marginTop: -120 }}>
        <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1.04, color: '#fff', transform: `scale(${a})` }}>{t.cierre1}</div>
        <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1.04, color: C.oro, transform: `scale(${b})` }}>{t.cierre2}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 120, transform: `translateY(${Math.sin(f / 8) * 6}px)` }}><Nexus pose="happy" tam={150} estatico decorativo /></div>
    </AbsoluteFill>
  );
}

export function Partida(props: PropsPartida) {
  return (
    <AbsoluteFill style={{ background: '#fff', fontFamily: cuerpo }}>
      <Sequence durationInFrames={130}><Zarpa {...props} /></Sequence>
      <Sequence from={130} durationInFrames={200}><Pregunta {...props} /></Sequence>
      <Sequence from={330} durationInFrames={120}><Racha {...props} /></Sequence>
      <Sequence from={450} durationInFrames={140}><Ruta {...props} /></Sequence>
      <Sequence from={590} durationInFrames={100}><Certificado {...props} /></Sequence>
      <Sequence from={690} durationInFrames={90}><Cierre {...props} /></Sequence>
    </AbsoluteFill>
  );
}
