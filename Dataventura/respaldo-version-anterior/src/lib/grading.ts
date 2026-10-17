// Corrección de respuestas y conversión de desafíos a su versión pública (sin solución).
// Funciones puras: se ejecutan en el servidor, pero no dependen de él.
import type { Answer, Challenge, Evidence, PublicChallenge, Reveal } from "@/content/types";
import { formatNumber } from "@/lib/format";

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function sameOrder(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function evidenceItemIds(evidence: Evidence | undefined): string[] {
  if (!evidence) return [];
  switch (evidence.kind) {
    case "table": return evidence.rows.map((row) => row.id);
    case "bars": return evidence.bars.map((bar) => bar.id);
    case "stats": return evidence.items.map((item) => item.id);
    default: return [];
  }
}

function evidenceItemLabel(evidence: Evidence | undefined, id: string): string {
  if (!evidence) return id;
  switch (evidence.kind) {
    case "table": return evidence.rows.find((row) => row.id === id)?.cells[0] ?? id;
    case "bars": return evidence.bars.find((bar) => bar.id === id)?.label ?? id;
    case "stats": return evidence.items.find((item) => item.id === id)?.label ?? id;
    default: return id;
  }
}

/** Valida la forma de la respuesta recibida. Devuelve null si no corresponde al tipo de desafío. */
export function parseAnswer(challenge: Challenge, raw: unknown): Answer | null {
  switch (challenge.type) {
    case "choice":
      return typeof raw === "string" && challenge.options.some((option) => option.id === raw) ? raw : null;
    case "pick":
      return typeof raw === "string" && evidenceItemIds(challenge.evidence).includes(raw) ? raw : null;
    case "multi": {
      if (!Array.isArray(raw) || raw.length === 0 || raw.length > challenge.options.length) return null;
      const ids = new Set(challenge.options.map((option) => option.id));
      const valid = raw.every((id) => typeof id === "string" && ids.has(id)) && new Set(raw).size === raw.length;
      return valid ? (raw as string[]) : null;
    }
    case "order": {
      if (!Array.isArray(raw) || raw.length !== challenge.items.length) return null;
      const ids = new Set(challenge.items.map((item) => item.id));
      const valid = raw.every((id) => typeof id === "string" && ids.has(id)) && new Set(raw).size === raw.length;
      return valid ? (raw as string[]) : null;
    }
    case "numeric":
      return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
  }
}

export function grade(challenge: Challenge, answer: Answer): boolean {
  switch (challenge.type) {
    case "choice":
    case "pick":
      return answer === challenge.correct;
    case "multi": {
      if (!Array.isArray(answer)) return false;
      const expected = new Set(challenge.correct);
      return answer.length === expected.size && answer.every((id) => expected.has(id));
    }
    case "order":
      return Array.isArray(answer) && sameOrder(answer, challenge.items.map((item) => item.id));
    case "numeric":
      return typeof answer === "number" && Math.abs(answer - challenge.answer) <= challenge.tolerance + 1e-9;
  }
}

/** Retroalimentación para una respuesta incorrecta: orienta sin revelar la solución. */
export function feedbackFor(challenge: Challenge, answer: Answer): string {
  if (challenge.type === "choice" && typeof answer === "string") {
    return challenge.options.find((option) => option.id === answer)?.why ?? challenge.hint;
  }
  if (challenge.type === "pick" && typeof answer === "string") {
    return challenge.why?.[answer] ?? challenge.hint;
  }
  if (challenge.type === "multi" && Array.isArray(answer)) {
    const expected = new Set(challenge.correct);
    const hits = answer.filter((id) => expected.has(id)).length;
    const extras = answer.length - hits;
    if (extras === 0 && hits < expected.size) return `Vas bien, pero falta alguna: marcaste ${hits} de ${expected.size} correctas.`;
    if (extras > 0 && hits === expected.size) return "Marcaste todas las correctas, pero sobra al menos una.";
    return challenge.hint;
  }
  if (challenge.type === "numeric" && typeof answer === "number") {
    return `${answer > challenge.answer ? "Te pasaste" : "Te quedaste corto"}. ${challenge.hint}`;
  }
  return challenge.hint;
}

export function buildReveal(challenge: Challenge): Reveal {
  const base = { explanation: challenge.explanation, takeaway: challenge.takeaway };
  switch (challenge.type) {
    case "choice":
      return { ...base, correctIds: [challenge.correct], answerText: challenge.options.find((option) => option.id === challenge.correct)!.text };
    case "pick":
      return { ...base, correctIds: [challenge.correct], answerText: evidenceItemLabel(challenge.evidence, challenge.correct) };
    case "multi":
      return {
        ...base,
        correctIds: challenge.correct,
        answerText: challenge.options.filter((option) => challenge.correct.includes(option.id)).map((option) => option.text).join(" · ")
      };
    case "order":
      return { ...base, correctIds: challenge.items.map((item) => item.id), answerText: challenge.items.map((item) => item.text).join(" → ") };
    case "numeric":
      return { ...base, correctIds: [], answerText: formatNumber(challenge.answer, challenge.unit) };
  }
}

/** Quita la solución y baraja lo que se pueda barajar. */
export function toPublicChallenge(challenge: Challenge, random: () => number = Math.random): PublicChallenge {
  const base = {
    id: challenge.id,
    concept: challenge.concept,
    prompt: challenge.prompt,
    context: challenge.context,
    evidence: challenge.evidence,
    hint: challenge.hint
  };
  switch (challenge.type) {
    case "choice":
    case "multi":
      return { ...base, type: challenge.type, options: shuffle(challenge.options, random).map(({ id, text }) => ({ id, text })) };
    case "order": {
      const correct = challenge.items.map((item) => item.id);
      let items = shuffle(challenge.items, random);
      // Nunca entregar los pasos ya ordenados.
      for (let tries = 0; tries < 8 && sameOrder(items.map((item) => item.id), correct); tries += 1) {
        items = shuffle(challenge.items, random);
      }
      if (sameOrder(items.map((item) => item.id), correct)) items = [...items.slice(1), items[0]];
      return { ...base, type: "order", items: items.map(({ id, text }) => ({ id, text })) };
    }
    case "numeric":
      return { ...base, type: "numeric", unit: challenge.unit };
    case "pick":
      return { ...base, type: "pick" };
  }
}
