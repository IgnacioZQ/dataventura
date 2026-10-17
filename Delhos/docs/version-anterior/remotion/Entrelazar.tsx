// «Entrelazar»: video de marca de Delhos con Remotion, dibujado en vivo con @remotion/player.
// Sigue la guía de video del sistema de diseño: fondo oscuro, las bandas se entrelazan y nace el símbolo,
// los textos entran por palabra y el cierre es la firma con la frase de marca.
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Icono } from '@/components/Piezas';
import { recurso } from '@/config';

export const VIDEO = { fps: 30, ancho: 1280, alto: 720, duracion: 345 };

export const CAPITULOS = [
  { id: 'simbolo', nombre: 'El símbolo', desde: 0 },
  { id: 'pilares', nombre: 'Tres mundos', desde: 90 },
  { id: 'plataformas', nombre: 'Dos plataformas', desde: 180 },
  { id: 'firma', nombre: 'Delhos', desde: 270 }
] as const;

const NOCHE = '#081D35';
const display = '"Bricolage Grotesque Variable", sans-serif';
const sans = '"Plus Jakarta Sans Variable", sans-serif';
const mono = '"JetBrains Mono", monospace';

const resorte = (f: number, inicio: number, fps: number, config = { damping: 16, stiffness: 120 }) => spring({ frame: f - inicio, fps, config });

function Trama({ opacidad = 0.35 }: { opacidad?: number }) {
  return <AbsoluteFill style={{ backgroundImage: `url(${recurso('marca/trama-oscura.svg')})`, backgroundSize: 226, opacity: opacidad }} />;
}

function Fondo({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill style={{ background: `radial-gradient(900px 500px at 85% -10%, rgba(30,97,148,.5), transparent 60%), ${NOCHE}` }}>
      <Trama />
      {children}
    </AbsoluteFill>
  );
}

/** Tejido de bandas que se cruzan por encima y por debajo, como el símbolo. */
function Tejido({ f, fps }: { f: number; fps: number }) {
  const colores = ['#1E6194', '#4A90C2', '#93C5FD'];
  const L = 380, A = 46, paso = 110;
  const horiz = [0, 1, 2].map(i => resorte(f, i * 5, fps, { damping: 18, stiffness: 90 }));
  const vert = [0, 1, 2].map(i => resorte(f, 14 + i * 5, fps, { damping: 18, stiffness: 90 }));
  return (
    <svg width={L} height={L} viewBox={`0 0 ${L} ${L}`} style={{ overflow: 'visible' }}>
      {[0, 1, 2].map(i => <rect key={`h${i}`} x={(L - L * horiz[i]) / 2} y={60 + i * paso} width={L * horiz[i]} height={A} rx={A / 2} fill={colores[i]} />)}
      {[0, 1, 2].map(i => <rect key={`v${i}`} x={60 + i * paso} y={(L - L * vert[i]) / 2} width={A} height={L * vert[i]} rx={A / 2} fill={colores[(i + 1) % 3]} />)}
      {/* cruces alternos: la banda horizontal vuelve a pasar por encima */}
      {[0, 1, 2].map(r => [0, 1, 2].map(c => ((r + c) % 2 === 0 && vert[c] > 0.9 ? <rect key={`x${r}${c}`} x={60 + c * paso - 4} y={60 + r * paso} width={A + 8} height={A} rx={8} fill={colores[r]} opacity={Math.min(1, (vert[c] - 0.9) * 10)} /> : null)))}
    </svg>
  );
}

function Simbolo() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tejido = interpolate(f, [40, 62], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const escalaTejido = interpolate(f, [40, 62], [1, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const simbolo = resorte(f, 48, fps, { damping: 13, stiffness: 110 });
  const nombre = resorte(f, 62, fps);
  return (
    <Fondo>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', opacity: tejido, transform: `scale(${escalaTejido}) rotate(${(1 - tejido) * 45}deg)` }}><Tejido f={f} fps={fps} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
          <img src={recurso('marca/delhos-simbolo-blanco.svg')} alt="" style={{ width: 210, height: 210, transform: `scale(${simbolo}) rotate(${(1 - simbolo) * -90}deg)`, opacity: simbolo }} />
          <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '-0.03em', fontSize: 136, lineHeight: 1.1, color: '#fff', whiteSpace: 'nowrap', opacity: Math.min(1, nombre * 1.4), clipPath: `inset(-20% ${Math.max(0, (1 - nombre) * 100)}% -20% 0)` }}>Delhos</span>
        </div>
      </AbsoluteFill>
    </Fondo>
  );
}

const PILARES = [
  { nombre: 'Educación', icono: 'educacion' as const, texto: 'Aprender haciendo', color: '#1E6194' },
  { nombre: 'Tecnología', icono: 'tecnologia' as const, texto: 'Plataformas propias', color: '#4A90C2' },
  { nombre: 'Innovación', icono: 'innovacion' as const, texto: 'En vivo, jugando y con IA', color: '#93C5FD' }
];

function Pilares() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linea = interpolate(f, [52, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <Fondo>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 54 }}>
        <div style={{ fontFamily: mono, fontWeight: 500, fontSize: 22, letterSpacing: '.14em', color: '#93C5FD', opacity: resorte(f, 0, fps) }}>TRES MUNDOS QUE AVANZABAN POR SEPARADO</div>
        <div style={{ display: 'flex', gap: 34 }}>
          {PILARES.map((p, i) => {
            const a = resorte(f, 8 + i * 10, fps, { damping: 14, stiffness: 130 });
            return (
              <div key={p.nombre} style={{ width: 330, padding: '30px 30px', borderRadius: 26, background: '#0F2537', border: '2px solid #1E3D59', transform: `translateY(${(1 - a) * 60}px)`, opacity: a, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <span style={{ width: 70, height: 70, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#16324D,#1E6194)', color: '#fff' }}><Icono nombre={p.icono} tam={34} /></span>
                <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '-0.02em', fontSize: 50, color: '#fff' }}>{p.nombre}</span>
                <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 24, color: '#9FB4C8' }}>{p.texto}</span>
                <span style={{ height: 6, borderRadius: 3, background: p.color, width: `${linea * 100}%` }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Fondo>
  );
}

function Plataformas() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabras = 'Unidas para aprender distinto.'.split(' ');
  const tarjeta = (i: number) => resorte(f, 26 + i * 10, fps, { damping: 15, stiffness: 110 });
  return (
    <Fondo>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 92, gap: 54 }}>
        <div style={{ display: 'flex', gap: 22, fontFamily: display, fontWeight: 700, letterSpacing: '-0.03em', fontSize: 78, color: '#fff' }}>
          {palabras.map((p, i) => {
            const a = resorte(f, i * 4, fps);
            return <span key={i} style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)`, color: i >= 2 ? '#93C5FD' : '#fff' }}>{p}</span>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 40 }}>
          {[
            { nombre: 'Delhos Academy', tipo: 'SERVICIO', texto: 'Cursos en vivo, 100% online', logo: 'assets/academy/academy-logo-192.png', fondo: 'linear-gradient(135deg,#1E3D59,#2B7CB3)' },
            { nombre: 'Dataventura', tipo: 'PRODUCTO', texto: 'Piensa con datos, 5 min al día', logo: 'assets/dataventura/dataventura-icon.svg', fondo: 'linear-gradient(135deg,#5a30d6,#7b4dff)' }
          ].map((p, i) => {
            const a = tarjeta(i);
            return (
              <div key={p.nombre} style={{ width: 470, borderRadius: 30, padding: 34, background: p.fondo, transform: `translateX(${(1 - a) * (i ? 140 : -140)}px)`, opacity: a, display: 'flex', alignItems: 'center', gap: 26, boxShadow: '0 30px 60px -24px rgba(0,0,0,.6)' }}>
                <img src={recurso(p.logo)} alt="" style={{ width: 96, height: 96, borderRadius: 22 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: mono, fontSize: 17, letterSpacing: '.14em', color: 'rgba(255,255,255,.75)' }}>{p.tipo}</span>
                  <span style={{ fontFamily: display, fontWeight: 700, fontSize: 40, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.05 }}>{p.nombre}</span>
                  <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, color: 'rgba(255,255,255,.88)' }}>{p.texto}</span>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Fondo>
  );
}

function FirmaFinal() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = resorte(f, 0, fps);
  const b = resorte(f, 14, fps);
  return (
    <Fondo>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${0.85 + a * 0.15})`, opacity: a }}>
          <img src={recurso('marca/delhos-simbolo-blanco.svg')} alt="" style={{ width: 150, height: 150 }} />
          <span style={{ fontFamily: display, fontWeight: 700, letterSpacing: '-0.03em', fontSize: 110, color: '#fff' }}>Delhos</span>
        </div>
        <div style={{ fontFamily: display, fontWeight: 650, letterSpacing: '-0.02em', fontSize: 40, color: '#DCE7F2', opacity: b, transform: `translateY(${(1 - b) * 16}px)` }}>
          Un ecosistema para aprender a programar <span style={{ color: '#93C5FD' }}>y a pensar con datos.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: mono, fontSize: 20, letterSpacing: '.14em', color: '#9FB4C8', opacity: b }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: '#FBBF24' }} /> EDUCACIÓN · TECNOLOGÍA · INNOVACIÓN
        </div>
      </AbsoluteFill>
    </Fondo>
  );
}

export function Entrelazar() {
  return (
    <AbsoluteFill style={{ background: NOCHE }}>
      <Sequence durationInFrames={90}><Simbolo /></Sequence>
      <Sequence from={90} durationInFrames={90}><Pilares /></Sequence>
      <Sequence from={180} durationInFrames={90}><Plataformas /></Sequence>
      <Sequence from={270} durationInFrames={75}><FirmaFinal /></Sequence>
    </AbsoluteFill>
  );
}
