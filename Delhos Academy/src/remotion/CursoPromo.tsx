// «CursoPromo»: el video de presentación de cada curso, siguiendo el guion «Video de portada» del diseño
// (Claude Design, artboard VideoHero): 20 s a 30 fps en bucle, en cuatro escenas, armado con los datos del curso.
//   0–4 s   el titular aparece palabra por palabra
//   4–9 s   la plataforma por dentro: la tarjeta de clase sube y la barra de avance se llena
//   9–15 s  el temario, módulo por módulo, y la línea «En vivo · Grabado · Certificado»
//   15–20 s cierre en azul marino con la fecha de inicio y el llamado; vuelve al fondo claro para el bucle
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type PropsCursoPromo = {
  titulo: string;
  nivel?: string;
  inicio?: string;
  modulos?: string[];
  logo?: string;
};

export const PROMO = { fps: 30, ancho: 1280, alto: 720, duracion: 600 };

const C = {
  bg: '#F7F8FA', ink: '#16202C', text2: '#4A5563', muted: '#6B7685', navy: '#1E3A5F', blue: '#2E6DB4',
  line: '#E3E7EC', soft: '#EEF1F4', azulSuave: '#EAF2FB', lavado: '#DCE9F7', green: '#1F6B43', greenBg: '#E8F5EE'
};
const SANS = '"Figtree Variable", Figtree, system-ui, sans-serif';
const SERIF = '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif';
const ease = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export function CursoPromo({ titulo, nivel, inicio, modulos = [], logo }: PropsCursoPromo) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const I = (a: number, b: number, from: number, to: number) => interpolate(frame, [a, b], [from, to], { ...clamp, easing: ease });
  const S = (inicioS: number, damping = 200) => spring({ frame: frame - inicioS, fps, config: { damping, stiffness: 100, mass: 1 } });
  const tramo = (a: number, b: number, entra = 12, sale = 12) => Math.min(I(a, a + entra, 0, 1), I(b - sale, b, 1, 0));

  const palabras = ['Aprende', ...titulo.split(/\s+/)];
  const blob = Math.sin((frame / PROMO.duracion) * Math.PI * 2);
  const mods = (modulos.length ? modulos : ['Fundamentos', 'Práctica guiada', 'Proyecto final']).slice(0, 3);

  // Escena 4 (marino) y vuelta al fondo claro en los últimos 15 cuadros
  const marino = Math.min(I(450, 466, 0, 1), I(585, 600, 1, 0));

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS, color: C.ink, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: C.lavado, filter: 'blur(90px)', right: -120 + blob * 40, top: -160 + blob * 30 }} />
      <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: C.greenBg, filter: 'blur(90px)', left: -100 - blob * 30, bottom: -140 }} />

      {/* Escena 1: titular palabra por palabra */}
      <AbsoluteFill style={{ opacity: tramo(0, 124, 1, 14), padding: '0 120px', justifyContent: 'center', gap: 28 }}>
        {logo && <Img src={logo} style={{ width: 54, height: 54, borderRadius: 14, opacity: I(0, 12, 0, 1) }} />}
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: titulo.length > 34 ? 64 : 76, lineHeight: 1.08, letterSpacing: '-0.015em', maxWidth: 1000 }}>
          {palabras.map((p, i) => {
            const s = S(6 + i * 5);
            return (
              <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: s, filter: `blur(${(1 - s) * 8}px)`, transform: `translateY(${(1 - s) * 18}px)`, color: i === 0 ? C.blue : C.ink }}>{p}</span>
            );
          })}
        </div>
        <div style={{ width: I(40, 90, 0, 420), height: 8, borderRadius: 4, background: C.line }} />
        {nivel && <span style={{ fontSize: 26, color: C.muted, fontWeight: 600, opacity: I(60, 80, 0, 1) }}>{nivel} · En vivo · 100% online</span>}
      </AbsoluteFill>

      {/* Escena 2: la plataforma por dentro */}
      <AbsoluteFill style={{ opacity: tramo(120, 274), justifyContent: 'center', alignItems: 'center', background: C.azulSuave }}>
        <div style={{ width: 640, background: '#fff', borderRadius: 24, padding: 36, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 30px 70px rgba(30,58,95,.16)', transform: `translateY(${(1 - S(124, 18)) * 120}px)` }}>
          <span style={{ fontSize: 20, color: C.muted, fontWeight: 600 }}>Tu próxima clase</span>
          <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 38 }}>Clase 1 · {mods[0]}</span>
          <div style={{ height: 12, background: C.soft, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${I(150, 200, 0, 33)}%`, background: C.blue, borderRadius: 6 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ height: 52, padding: '0 26px', borderRadius: 12, background: C.navy, color: '#fff', fontWeight: 600, fontSize: 22, display: 'flex', alignItems: 'center' }}>Entrar a la clase</span>
            <span style={{ fontSize: 20, color: C.muted }}>{titulo}</span>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 150, top: 150, display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 18, padding: '16px 22px', boxShadow: '0 18px 40px rgba(30,58,95,.14)', opacity: I(205, 220, 0, 1), transform: `translateX(${(1 - S(205, 16)) * 60}px)` }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" fill="none" stroke={C.green} strokeWidth="2.6" /></svg>
          </span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>Grabación disponible</span>
        </div>
      </AbsoluteFill>

      {/* Escena 3: el temario, uno tras otro */}
      <AbsoluteFill style={{ opacity: tramo(270, 454), padding: '0 110px', justifyContent: 'center', gap: 40 }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.blue, opacity: I(276, 290, 0, 1) }}>Qué vas a ver</span>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mods.length}, minmax(0, 1fr))`, gap: 24 }}>
          {mods.map((m, i) => {
            const s = S(284 + i * 6, 16);
            return (
              <div key={i} style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, opacity: Math.min(1, s), transform: `translateY(${(1 - s) * 50 - (i === 1 ? 10 : 0)}px)` }}>
                <span style={{ fontFamily: SERIF, fontSize: 40, color: C.blue }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, lineHeight: 1.15 }}>{m}</span>
                <div style={{ height: 8, width: `${I(300 + i * 8, 340 + i * 8, 0, 80)}%`, background: C.soft, borderRadius: 4 }} />
              </div>
            );
          })}
        </div>
        <span style={{ fontSize: 26, fontWeight: 600, color: C.text2, opacity: I(340, 356, 0, 1) }}>En vivo · Grabado · Certificado</span>
      </AbsoluteFill>

      {/* Escena 4: cierre y llamado */}
      <AbsoluteFill style={{ background: C.navy, opacity: marino, justifyContent: 'center', alignItems: 'center', gap: 34, textAlign: 'center', padding: '0 120px' }}>
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: C.blue, opacity: 0.45, filter: 'blur(100px)', right: -80, top: -120 }} />
        <span style={{ position: 'relative', fontFamily: SERIF, fontWeight: 600, fontSize: 58, lineHeight: 1.12, color: '#fff', transform: `translateY(${(1 - S(462, 18)) * 30}px)` }}>
          {inicio ? <>La próxima cohorte comienza {/^\d/.test(inicio.trim()) ? 'el' : 'en'} {inicio}</> : <>Postulaciones abiertas</>}
        </span>
        <span style={{ position: 'relative', height: 64, padding: '0 34px', borderRadius: 14, background: '#fff', color: C.navy, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', transform: `scale(${0.9 + 0.1 * S(476, 12)})` }}>Postula en Delhos Academy</span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
