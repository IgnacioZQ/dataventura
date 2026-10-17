import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";

const { fontFamily: SANS } = loadFigtree();
const { fontFamily: SERIF } = loadSerif();

// Tokens del sistema visual de Delhos Academy
const C = {
  bg: "#EAF2FB",
  ink: "#16202C",
  text2: "#4A5563",
  muted: "#6B7685",
  navy: "#1E3A5F",
  navyHover: "#2A4C77",
  blue: "#2E6DB4",
  line: "#E3E7EC",
  line2: "#CBD3DC",
  soft: "#F1F3F6",
  green: "#1F6B43",
  greenBg: "#E8F5EE",
};

const ease = Easing.out(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Escenario 4:3 centrado; u = 1 % de su ancho (equivale a cqw en la web)
  const stageW = Math.min(width, (height * 4) / 3);
  const stageH = (stageW * 3) / 4;
  const u = stageW / 100;

  const I = (a: number, b: number, from: number, to: number) =>
    interpolate(frame, [a, b], [from, to], { ...clamp, easing: ease });
  const S = (start: number, damping = 12) =>
    spring({ frame: frame - start, fps, config: { damping, stiffness: 100, mass: 1 } });
  const seg = (a: number, b: number, fi: number, fo: number) =>
    Math.min(I(a, a + fi, 0, 1), I(b - fo, b, 1, 0));

  const ph = (frame / 360) * Math.PI * 2;
  const windowOpacity = Math.min(I(0, 18, 0, 1), I(342, 358, 1, 0));
  const click = frame >= 72 && frame < 80;

  const captions = [
    { pre: "Clases ", key: "en vivo", a: 4, b: 96 },
    { pre: "Práctica con ", key: "datos reales", a: 102, b: 216 },
    { pre: "Retroalimentación de ", key: "tu instructor", a: 222, b: 306 },
    { pre: "Al final, ", key: "tu certificado", a: 312, b: 354 },
  ];

  const code = [
    { s: 108, text: "import pandas as pd", color: "#9CC3EA" },
    { s: 122, text: 'df = pd.read_csv("ventas.csv")', color: "#C7D2DE" },
    { s: 142, text: "modelo = LinearRegression()", color: "#C7D2DE" },
    { s: 160, text: "modelo.fit(X, y)", color: "#C7D2DE" },
  ];

  const points: [number, number][] = [
    [12, 64], [20, 60], [27, 55], [34, 52], [42, 44], [50, 41], [60, 33], [70, 28], [82, 20],
  ];

  const tiles = [
    { ini: "IN", name: "Instructor", x: 55, y: 10, w: 39, h: 38, bg: C.navy, fg: C.navy, label: "#FFFFFF", d: 16 },
    { ini: "CR", name: "Camila", x: 55, y: 52, w: 19, h: 30, bg: "#DCE9F7", fg: C.navy, label: C.navy, d: 22 },
    { ini: "MP", name: "Matías", x: 75, y: 52, w: 19, h: 30, bg: "#E3F1E9", fg: C.green, label: C.green, d: 26 },
  ];

  const checks = [
    { text: "Clase 4 · Regresión lineal", at: 238, y: 45 },
    { text: "Tarea: limpieza de datos", at: 262, y: 58 },
    { text: "Clase 5 · Regularización", at: Infinity, y: 71 },
  ];

  const abs = (l: number, t: number, w?: number, h?: number): React.CSSProperties => ({
    position: "absolute",
    left: `${l}%`,
    top: `${t}%`,
    ...(w !== undefined ? { width: `${w}%` } : {}),
    ...(h !== undefined ? { height: `${h}%` } : {}),
    boxSizing: "border-box",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: SANS, color: C.ink, overflow: "hidden" }}>
      {/* Manchas difuminadas en bucle */}
      <div style={{ position: "absolute", width: 60 * u, height: 60 * u, borderRadius: "50%", background: "#CFE1F5", filter: `blur(${9 * u}px)`, left: `${48 + Math.cos(ph) * 6}%`, top: `${-18 + Math.sin(ph) * 5}%` }} />
      <div style={{ position: "absolute", width: 46 * u, height: 46 * u, borderRadius: "50%", background: "#E3F1E9", filter: `blur(${9 * u}px)`, left: `${-14 + Math.sin(ph) * 5}%`, top: `${52 + Math.cos(ph) * 4}%` }} />

      <div style={{ position: "absolute", width: stageW, height: stageH, left: (width - stageW) / 2, top: (height - stageH) / 2 }}>
        {/* Subtítulos */}
        {captions.map((c) => {
          const op = seg(c.a, c.b, 10, 8);
          return (
            <div key={c.key} style={{ position: "absolute", left: 0, right: 0, top: "5.5%", display: "flex", justifyContent: "center", opacity: op, translate: `0 ${(1 - op) * 1.5 * u}px` }}>
              <span style={{ background: "#FFFFFF", borderRadius: 999, padding: `${1.1 * u}px ${2.6 * u}px`, fontSize: 2.3 * u, fontWeight: 500, color: C.text2, boxShadow: `0 ${0.6 * u}px ${2 * u}px rgba(30,58,95,0.08)` }}>
                {c.pre}
                <strong style={{ color: C.navy, fontWeight: 700 }}>{c.key}</strong>
              </span>
            </div>
          );
        })}

        {/* Ventana */}
        <div style={{ position: "absolute", left: "7%", right: "7%", top: "17%", bottom: "7%", background: "#FFFFFF", borderRadius: 2.2 * u, boxShadow: `0 ${3 * u}px ${7 * u}px rgba(30,58,95,0.14)`, overflow: "hidden", opacity: windowOpacity, translate: `0 ${(1 - S(0, 14)) * 4 * u}px` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "9%", borderBottom: `1px solid #EEF1F4`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${3.2 * u}px`, fontSize: 1.8 * u, color: C.muted, boxSizing: "border-box" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 1.2 * u }}>
              <Img src={staticFile("academy-logo.png")} style={{ width: 2.8 * u, height: 2.8 * u, borderRadius: 0.7 * u }} />
              <strong style={{ color: C.ink, fontWeight: 600 }}>Aula Delhos Academy</strong>
            </span>
            <span>{frame < 220 ? `19:0${Math.min(9, Math.floor(frame / 40))}` : "Semana 4"}</span>
          </div>

          {/* Escena 1: clase en vivo */}
          <div style={{ position: "absolute", inset: "9% 0 0 0", opacity: I(90, 100, 1, 0) }}>
            <span style={{ ...abs(6, 10), display: "inline-flex", alignItems: "center", gap: 0.9 * u, background: C.greenBg, color: C.green, fontWeight: 600, fontSize: 1.8 * u, padding: `${0.7 * u}px ${1.6 * u}px`, borderRadius: 999, opacity: Math.min(1, S(8, 14)), scale: String(0.9 + 0.1 * S(8, 14)) }}>
              <span style={{ width: u, height: u, borderRadius: "50%", background: "#2F8F5B", boxShadow: `0 0 0 ${((frame % 45) / 45) * 1.4 * u}px rgba(47,143,91,${0.45 * (1 - (frame % 45) / 45)})` }} />
              En vivo
            </span>
            <div style={{ ...abs(6, 22, 46), opacity: I(12, 26, 0, 1), translate: `0 ${(1 - I(12, 26, 0, 1)) * 2 * u}px` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 3.5 * u, lineHeight: 1.12 }}>Clase 4 · Regresión lineal</div>
              <div style={{ marginTop: 1.4 * u, fontSize: 2 * u, color: C.text2 }}>Machine learning aplicado · 19:00</div>
            </div>
            <div style={{ ...abs(6, 54), display: "flex", alignItems: "center", gap: u, fontSize: 1.9 * u, color: C.text2, opacity: I(34, 46, 0, 1) }}>
              <span style={{ width: u, height: u, borderRadius: "50%", background: C.blue }} />
              {frame < 30 ? "1 compañero conectado" : "2 compañeros conectados"}
            </div>
            <div style={{ ...abs(6, 66, 34, 14), borderRadius: 1.4 * u, background: frame >= 74 ? C.navyHover : C.navy, color: "#FFFFFF", fontWeight: 600, fontSize: 2.1 * u, display: "flex", alignItems: "center", justifyContent: "center", opacity: I(28, 40, 0, 1), scale: click ? "0.95" : "1" }}>
              {frame >= 76 ? "Conectando…" : "Entrar a la clase"}
            </div>
            {tiles.map((t) => {
              const s = S(t.d, 13);
              return (
                <div key={t.ini} style={{ ...abs(t.x, t.y, t.w, t.h), borderRadius: 1.4 * u, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, s), scale: String(0.85 + 0.15 * s) }}>
                  <span style={{ width: 7 * u, height: 7 * u, borderRadius: "50%", background: "#FFFFFF", color: t.fg, fontWeight: 700, fontSize: 2.3 * u, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.ini}</span>
                  <span style={{ position: "absolute", left: 1.2 * u, bottom: u, fontSize: 1.5 * u, fontWeight: 600, color: t.label }}>{t.name}</span>
                </div>
              );
            })}
            {/* Onda del clic y cursor */}
            <div style={{ position: "absolute", left: "23%", top: "73%", width: 8 * u, height: 8 * u, margin: `${-4 * u}px 0 0 ${-4 * u}px`, borderRadius: "50%", border: `${0.4 * u}px solid ${C.blue}`, opacity: frame >= 72 && frame < 88 ? 0.6 * (1 - (frame - 72) / 16) : 0, scale: String(frame >= 72 ? 0.4 + ((frame - 72) / 16) * 1.2 : 0.4) }} />
            <svg viewBox="0 0 24 24" style={{ position: "absolute", width: 3.4 * u, height: 3.4 * u, left: `${I(40, 70, 88, 23)}%`, top: `${I(40, 70, 96, 73)}%`, opacity: Math.min(I(38, 46, 0, 1), I(84, 92, 1, 0)), scale: click ? "0.85" : "1", transformOrigin: "0 0" }}>
              <path d="M4 2l15 9-6.5 1.6L10 19z" fill={C.ink} stroke="#FFFFFF" strokeWidth={1.5} strokeLinejoin="round" />
            </svg>
          </div>

          {/* Escena 2: práctica con datos */}
          <div style={{ position: "absolute", inset: "9% 0 0 0", opacity: seg(100, 220, 10, 10) }}>
            <div style={{ ...abs(5, 9, 46, 80), borderRadius: 1.6 * u, background: C.ink, padding: 3 * u, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 1.85 * u, lineHeight: 2.1, translate: `${(1 - I(100, 118, 0, 1)) * -3 * u}px 0` }}>
              {code.map((l) => {
                const n = Math.max(0, Math.min(l.text.length, Math.floor((frame - l.s) * 1.5)));
                const caret = frame >= l.s && n < l.text.length && Math.floor(frame / 6) % 2 === 0 ? "▍" : "";
                return <div key={l.text} style={{ whiteSpace: "pre", color: l.color }}>{l.text.slice(0, n) + caret || " "}</div>;
              })}
              <div style={{ marginTop: 1.2 * u, color: "#7FD3A6", opacity: I(180, 188, 0, 1) }}>✓ modelo entrenado</div>
            </div>
            <div style={{ ...abs(55, 9, 40, 80), borderRadius: 1.6 * u, border: `1px solid ${C.line}`, background: "#FFFFFF", opacity: I(128, 142, 0, 1), translate: `${(1 - I(128, 142, 0, 1)) * 3 * u}px 0` }}>
              <div style={{ position: "absolute", left: "7%", top: "6%", fontSize: 1.7 * u, fontWeight: 600, color: C.text2 }}>Ventas vs. inversión</div>
              <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ position: "absolute", left: "6%", top: "18%", width: "88%", height: "74%", overflow: "visible" }}>
                <line x1={4} y1={76} x2={98} y2={76} stroke={C.line2} strokeWidth={0.6} />
                <line x1={4} y1={4} x2={4} y2={76} stroke={C.line2} strokeWidth={0.6} />
                {points.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={Math.min(1.2, Math.max(0, S(140 + i * 4))) * 1.6} fill={C.blue} opacity={0.85} />
                ))}
                <path d="M8 68 L94 14" pathLength={100} fill="none" stroke={C.navy} strokeWidth={1.4} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={I(180, 206, 100, 0)} />
              </svg>
            </div>
          </div>

          {/* Escena 3: retroalimentación del instructor */}
          <div style={{ position: "absolute", inset: "9% 0 0 0", opacity: seg(220, 310, 10, 10) }}>
            <div style={{ ...abs(6, 9), fontFamily: SERIF, fontWeight: 600, fontSize: 3 * u }}>Machine learning aplicado</div>
            <div style={{ ...abs(6, 24, 44), display: "flex", justifyContent: "space-between", fontSize: 1.8 * u }}>
              <span style={{ fontWeight: 600 }}>Avance del curso</span>
              <span style={{ color: C.muted }}>{frame < 250 ? "4 de 12 clases" : "5 de 12 clases"}</span>
            </div>
            <div style={{ ...abs(6, 31, 44), height: 1.4 * u, borderRadius: 999, background: "#EEF1F4", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${I(230, 262, 33, 42)}%`, background: C.blue, borderRadius: 999 }} />
            </div>
            {checks.map((c) => {
              const v = Math.max(0, Math.min(1, (frame - c.at) / 6));
              return (
                <div key={c.text} style={{ ...abs(6, c.y), display: "flex", alignItems: "center", gap: 1.6 * u, fontSize: 2 * u, color: Number.isFinite(c.at) ? C.ink : C.muted }}>
                  <span style={{ width: 3.2 * u, height: 3.2 * u, borderRadius: "50%", border: `${0.3 * u}px solid ${v > 0 ? C.blue : C.line2}`, background: v > 0.5 ? C.blue : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                    <svg viewBox="0 0 24 24" style={{ width: 2 * u, height: 2 * u, opacity: v }}><path d="M5 12l4 4 10-10" fill="none" stroke="#FFFFFF" strokeWidth={3.2} /></svg>
                  </span>
                  {c.text}
                </div>
              );
            })}
            <div style={{ ...abs(55, 12, 39), background: "#FFFFFF", border: `1px solid ${C.line}`, borderRadius: 1.6 * u, padding: 2 * u, boxShadow: `0 ${2 * u}px ${4.5 * u}px rgba(30,58,95,0.12)`, display: "flex", gap: 1.6 * u, alignItems: "center", opacity: I(268, 282, 0, 1), translate: `${(1 - S(268, 14)) * 6 * u}px 0` }}>
              <span style={{ width: 4.6 * u, height: 4.6 * u, borderRadius: 1.2 * u, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg viewBox="0 0 24 24" style={{ width: 2.6 * u, height: 2.6 * u }}><path d="M5 12l4 4 10-10" fill="none" stroke={C.green} strokeWidth={2.4} /></svg>
              </span>
              <span style={{ fontSize: 1.8 * u, lineHeight: 1.35 }}><strong>Tarea revisada</strong><br /><span style={{ color: C.muted }}>Limpieza de datos</span></span>
            </div>
            <div style={{ ...abs(55, 44, 39), display: "flex", gap: 1.4 * u, opacity: I(282, 294, 0, 1), translate: `0 ${(1 - I(282, 294, 0, 1)) * 2 * u}px` }}>
              <span style={{ width: 4.4 * u, height: 4.4 * u, flex: "none", borderRadius: "50%", background: C.navy, color: "#FFFFFF", fontWeight: 700, fontSize: 1.6 * u, display: "flex", alignItems: "center", justifyContent: "center" }}>IN</span>
              <span style={{ background: C.soft, borderRadius: `${0.4 * u}px ${1.6 * u}px ${1.6 * u}px ${1.6 * u}px`, padding: `${1.6 * u}px ${2 * u}px`, fontSize: 1.75 * u, lineHeight: 1.45, color: "#2C3846" }}>
                Buen trabajo. Revisa los valores nulos de la columna fecha antes de modelar.
              </span>
            </div>
          </div>

          {/* Escena 4: certificado */}
          <div style={{ position: "absolute", inset: "9% 0 0 0", opacity: I(310, 322, 0, 1) }}>
            <div style={{ ...abs(16, 9, 68, 80), border: `1px solid ${C.line2}`, borderRadius: u, padding: u, scale: String(0.94 + 0.06 * Math.min(1, S(310, 14))) }}>
              <div style={{ width: "100%", height: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 0.6 * u, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.6 * u, textAlign: "center", position: "relative" }}>
                <span style={{ fontSize: 1.6 * u, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, fontWeight: 600 }}>Certificado de aprobación</span>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 4.6 * u, opacity: I(318, 330, 0, 1) }}>Camila Rojas</span>
                <span style={{ fontSize: 2 * u, color: C.text2 }}>Machine learning aplicado · Delhos Academy</span>
                <svg viewBox="0 0 40 40" style={{ position: "absolute", right: "6%", bottom: "8%", width: 9 * u, height: 9 * u }}>
                  <circle cx={20} cy={20} r={16} pathLength={100} fill="none" stroke={C.blue} strokeWidth={2} strokeDasharray={100} strokeDashoffset={I(322, 340, 100, 0)} transform="rotate(-90 20 20)" />
                  <path d="M13 20l5 5 9-10" pathLength={100} fill="none" stroke={C.navy} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={I(334, 344, 100, 0)} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
