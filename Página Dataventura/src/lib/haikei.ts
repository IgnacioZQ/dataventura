// Generadores de fondos SVG al estilo Haikei (olas en capas, manchas orgánicas, picos y puntos dispersos).
// Como en Haikei, cada fondo sale de una semilla: la misma semilla da siempre la misma forma, así el dibujo
// no cambia entre visitas y se puede animar pasando de una semilla a otra.

/** Generador pseudoaleatorio determinista (mulberry32). */
export function azar(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Curva suave (Catmull-Rom → Bézier) que pasa por los puntos dados. */
function curva(puntos: [number, number][]) {
  let d = `M${r1(puntos[0][0])} ${r1(puntos[0][1])}`;
  for (let i = 0; i < puntos.length - 1; i++) {
    const p0 = puntos[i - 1] ?? puntos[i];
    const p1 = puntos[i];
    const p2 = puntos[i + 1];
    const p3 = puntos[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

/**
 * «Layered waves»: capas de olas apiladas de atrás hacia adelante, cerradas por abajo.
 * Las olas son periódicas (el borde izquierdo y el derecho calzan), así que se pueden desplazar en bucle.
 */
export function olasEnCapas({ ancho = 1440, alto = 320, capas = 4, picos = 6, amplitud = 26, semilla = 7, desde = 0.25, hasta = 0.8 } = {}) {
  const rnd = azar(semilla);
  return Array.from({ length: capas }, (_, c) => {
    const base = alto * (desde + ((hasta - desde) * c) / Math.max(1, capas - 1));
    const n = picos + 1;
    const alturas = Array.from({ length: n }, () => (rnd() - 0.5) * 2 * amplitud);
    alturas[n - 1] = alturas[0];
    const puntos: [number, number][] = alturas.map((h, i) => [(ancho * i) / picos, base + h]);
    return `${curva(puntos)} L${ancho} ${alto} L0 ${alto} Z`;
  });
}

/** Una ola sola, para separar secciones («wave» de Haikei). */
export function ola({ ancho = 1440, alto = 120, picos = 5, amplitud = 22, semilla = 3, nivel = 0.5 } = {}) {
  return olasEnCapas({ ancho, alto, capas: 1, picos, amplitud, semilla, desde: nivel, hasta: nivel })[0];
}

/** «Blob»: mancha orgánica cerrada alrededor de un centro. */
export function mancha({ cx = 200, cy = 200, radio = 160, puntas = 7, irregularidad = 0.28, semilla = 11 } = {}) {
  const rnd = azar(semilla);
  const pts: [number, number][] = Array.from({ length: puntas }, (_, i) => {
    const ang = (Math.PI * 2 * i) / puntas;
    const r = radio * (1 - irregularidad / 2 + rnd() * irregularidad);
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  });
  // Catmull-Rom cerrada: cada tramo usa los vecinos de forma circular, así el cierre también es suave.
  const p = (i: number) => pts[(i + puntas) % puntas];
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < puntas; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d} Z`;
}

/** «Layered peaks»: cordilleras en capas (para las islas del mapa). */
export function picosEnCapas({ ancho = 600, alto = 200, capas = 3, picos = 5, semilla = 5 } = {}) {
  const rnd = azar(semilla);
  return Array.from({ length: capas }, (_, c) => {
    const base = alto * (0.35 + 0.22 * c);
    let d = `M0 ${alto} L0 ${r1(base)}`;
    for (let i = 1; i <= picos * 2; i++) {
      const x = (ancho * i) / (picos * 2);
      const y = i % 2 ? base - (30 + rnd() * 60) * (1 - c * 0.2) : base + rnd() * 18;
      d += ` L${r1(x)} ${r1(y)}`;
    }
    return `${d} L${ancho} ${alto} Z`;
  });
}

/** «Circle scatter»: puntos dispersos con tamaños variados. */
export function puntosDispersos({ ancho = 1440, alto = 600, cantidad = 28, minimo = 3, maximo = 9, semilla = 21 } = {}) {
  const rnd = azar(semilla);
  return Array.from({ length: cantidad }, () => ({
    cx: r1(rnd() * ancho), cy: r1(rnd() * alto), r: r1(minimo + rnd() * (maximo - minimo)), o: r1(0.25 + rnd() * 0.6)
  }));
}
