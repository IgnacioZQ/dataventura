// Reglas del juego: niveles, XP, estrellas, racha y repaso espaciado.
// Funciones puras, compartidas por servidor y cliente.

export const RANKS = ["Grumete", "Marinero", "Navegante", "Explorador", "Cartógrafo", "Capitán", "Almirante"] as const;

/** XP total necesario para alcanzar un nivel (el nivel 1 parte en 0). */
export function xpForLevel(level: number) {
  return 30 * (level - 1) * level;
}

export function levelInfo(totalXp: number) {
  const xp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  return {
    level,
    rank: RANKS[Math.min(level - 1, RANKS.length - 1)],
    xp,
    intoLevel: xp - floor,
    levelSpan: ceiling - floor,
    progress: (xp - floor) / (ceiling - floor),
    toNext: ceiling - xp
  };
}

export type SessionKind = "ISLAND" | "REVIEW";

export const REVIEW_XP = 5;
export const REPLAY_XP = 2;

/**
 * XP por resolver un desafío. Equivocarse cuesta: cada fallo previo reduce la recompensa.
 * `priorMisses` son los fallos seguidos antes de este acierto.
 */
export function xpForSolve(input: { baseXp: number; priorMisses: number; firstSolve: boolean; kind: SessionKind }) {
  const { baseXp, priorMisses, firstSolve, kind } = input;
  if (kind === "REVIEW") return priorMisses === 0 ? REVIEW_XP : 1;
  if (!firstSolve) return priorMisses === 0 ? REPLAY_XP : 0;
  const factor = priorMisses === 0 ? 1 : priorMisses === 1 ? 0.5 : 0.25;
  return Math.max(1, Math.round(baseXp * factor));
}

/** Estrellas de una expedición según los fallos de la sesión. */
export function starsForMisses(misses: number): 1 | 2 | 3 {
  if (misses === 0) return 3;
  if (misses <= 2) return 2;
  return 1;
}

/** Cuántos fallos seguidos antes de mostrar la solución. */
export const MISSES_BEFORE_REVEAL = 2;

// ---------- Días y racha ----------

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

export function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Diferencia en días entre dos fechas "YYYY-MM-DD" (b - a). */
export function dayDiff(a: string, b: string) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
}

/**
 * El "hoy" del jugador lo informa su dispositivo (su zona horaria).
 * Solo se acepta si está a un día de la fecha del servidor; si no, se usa la del servidor.
 */
export function resolveDay(clientDay: unknown, now: Date) {
  const serverDay = utcDay(now);
  if (typeof clientDay !== "string" || !DAY_PATTERN.test(clientDay) || Number.isNaN(Date.parse(`${clientDay}T00:00:00Z`))) {
    return serverDay;
  }
  return Math.abs(dayDiff(serverDay, clientDay)) <= 1 ? clientDay : serverDay;
}

export function nextStreak(input: { streak: number; lastDay: string | null; today: string }) {
  const { streak, lastDay, today } = input;
  if (!lastDay) return 1;
  const gap = dayDiff(lastDay, today);
  if (gap <= 0) return Math.max(streak, 1);
  if (gap === 1) return streak + 1;
  return 1;
}

/** Racha vigente para mostrar: se pierde si pasó más de un día sin jugar. */
export function effectiveStreak(streak: number, lastDay: string | null, today: string) {
  if (!lastDay) return 0;
  return dayDiff(lastDay, today) <= 1 ? streak : 0;
}

// ---------- Repaso espaciado (cajas de Leitner) ----------

export const REVIEW_INTERVAL_DAYS = [1, 2, 4, 8, 16, 32] as const;
export const MAX_BOX = REVIEW_INTERVAL_DAYS.length - 1;
/** Desde esta caja el concepto se considera dominado. */
export const MASTERED_BOX = 3;

/**
 * Acierto limpio: sube de caja y el repaso se aleja.
 * Acierto tras fallar: vuelve a la primera caja (repaso mañana).
 * Fallo: primera caja y queda pendiente de inmediato.
 */
export function scheduleReview(input: { box: number; correct: boolean; priorMisses: number; now: Date }) {
  const { box, correct, priorMisses, now } = input;
  if (!correct) return { box: 0, nextReviewAt: now };
  const nextBox = priorMisses === 0 ? Math.min(box + 1, MAX_BOX) : 0;
  return { box: nextBox, nextReviewAt: new Date(now.getTime() + REVIEW_INTERVAL_DAYS[nextBox] * DAY_MS) };
}

export function accuracy(correct: number, total: number) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

// ---------- Desbloqueo de islas ----------

/**
 * Única regla de desbloqueo: una isla se abre si ya fue completada
 * o si todas las anteriores (en orden de juego) están completas.
 */
export function isIslandUnlocked(orderedSlugs: readonly string[], completed: ReadonlySet<string>, slug: string) {
  const index = orderedSlugs.indexOf(slug);
  if (index === -1) return false;
  if (completed.has(slug)) return true;
  return orderedSlugs.slice(0, index).every((previous) => completed.has(previous));
}

/** Primera isla sin completar: la siguiente parada del viaje. */
export function currentIslandSlug(orderedSlugs: readonly string[], completed: ReadonlySet<string>) {
  return orderedSlugs.find((slug) => !completed.has(slug)) ?? null;
}
