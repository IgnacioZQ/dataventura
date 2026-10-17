import { describe, expect, it } from "vitest";
import {
  effectiveStreak, levelInfo, nextStreak, resolveDay, scheduleReview, starsForMisses, xpForLevel, xpForSolve
} from "./game";

describe("niveles", () => {
  it("parte en nivel 1 y sube en los umbrales", () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, rank: "Grumete", intoLevel: 0, toNext: 60 });
    expect(levelInfo(59).level).toBe(1);
    expect(levelInfo(60)).toMatchObject({ level: 2, rank: "Marinero", intoLevel: 0 });
    expect(levelInfo(xpForLevel(6)).rank).toBe("Capitán");
  });

  it("mantiene el último rango en niveles altos y tolera XP negativo", () => {
    expect(levelInfo(100_000).rank).toBe("Almirante");
    expect(levelInfo(-5).level).toBe(1);
  });

  it("el progreso dentro del nivel queda entre 0 y 1", () => {
    for (const xp of [0, 1, 59, 60, 179, 180, 950]) {
      const { progress } = levelInfo(xp);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThan(1);
    }
  });
});

describe("XP por desafío", () => {
  const island = { baseXp: 20, firstSolve: true, kind: "ISLAND" as const };

  it("equivocarse reduce la recompensa", () => {
    expect(xpForSolve({ ...island, priorMisses: 0 })).toBe(20);
    expect(xpForSolve({ ...island, priorMisses: 1 })).toBe(10);
    expect(xpForSolve({ ...island, priorMisses: 2 })).toBe(5);
    expect(xpForSolve({ ...island, priorMisses: 9 })).toBe(5);
  });

  it("repetir una isla ya resuelta da poco, y nada si fallas", () => {
    expect(xpForSolve({ ...island, firstSolve: false, priorMisses: 0 })).toBe(2);
    expect(xpForSolve({ ...island, firstSolve: false, priorMisses: 1 })).toBe(0);
  });

  it("el repaso premia el acierto limpio", () => {
    expect(xpForSolve({ baseXp: 20, firstSolve: false, kind: "REVIEW", priorMisses: 0 })).toBe(5);
    expect(xpForSolve({ baseXp: 20, firstSolve: false, kind: "REVIEW", priorMisses: 1 })).toBe(1);
  });
});

describe("estrellas", () => {
  it("3 sin fallos, 2 con hasta dos, 1 con más", () => {
    expect([0, 1, 2, 3, 10].map(starsForMisses)).toEqual([3, 2, 2, 1, 1]);
  });
});

describe("racha diaria", () => {
  it("empieza en 1, suma en días seguidos y no suma dos veces el mismo día", () => {
    expect(nextStreak({ streak: 0, lastDay: null, today: "2026-10-08" })).toBe(1);
    expect(nextStreak({ streak: 3, lastDay: "2026-10-07", today: "2026-10-08" })).toBe(4);
    expect(nextStreak({ streak: 3, lastDay: "2026-10-08", today: "2026-10-08" })).toBe(3);
  });

  it("se reinicia tras un día sin jugar y cruza bien el cambio de mes", () => {
    expect(nextStreak({ streak: 9, lastDay: "2026-10-05", today: "2026-10-08" })).toBe(1);
    expect(nextStreak({ streak: 2, lastDay: "2026-09-30", today: "2026-10-01" })).toBe(3);
  });

  it("la racha visible se apaga si no se jugó ayer ni hoy", () => {
    expect(effectiveStreak(5, "2026-10-07", "2026-10-08")).toBe(5);
    expect(effectiveStreak(5, "2026-10-06", "2026-10-08")).toBe(0);
    expect(effectiveStreak(5, null, "2026-10-08")).toBe(0);
  });

  it("acepta el día del dispositivo solo si es creíble", () => {
    const now = new Date("2026-10-08T02:30:00Z");
    expect(resolveDay("2026-10-07", now)).toBe("2026-10-07");
    expect(resolveDay("2026-10-20", now)).toBe("2026-10-08");
    expect(resolveDay("ayer", now)).toBe("2026-10-08");
    expect(resolveDay(undefined, now)).toBe("2026-10-08");
  });
});

describe("repaso espaciado", () => {
  const now = new Date("2026-10-08T12:00:00Z");
  const days = (date: Date) => (date.getTime() - now.getTime()) / 86_400_000;

  it("un acierto limpio aleja el siguiente repaso", () => {
    const first = scheduleReview({ box: 0, correct: true, priorMisses: 0, now });
    expect(first.box).toBe(1);
    expect(days(first.nextReviewAt)).toBe(2);
    expect(scheduleReview({ box: 5, correct: true, priorMisses: 0, now }).box).toBe(5);
  });

  it("fallar devuelve el concepto a la primera caja y lo deja pendiente", () => {
    const miss = scheduleReview({ box: 4, correct: false, priorMisses: 0, now });
    expect(miss).toEqual({ box: 0, nextReviewAt: now });
    const recovered = scheduleReview({ box: 0, correct: true, priorMisses: 1, now });
    expect(recovered.box).toBe(0);
    expect(days(recovered.nextReviewAt)).toBe(1);
  });
});

describe("desbloqueo de islas", () => {
  const order = ["a", "b", "c", "d"];

  it("abre solo la primera isla al comenzar", async () => {
    const { isIslandUnlocked } = await import("./game");
    const none = new Set<string>();
    expect(order.map((slug) => isIslandUnlocked(order, none, slug))).toEqual([true, false, false, false]);
  });

  it("abre la siguiente al completar las anteriores y mantiene abiertas las ya completadas", async () => {
    const { currentIslandSlug, isIslandUnlocked } = await import("./game");
    expect(isIslandUnlocked(order, new Set(["a", "b"]), "c")).toBe(true);
    expect(isIslandUnlocked(order, new Set(["a", "b"]), "d")).toBe(false);
    expect(isIslandUnlocked(order, new Set(["c"]), "c")).toBe(true);
    expect(isIslandUnlocked(order, new Set(["a"]), "zzz")).toBe(false);
    expect(currentIslandSlug(order, new Set(["a", "b"]))).toBe("c");
    expect(currentIslandSlug(order, new Set(order))).toBeNull();
  });
});
