import { describe, expect, it } from "vitest";
import { allChallenges, islandEntries, routes } from "./catalog";
import type { Challenge, Evidence } from "./types";

const PICKABLE: Evidence["kind"][] = ["table", "bars", "stats"];

function evidenceItemIds(evidence: Evidence): string[] {
  switch (evidence.kind) {
    case "table": return evidence.rows.map((row) => row.id);
    case "bars": return evidence.bars.map((bar) => bar.id);
    case "stats": return evidence.items.map((item) => item.id);
    case "lines": return evidence.series.map((series) => series.id);
    case "compare": return evidence.records.map((record) => record.id);
    case "grid": return evidence.groups.map((group) => group.id);
    case "interval": return evidence.items.map((item) => item.id);
  }
}

function hasTones(evidence: Evidence): boolean {
  switch (evidence.kind) {
    case "table": return evidence.rows.some((row) => row.tone && row.tone !== "neutral");
    case "bars": return evidence.bars.some((bar) => bar.tone && bar.tone !== "neutral");
    case "stats": return evidence.items.some((item) => item.tone && item.tone !== "neutral");
    default: return false;
  }
}

function unique(values: string[]) {
  return new Set(values).size === values.length;
}

function checkEvidence(evidence: Evidence, where: string) {
  expect(evidence.title.trim().length, `${where}: evidencia sin título`).toBeGreaterThan(0);
  expect(unique(evidenceItemIds(evidence)), `${where}: ids de evidencia repetidos`).toBe(true);

  if (evidence.kind === "table") {
    expect(evidence.columns.length, `${where}: máximo 4 columnas (pantalla de celular)`).toBeLessThanOrEqual(4);
    for (const row of evidence.rows) {
      expect(row.cells.length, `${where}: fila ${row.id} no calza con las columnas`).toBe(evidence.columns.length);
    }
  }
  if (evidence.kind === "bars") {
    expect(evidence.bars.length, `${where}: entre 2 y 7 barras`).toBeGreaterThanOrEqual(2);
    expect(evidence.bars.length, `${where}: entre 2 y 7 barras`).toBeLessThanOrEqual(7);
    const min = Math.min(...evidence.bars.map((bar) => bar.value));
    for (const base of [evidence.baseline, evidence.compareBaseline]) {
      if (base !== undefined) expect(base, `${where}: el inicio del eje debe quedar bajo el menor valor`).toBeLessThan(min);
    }
  }
  if (evidence.kind === "lines") {
    expect(evidence.series.length, `${where}: máximo 3 series`).toBeLessThanOrEqual(3);
    for (const series of evidence.series) {
      expect(series.values.length, `${where}: serie ${series.id} no calza con xLabels`).toBe(evidence.xLabels.length);
    }
  }
  if (evidence.kind === "compare") {
    const [left, right] = evidence.records;
    expect(left.fields.map((field) => field.key), `${where}: ambos registros deben tener los mismos campos`)
      .toEqual(right.fields.map((field) => field.key));
  }
  if (evidence.kind === "grid") {
    const total = evidence.groups.reduce((sum, group) => sum + group.count, 0);
    expect(total, `${where}: la cuadrícula debe sumar 100`).toBe(100);
  }
  if (evidence.kind === "interval") {
    for (const item of evidence.items) {
      expect(item.low <= item.point && item.point <= item.high, `${where}: intervalo ${item.id} desordenado`).toBe(true);
    }
  }
}

function checkChallenge(challenge: Challenge) {
  const where = challenge.id;
  for (const field of ["concept", "prompt", "hint", "explanation", "takeaway"] as const) {
    expect(challenge[field].trim().length, `${where}: falta ${field}`).toBeGreaterThan(0);
  }
  expect(challenge.prompt.length, `${where}: enunciado demasiado largo`).toBeLessThanOrEqual(220);
  expect(challenge.takeaway.length, `${where}: takeaway demasiado largo`).toBeLessThanOrEqual(120);
  expect(challenge.concept.length, `${where}: concepto demasiado largo`).toBeLessThanOrEqual(40);
  if (challenge.evidence) checkEvidence(challenge.evidence, where);

  if (challenge.type === "choice") {
    const ids = challenge.options.map((option) => option.id);
    expect(challenge.options.length, `${where}: 3 o 4 opciones`).toBeGreaterThanOrEqual(3);
    expect(challenge.options.length, `${where}: 3 o 4 opciones`).toBeLessThanOrEqual(4);
    expect(unique(ids), `${where}: ids de opción repetidos`).toBe(true);
    expect(ids, `${where}: la opción correcta no existe`).toContain(challenge.correct);
    const wrong = challenge.options.filter((option) => option.id !== challenge.correct);
    for (const option of challenge.options) {
      expect(option.text.length, `${where}: opción ${option.id} demasiado larga`).toBeLessThanOrEqual(110);
    }
    for (const option of wrong) {
      expect(option.why?.trim().length ?? 0, `${where}: la opción incorrecta ${option.id} necesita "why"`).toBeGreaterThan(0);
    }
    // La correcta no debe delatarse por ser claramente la más larga.
    const correctLength = challenge.options.find((option) => option.id === challenge.correct)!.text.length;
    const longestWrong = Math.max(...wrong.map((option) => option.text.length));
    expect(correctLength, `${where}: la opción correcta es notoriamente la más larga`).toBeLessThanOrEqual(longestWrong * 1.25);
  }

  if (challenge.type === "multi") {
    const ids = challenge.options.map((option) => option.id);
    expect(challenge.options.length, `${where}: 4 o 5 opciones`).toBeGreaterThanOrEqual(4);
    expect(challenge.options.length, `${where}: 4 o 5 opciones`).toBeLessThanOrEqual(5);
    expect(unique(ids), `${where}: ids de opción repetidos`).toBe(true);
    expect(unique(challenge.correct), `${where}: correctas repetidas`).toBe(true);
    expect(challenge.correct.length, `${where}: al menos 2 correctas`).toBeGreaterThanOrEqual(2);
    expect(challenge.correct.length, `${where}: al menos una incorrecta`).toBeLessThan(challenge.options.length);
    for (const id of challenge.correct) expect(ids, `${where}: correcta ${id} no existe`).toContain(id);
    for (const option of challenge.options) {
      expect(option.text.length, `${where}: opción ${option.id} demasiado larga`).toBeLessThanOrEqual(90);
    }
  }

  if (challenge.type === "order") {
    expect(challenge.items.length, `${where}: entre 3 y 5 pasos`).toBeGreaterThanOrEqual(3);
    expect(challenge.items.length, `${where}: entre 3 y 5 pasos`).toBeLessThanOrEqual(5);
    expect(unique(challenge.items.map((item) => item.id)), `${where}: ids repetidos`).toBe(true);
    for (const item of challenge.items) {
      expect(item.text.length, `${where}: paso ${item.id} demasiado largo`).toBeLessThanOrEqual(70);
    }
  }

  if (challenge.type === "numeric") {
    expect(Number.isFinite(challenge.answer), `${where}: respuesta no numérica`).toBe(true);
    expect(challenge.tolerance, `${where}: tolerancia negativa`).toBeGreaterThanOrEqual(0);
  }

  if (challenge.type === "pick") {
    expect(challenge.evidence, `${where}: "pick" necesita evidencia`).toBeDefined();
    const evidence = challenge.evidence!;
    expect(PICKABLE, `${where}: "pick" solo funciona con table, bars o stats`).toContain(evidence.kind);
    const ids = evidenceItemIds(evidence);
    expect(ids.length, `${where}: al menos 3 elementos para elegir`).toBeGreaterThanOrEqual(3);
    expect(ids, `${where}: el elemento correcto no existe`).toContain(challenge.correct);
    expect(hasTones(evidence), `${where}: la evidencia de un "pick" no puede destacar elementos`).toBe(false);
    for (const id of Object.keys(challenge.why ?? {})) {
      expect(ids, `${where}: "why" apunta a un elemento inexistente (${id})`).toContain(id);
      expect(id, `${where}: "why" no debe explicar la respuesta correcta`).not.toBe(challenge.correct);
    }
  }
}

describe("catálogo de contenido", () => {
  it("tiene 3 rutas de 5 islas", () => {
    expect(routes).toHaveLength(3);
    for (const route of routes) expect(route.islands, route.slug).toHaveLength(5);
  });

  it("usa slugs e ids únicos", () => {
    expect(unique(routes.map((route) => route.slug))).toBe(true);
    expect(unique(islandEntries.map((entry) => entry.island.slug))).toBe(true);
    const ids = routes.flatMap((route) => route.islands.flatMap((island) => island.challenges.map((challenge) => challenge.id)));
    expect(unique(ids)).toBe(true);
    expect(allChallenges).toHaveLength(ids.length);
  });

  it("conserva los slugs de isla ya guardados en el progreso de usuarios", () => {
    expect(islandEntries.map((entry) => entry.island.slug)).toEqual([
      "quality", "integrity", "distribution", "visualization", "causality",
      "sampling-bias", "group-comparisons", "metric-drift", "forecasting", "segment-mix",
      "randomized-test", "confounding", "base-rates", "uncertainty", "deployment-monitor"
    ]);
  });

  it("cada isla tiene historia, al menos 3 desafíos y variedad de formatos", () => {
    for (const { island } of islandEntries) {
      expect(island.story.opening.trim().length, `${island.slug}: falta opening`).toBeGreaterThan(0);
      expect(island.story.closing.trim().length, `${island.slug}: falta closing`).toBeGreaterThan(0);
      expect(island.challenges.length, `${island.slug}: mínimo 3 desafíos`).toBeGreaterThanOrEqual(3);
      const types = new Set(island.challenges.map((challenge) => challenge.type));
      expect(types.size, `${island.slug}: usa al menos 2 formatos distintos`).toBeGreaterThanOrEqual(2);
    }
  });

  it("cada desafío es válido y jugable", () => {
    for (const { challenge } of allChallenges) checkChallenge(challenge);
  });

  it("la respuesta correcta de las preguntas de alternativas no sigue un patrón de posición", () => {
    const positions = allChallenges
      .map(({ challenge }) => challenge)
      .filter((challenge) => challenge.type === "choice")
      .map((challenge) => challenge.options.findIndex((option) => option.id === challenge.correct));
    const mostCommon = Math.max(...[0, 1, 2, 3].map((index) => positions.filter((position) => position === index).length));
    expect(mostCommon / positions.length).toBeLessThanOrEqual(0.45);
  });
});
