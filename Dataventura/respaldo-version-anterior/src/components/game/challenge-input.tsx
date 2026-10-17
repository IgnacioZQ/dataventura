"use client";

import { Reorder } from "framer-motion";
import type { Answer, PublicChallenge } from "@/content/types";

export type InputMarks = {
  /** Bloquea la interacción mientras se muestra el resultado. */
  locked: boolean;
  /** ids correctos cuando el servidor reveló la solución. */
  correctIds: string[] | null;
  /** La respuesta enviada resultó incorrecta. */
  wrong: boolean;
};

type InputProps<T extends PublicChallenge["type"]> = {
  challenge: Extract<PublicChallenge, { type: T }>;
  answer: Answer | null;
  onChange: (answer: Answer | null) => void;
  marks: InputMarks;
};

function optionState(id: string, chosen: boolean, marks: InputMarks) {
  if (marks.correctIds?.includes(id)) return "g-option-correct";
  if (chosen && marks.wrong) return "g-option-wrong";
  if (chosen) return "g-option-selected";
  return "";
}

function ChoiceInput({ challenge, answer, onChange, marks }: InputProps<"choice">) {
  return (
    <div className="g-options" role="radiogroup" aria-label="Alternativas">
      {challenge.options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={answer === option.id}
          disabled={marks.locked}
          onClick={() => onChange(option.id)}
          className={`g-option ${optionState(option.id, answer === option.id, marks)}`}
        >
          <span className="g-option-key" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}

function MultiInput({ challenge, answer, onChange, marks }: InputProps<"multi">) {
  const chosen = Array.isArray(answer) ? answer : [];
  function toggle(id: string) {
    const next = chosen.includes(id) ? chosen.filter((value) => value !== id) : [...chosen, id];
    onChange(next.length ? next : null);
  }
  return (
    <div className="g-options" role="group" aria-label="Alternativas (puedes marcar varias)">
      {challenge.options.map((option) => {
        const checked = chosen.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            role="checkbox"
            aria-checked={checked}
            disabled={marks.locked}
            onClick={() => toggle(option.id)}
            className={`g-option ${optionState(option.id, checked, marks)}`}
          >
            <span className="g-option-key g-option-check" aria-hidden="true">{checked ? "✓" : ""}</span>
            <span>{option.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function OrderInput({ challenge, answer, onChange, marks }: InputProps<"order">) {
  const ids = Array.isArray(answer) ? answer : challenge.items.map((item) => item.id);
  const textById = new Map(challenge.items.map((item) => [item.id, item.text]));

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <Reorder.Group axis="y" values={ids} onReorder={(next) => { if (!marks.locked) onChange(next); }} className="g-order" aria-label="Arrastra o usa las flechas para ordenar">
      {ids.map((id, index) => {
        const placed = marks.correctIds ? marks.correctIds[index] === id : null;
        return (
          <Reorder.Item
            key={id}
            value={id}
            drag={marks.locked ? false : "y"}
            className={`g-order-item ${placed === true ? "g-option-correct" : ""} ${placed === false || (marks.wrong && placed === null) ? "g-option-wrong" : ""}`}
          >
            <span className="g-option-key" aria-hidden="true">{index + 1}</span>
            <span className="g-order-text">{textById.get(id)}</span>
            <span className="g-order-arrows">
              <button type="button" disabled={marks.locked || index === 0} onClick={() => move(index, -1)} aria-label={`Subir: ${textById.get(id)}`}>▲</button>
              <button type="button" disabled={marks.locked || index === ids.length - 1} onClick={() => move(index, 1)} aria-label={`Bajar: ${textById.get(id)}`}>▼</button>
            </span>
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

/** Acepta "12,5", "12.5" y miles con punto ("1.200"). */
export function parseNumericInput(text: string): number | null {
  const cleaned = text.trim().replace(/[$%\s]/g, "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : /^\-?\d{1,3}(\.\d{3})+$/.test(cleaned) ? cleaned.replace(/\./g, "") : cleaned;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function NumericInput({
  challenge, onChange, marks, text, onText
}: InputProps<"numeric"> & { text: string; onText: (text: string) => void }) {
  return (
    <label className={`g-numeric ${marks.wrong ? "g-option-wrong" : ""}`}>
      <span className="sr-only">Tu respuesta{challenge.unit ? ` en ${challenge.unit}` : ""}</span>
      {challenge.unit === "$" && <span className="g-numeric-unit" aria-hidden="true">$</span>}
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="Tu respuesta"
        value={text}
        disabled={marks.locked}
        onChange={(event) => {
          onText(event.target.value);
          onChange(parseNumericInput(event.target.value));
        }}
      />
      {challenge.unit && challenge.unit !== "$" && <span className={challenge.unit.length > 2 ? "g-numeric-unit g-numeric-unit-word" : "g-numeric-unit"} aria-hidden="true">{challenge.unit}</span>}
    </label>
  );
}

export function ChallengeInput({
  challenge, answer, onChange, marks, numericText, onNumericText
}: {
  challenge: PublicChallenge;
  answer: Answer | null;
  onChange: (answer: Answer | null) => void;
  marks: InputMarks;
  numericText: string;
  onNumericText: (text: string) => void;
}) {
  switch (challenge.type) {
    case "choice": return <ChoiceInput challenge={challenge} answer={answer} onChange={onChange} marks={marks} />;
    case "multi": return <MultiInput challenge={challenge} answer={answer} onChange={onChange} marks={marks} />;
    case "order": return <OrderInput challenge={challenge} answer={answer} onChange={onChange} marks={marks} />;
    case "numeric": return <NumericInput challenge={challenge} answer={answer} onChange={onChange} marks={marks} text={numericText} onText={onNumericText} />;
    case "pick": return <p className="g-pick-note"><span aria-hidden="true">☝</span> Toca directamente el elemento en la evidencia.</p>;
  }
}

export const INSTRUCTIONS: Record<PublicChallenge["type"], string> = {
  choice: "Elige una alternativa",
  multi: "Marca todas las que correspondan",
  order: "Ordena los elementos",
  numeric: "Escribe el número",
  pick: "Toca la evidencia"
};
