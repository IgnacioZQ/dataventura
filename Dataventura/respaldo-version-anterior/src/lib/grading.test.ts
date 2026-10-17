import { describe, expect, it } from "vitest";
import { allChallenges } from "@/content/catalog";
import type { Answer, Challenge } from "@/content/types";
import { buildReveal, feedbackFor, grade, parseAnswer, toPublicChallenge } from "./grading";

function correctAnswer(challenge: Challenge): Answer {
  switch (challenge.type) {
    case "choice":
    case "pick": return challenge.correct;
    case "multi": return [...challenge.correct].reverse();
    case "order": return challenge.items.map((item) => item.id);
    case "numeric": return challenge.answer;
  }
}

function wrongAnswer(challenge: Challenge): Answer {
  switch (challenge.type) {
    case "choice": return challenge.options.find((option) => option.id !== challenge.correct)!.id;
    case "pick": {
      const evidence = challenge.evidence!;
      const ids = evidence.kind === "table" ? evidence.rows.map((row) => row.id)
        : evidence.kind === "bars" ? evidence.bars.map((bar) => bar.id)
        : evidence.kind === "stats" ? evidence.items.map((item) => item.id) : [];
      return ids.find((id) => id !== challenge.correct)!;
    }
    case "multi": return [challenge.correct[0]];
    case "order": return challenge.items.map((item) => item.id).reverse();
    case "numeric": return challenge.answer + challenge.tolerance + 1;
  }
}

const challenges = allChallenges.map((entry) => entry.challenge);

describe("corrección sobre todo el catálogo", () => {
  it("acepta la respuesta correcta de cada desafío", () => {
    for (const challenge of challenges) {
      const answer = parseAnswer(challenge, correctAnswer(challenge));
      expect(answer, `${challenge.id}: respuesta correcta rechazada por forma`).not.toBeNull();
      expect(grade(challenge, answer!), challenge.id).toBe(true);
    }
  });

  it("rechaza una respuesta incorrecta y entrega una pista útil", () => {
    for (const challenge of challenges) {
      const answer = parseAnswer(challenge, wrongAnswer(challenge));
      expect(answer, `${challenge.id}: respuesta incorrecta rechazada por forma`).not.toBeNull();
      expect(grade(challenge, answer!), challenge.id).toBe(false);
      expect(feedbackFor(challenge, answer!).length, challenge.id).toBeGreaterThan(10);
    }
  });

  it("rechaza respuestas con forma inválida", () => {
    for (const challenge of challenges) {
      expect(parseAnswer(challenge, null), challenge.id).toBeNull();
      expect(parseAnswer(challenge, { id: "a" }), challenge.id).toBeNull();
      expect(parseAnswer(challenge, "__no-existe__"), challenge.id).toBeNull();
      expect(parseAnswer(challenge, ["__no-existe__"]), challenge.id).toBeNull();
    }
  });

  it("la versión pública nunca incluye la solución ni las explicaciones", () => {
    const secrets = ["correct", "answer", "tolerance", "explanation", "takeaway", "why"];
    for (const challenge of challenges) {
      const exposed = toPublicChallenge(challenge);
      for (const key of secrets) expect(exposed, `${challenge.id} expone "${key}"`).not.toHaveProperty(key);
      if ("options" in exposed) {
        for (const option of exposed.options) expect(Object.keys(option).sort(), challenge.id).toEqual(["id", "text"]);
      }
      const text = JSON.stringify(exposed);
      expect(text.includes(challenge.explanation), `${challenge.id} filtra la explicación`).toBe(false);
    }
  });

  it("los desafíos de ordenar nunca llegan ya ordenados", () => {
    for (const challenge of challenges) {
      if (challenge.type !== "order") continue;
      for (const random of [() => 0, () => 0.5, () => 0.999, Math.random]) {
        const exposed = toPublicChallenge(challenge, random);
        if (exposed.type !== "order") throw new Error("tipo inesperado");
        expect(exposed.items.map((item) => item.id), challenge.id).not.toEqual(challenge.items.map((item) => item.id));
        expect(exposed.items).toHaveLength(challenge.items.length);
      }
    }
  });

  it("la revelación describe la respuesta correcta", () => {
    for (const challenge of challenges) {
      const reveal = buildReveal(challenge);
      expect(reveal.answerText.length, challenge.id).toBeGreaterThan(0);
      expect(reveal.explanation).toBe(challenge.explanation);
    }
  });
});

describe("casos puntuales de corrección", () => {
  const multi = challenges.find((challenge) => challenge.type === "multi")!;
  const numeric = challenges.find((challenge) => challenge.type === "numeric")!;

  it("selección múltiple: exige el conjunto exacto, sin importar el orden", () => {
    if (multi.type !== "multi") throw new Error("tipo inesperado");
    const extra = multi.options.find((option) => !multi.correct.includes(option.id))!.id;
    expect(grade(multi, [...multi.correct, extra])).toBe(false);
    expect(grade(multi, multi.correct.slice(1))).toBe(false);
    expect(parseAnswer(multi, [multi.correct[0], multi.correct[0]])).toBeNull();
  });

  it("numérico: respeta la tolerancia y no acepta texto", () => {
    if (numeric.type !== "numeric") throw new Error("tipo inesperado");
    expect(grade(numeric, numeric.answer + numeric.tolerance)).toBe(true);
    expect(parseAnswer(numeric, String(numeric.answer))).toBeNull();
    expect(parseAnswer(numeric, Number.NaN)).toBeNull();
  });
});
