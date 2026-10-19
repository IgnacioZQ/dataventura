// Capitán NEXUS, la mascota de Dataventura. Portado del diseño (Nexus.dc.html): cinco poses animadas,
// parpadeo, respiración, mirada que sigue al cursor (mirarX / mirarY) e inclinación.
import { type CSSProperties, useEffect, useRef } from 'react';
import './nexus.css';

export type Pose = 'idle' | 'hello' | 'happy' | 'think' | 'oops';

const hook = (x: number, y: number, r: number) => `translate(${x} ${y}) rotate(${r})`;

const POSES: Record<Pose, {
  armR: string; hook: string; armL: string; hl: [number, number]; eye: 'open' | 'happy'; brow: string; mouth: string; fill: string;
  tongue?: boolean; spark?: boolean; think?: boolean; sweat?: boolean;
}> = {
  idle: { armR: 'M92 124 Q106 122 108 110', hook: hook(108, 110, 0), armL: 'M48 124 Q36 134 38 148', hl: [38, 150], eye: 'open', brow: 'M80 69 Q88 66 96 69', mouth: 'M66 102 Q78 112 90 102', fill: 'none' },
  hello: { armR: 'M92 124 Q106 122 108 110', hook: hook(108, 110, 0), armL: 'M48 124 Q36 134 38 148', hl: [38, 150], eye: 'open', brow: 'M80 68 Q88 64 96 68', mouth: 'M64 101 Q78 116 92 101', fill: 'none' },
  happy: { armR: 'M92 122 Q108 112 112 94', hook: hook(112, 94, 0), armL: 'M48 122 Q32 112 28 94', hl: [28, 92], eye: 'happy', brow: 'M80 64 Q88 60 96 64', mouth: 'M64 100 Q78 126 92 100Z', fill: '#1b1230', tongue: true, spark: true },
  think: { armR: 'M92 126 Q102 128 96 114', hook: hook(90, 114, -30), armL: 'M48 124 Q36 134 38 148', hl: [38, 150], eye: 'open', brow: 'M80 62 Q88 55 96 63', mouth: 'M70 104 Q78 101 86 105', fill: 'none', think: true },
  oops: { armR: 'M92 124 Q104 134 102 150', hook: hook(102, 152, 180), armL: 'M48 124 Q36 134 38 148', hl: [38, 150], eye: 'open', brow: 'M80 64 Q90 68 99 73', mouth: 'M66 109 Q78 98 90 109', fill: 'none', sweat: true }
};

// Las animaciones de NEXUS mueven grupos dentro del SVG, y eso invalida el diseño en cada cuadro. Con varios NEXUS
// en la página, el scroll forzaba recálculos completos (lento en celulares). Un observador compartido pausa los
// que están fuera de pantalla con data-pausa (no con className, que React reescribe al cambiar de pose).
let observador: IntersectionObserver | null = null;
const pausaFuera = () => observador ??= new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) delete (e.target as SVGElement).dataset.pausa; else (e.target as SVGElement).dataset.pausa = ''; }),
  { rootMargin: '120px 0px' }
);

const NOMBRES: Record<Pose, string> = { idle: 'de pie', hello: 'saludando', happy: 'celebrando', think: 'pensando', oops: 'preocupado' };

export function Nexus({ pose = 'idle', tam = 150, saludo = false, cabeza = false, mirarX = 0, mirarY = 0, inclinar = 0, estatico = false, decorativo = false, seguirCursor = false }: {
  pose?: Pose; tam?: number; saludo?: boolean; cabeza?: boolean; mirarX?: number; mirarY?: number; inclinar?: number;
  /** Sin animaciones (por ejemplo dentro del video de Remotion, que anima cuadro a cuadro). */
  estatico?: boolean;
  decorativo?: boolean;
  /**
   * Mirada e inclinación desde las variables CSS --nx-mx / --nx-my (de -1 a 1) que fija un elemento padre: así el
   * cursor mueve los ojos sin re-renderizar React en cada movimiento (portada).
   */
  seguirCursor?: boolean;
}) {
  const s = POSES[pose] ?? POSES.idle;
  const vbH = cabeza ? 124 : 180;
  const cuerpo = cabeza ? 'none' : 'inline';
  const ver = (b: boolean) => (b ? 'inline' : 'none');
  const lx = Math.max(-1, Math.min(1, mirarX)) * 4;
  const ly = Math.max(-1, Math.min(1, mirarY)) * 3.5;
  const t = Math.max(-12, Math.min(12, inclinar));
  const giro = seguirCursor ? 'rotate(calc(var(--nx-mx, 0) * 6deg))' : `rotate(${t}deg)`;
  const mirada = seguirCursor ? 'translate(calc(var(--nx-mx, 0) * 4px), calc(var(--nx-my, 0) * 3.5px))' : `translate(${lx}px, ${ly}px)`;
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (estatico || !el || typeof IntersectionObserver === 'undefined') return;
    const o = pausaFuera();
    o.observe(el);
    return () => o.unobserve(el);
  }, [estatico]);
  const clase = ['nxa', `nx-${pose}`, saludo && pose !== 'happy' ? 'nx-tip' : '', estatico ? 'nx-estatico' : ''].join(' ');

  return (
    <svg
      ref={ref}
      className={clase}
      width={tam}
      height={Math.round((tam * vbH) / 140)}
      viewBox={cabeza ? '0 0 140 124' : '0 0 140 180'}
      role={decorativo ? undefined : 'img'}
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : `Capitán NEXUS ${NOMBRES[pose]}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <ellipse className="nx-shadow" cx="70" cy="172" rx="32" ry="5" fill="#1b1230" opacity=".14" style={{ display: cuerpo }} />
      <g className="nx-act">
        <g className="nx-tilt" style={{ transform: giro }}>
          <g className="nx-breathe">
            <g style={{ display: cuerpo }}>
              <rect x="52" y="140" width="14" height="22" rx="5" fill="#1b1230" /><rect x="74" y="140" width="14" height="22" rx="5" fill="#1b1230" />
              <path d="M46 163 Q46 156 56 156 L66 156 L66 168 L48 168 Q46 168 46 163Z" fill="#3b2a6e" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M94 163 Q94 156 84 156 L74 156 L74 168 L92 168 Q94 168 94 163Z" fill="#3b2a6e" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
            <g style={{ display: cuerpo }}>
              <path className="nx-m" d={s.armL} style={{ d: `path('${s.armL}')` } as CSSProperties} fill="none" stroke="#1b1230" strokeWidth="13" strokeLinecap="round" />
              <path className="nx-m" d={s.armL} style={{ d: `path('${s.armL}')` } as CSSProperties} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              <circle className="nx-m" cx={s.hl[0]} cy={s.hl[1]} r="6" fill="#fff" stroke="#1b1230" strokeWidth="2.5" />
            </g>
            <g style={{ display: cuerpo }}>
              <rect x="46" y="112" width="48" height="42" rx="13" fill="#fff" stroke="#1b1230" strokeWidth="3" />
              <g fill="#7b4dff"><rect x="50" y="119" width="40" height="5" /><rect x="50" y="129" width="40" height="5" /><rect x="50" y="139" width="40" height="5" /></g>
              <rect x="46" y="145" width="48" height="9" fill="#1b1230" />
              <rect x="62" y="143.5" width="16" height="12" rx="3" fill="#ffd166" stroke="#1b1230" strokeWidth="2" /><rect x="67" y="147" width="6" height="5" rx="1" fill="#1b1230" />
              <path d="M57 112 L83 112 L70 128Z" fill="#7b4dff" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
            </g>
            <g style={{ display: cuerpo }}>
              <path className="nx-m" d={s.armR} style={{ d: `path('${s.armR}')` } as CSSProperties} fill="none" stroke="#1b1230" strokeWidth="13" strokeLinecap="round" />
              <path className="nx-m" d={s.armR} style={{ d: `path('${s.armR}')` } as CSSProperties} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              <g transform={s.hook}>
                <g className="nx-wave">
                  <rect x="-7" y="-4" width="14" height="8" rx="2.5" fill="#7b4dff" stroke="#1b1230" strokeWidth="2.5" />
                  <path d="M0 -4 V-14 Q0 -30 13 -25 Q22 -21 16 -12" fill="none" stroke="#1b1230" strokeWidth="8" strokeLinecap="round" />
                  <path d="M0 -4 V-14 Q0 -30 13 -25 Q22 -21 16 -12" fill="none" stroke="#e1dcf0" strokeWidth="3.8" strokeLinecap="round" />
                </g>
              </g>
            </g>
            <rect x="24" y="44" width="92" height="72" rx="34" fill="#fff" stroke="#1b1230" strokeWidth="3.5" />
            <ellipse cx="97" cy="99" rx="6" ry="3.5" fill="#ff9db3" /><ellipse cx="43" cy="99" rx="6" ry="3.5" fill="#ff9db3" />
            <circle cx="23" cy="94" r="4" fill="#ffd166" stroke="#1b1230" strokeWidth="1.8" />
            <path d="M27 64 L50 82" fill="none" stroke="#1b1230" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M56 76 Q86 62 114 68" fill="none" stroke="#1b1230" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="52" cy="84" r="13.5" fill="#1b1230" />
            <path d="M46 78 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8z" fill="#a98bff" />
            <g style={{ display: ver(s.eye === 'open') }}>
              <g className="nx-look" style={{ transform: mirada }}>
                <g className="nx-glance">
                  <g className="nx-blink">
                    <ellipse cx="88" cy="85" rx="12.5" ry="12.5" fill="#1b1230" /><circle cx="92.5" cy="80" r="4.6" fill="#fff" /><circle cx="84.5" cy="91" r="2.2" fill="#fff" />
                  </g>
                </g>
              </g>
            </g>
            <path d="M77 88 Q88 74 99 88" fill="none" stroke="#1b1230" strokeWidth="5" strokeLinecap="round" style={{ display: ver(s.eye === 'happy') }} />
            <path className="nx-m" d={s.brow} style={{ d: `path('${s.brow}')` } as CSSProperties} fill="none" stroke="#1b1230" strokeWidth="3.5" strokeLinecap="round" />
            <path className="nx-m" d={s.mouth} style={{ d: `path('${s.mouth}')` } as CSSProperties} fill={s.fill} stroke="#1b1230" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M70 114 Q78 108 86 114" fill="#ff7a96" style={{ display: ver(!!s.tongue) }} />
            <g className="nx-hat">
              <path d="M14 58 L2 46 L20 48Z" fill="#1b1230" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M126 58 L138 46 L120 48Z" fill="#1b1230" stroke="#1b1230" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M10 60 Q8 34 30 22 Q48 8 70 8 Q92 8 110 22 Q132 34 130 60 Q112 50 70 50 Q28 50 10 60Z" fill="#1b1230" stroke="#1b1230" strokeWidth="3" strokeLinejoin="round" />
              <path d="M15 54 Q70 43 125 54" fill="none" stroke="#7b4dff" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M34 28 Q50 16 70 16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".18" />
              <path d="M52 37 L88 45 M88 37 L52 45" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="52" cy="37" r="3" fill="#fff" /><circle cx="88" cy="45" r="3" fill="#fff" /><circle cx="88" cy="37" r="3" fill="#fff" /><circle cx="52" cy="45" r="3" fill="#fff" />
              <circle cx="70" cy="24" r="11" fill="#fff" /><rect x="63.5" y="30" width="13" height="8" rx="2.5" fill="#fff" />
              <circle cx="65.5" cy="24" r="3" fill="#1b1230" /><circle cx="74.5" cy="24" r="3" fill="#1b1230" /><path d="M70 28 l-1.6 3 h3.2z" fill="#1b1230" />
              <path d="M67 34 v4 M70 34 v4 M73 34 v4" stroke="#1b1230" strokeWidth="1.3" />
            </g>
          </g>
        </g>
      </g>
      <g style={{ display: ver(!!s.sweat) }}><g className="nx-sweat"><path d="M117 62 Q122 70 117 76 Q112 70 117 62Z" fill="#8fc4ff" stroke="#1b1230" strokeWidth="2" strokeLinejoin="round" /></g></g>
      <g className="nx-dots" style={{ display: ver(!!s.think && !cabeza) }}><circle cx="122" cy="40" r="3" fill="#a98bff" /><circle cx="129" cy="30" r="4.5" fill="#a98bff" /><g><circle cx="130" cy="14" r="8" fill="#fff" stroke="#7b4dff" strokeWidth="2.5" /><text x="130" y="19" fontSize="12" fontWeight="800" textAnchor="middle" fill="#7b4dff" fontFamily="Outfit,sans-serif">?</text></g></g>
      <g className="nx-spark" style={{ display: ver(!!s.spark && !cabeza) }} fill="#ffd166"><path d="M10 20 l2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2z" /><path d="M128 18 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8z" /><path d="M134 70 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z" /></g>
    </svg>
  );
}
