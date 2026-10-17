"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Answer, PublicChallenge } from "@/content/types";
import { ChallengeInput, INSTRUCTIONS } from "@/components/game/challenge-input";
import { Confetti } from "@/components/game/confetti";
import { EvidenceView } from "@/components/game/evidence";
import { SessionSummaryView } from "@/components/game/session-summary";
import { CaptainNexus } from "@/components/ui/captain-nexus";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { playUiSound } from "@/lib/audio";
import type { AnswerResult, SessionSummary, StartedSession } from "@/lib/sessions";

export type SessionIntro = {
  eyebrow: string;
  title: string;
  text: string;
  facts: string[];
  cta: string;
};

type StartBody = { kind: "ISLAND"; islandSlug: string } | { kind: "REVIEW" };
type QueueItem = { challenge: PublicChallenge; round: number };

const PRAISE = ["¡Bien leído!", "¡Buen ojo, navegante!", "¡Eso es criterio!", "¡Rumbo correcto!", "¡Evidencia bien usada!"];

function localDay() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
}

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/** Al volver a preguntar, las alternativas cambian de lugar. */
function reshuffle(challenge: PublicChallenge): PublicChallenge {
  if (challenge.type === "choice" || challenge.type === "multi") return { ...challenge, options: shuffled(challenge.options) };
  if (challenge.type === "order") return { ...challenge, items: shuffled(challenge.items) };
  return challenge;
}

function initialAnswer(challenge: PublicChallenge): Answer | null {
  return challenge.type === "order" ? challenge.items.map((item) => item.id) : null;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export function SessionPlayer({
  intro, startBody, soundEnabled, exitHref = "/dashboard"
}: {
  intro: SessionIntro;
  startBody: StartBody;
  soundEnabled: boolean;
  exitHref?: string;
}) {
  const [phase, setPhase] = useState<"intro" | "playing" | "summary">("intro");
  const [starting, setStarting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [total, setTotal] = useState(0);
  const [solved, setSolved] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [numericText, setNumericText] = useState("");
  const [hintOpen, setHintOpen] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [praise, setPraise] = useState(PRAISE[0]);
  const reducedMotion = useReducedMotion();
  const feedbackRef = useRef<HTMLDivElement>(null);

  const current = queue[0];

  useEffect(() => {
    if (result) feedbackRef.current?.focus();
  }, [result]);

  async function start() {
    if (starting) return;
    setStarting(true);
    setError(null);
    playUiSound("reveal");
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(startBody)
      });
      const payload = (await response.json()) as StartedSession & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "No pudimos iniciar la expedición.");
      setSessionId(payload.sessionId);
      setQueue(payload.challenges.map((challenge) => ({ challenge, round: 0 })));
      setTotal(payload.challenges.length);
      setAnswer(initialAnswer(payload.challenges[0]));
      setPhase("playing");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos iniciar la expedición. Revisa tu conexión.");
    } finally {
      setStarting(false);
    }
  }

  async function check() {
    if (!current || !sessionId || answer === null || checking || result) return;
    setChecking(true);
    setError(null);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: current.challenge.id, answer, day: localDay() })
      });
      const payload = (await response.json()) as AnswerResult & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "No pudimos guardar tu respuesta.");
      setResult(payload);
      if (payload.correct) {
        setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
        setCombo((value) => value + 1);
        setSolved((value) => value + 1);
        setSessionXp((value) => value + payload.xp);
        playUiSound("success");
        vibrate(18);
      } else {
        setCombo(0);
        playUiSound("miss");
        vibrate([30, 50, 30]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setChecking(false);
    }
  }

  function next() {
    if (!result || !current) return;
    if (result.summary) {
      setSummary(result.summary);
      setPhase("summary");
      playUiSound("fanfare");
      return;
    }
    const rest = queue.slice(1);
    const upcoming = result.correct ? rest : [...rest, { challenge: reshuffle(current.challenge), round: current.round + 1 }];
    setQueue(upcoming);
    setAnswer(upcoming[0] ? initialAnswer(upcoming[0].challenge) : null);
    setNumericText("");
    setHintOpen(false);
    setResult(null);
    playUiSound("reveal");
  }

  if (phase === "intro") {
    return (
      <section className="g-shell g-intro">
        <div className="g-topbar">
          <Link href={exitHref} className="g-close" aria-label="Volver al mapa">✕</Link>
          <span className="g-topbar-title">{intro.eyebrow}</span>
          <SoundToggle enabledInitially={soundEnabled} />
        </div>
        <motion.div
          className="g-intro-body"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
        >
          <div className="g-intro-stage" aria-hidden="true">
            <span className="g-intro-glow" />
            <CaptainNexus className="g-intro-captain" />
          </div>
          <h1>{intro.title}</h1>
          <div className="g-bubble">
            <p>{intro.text}</p>
          </div>
          <ul className="g-facts">
            {intro.facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
          {error && <p className="g-error" role="alert">{error}</p>}
          <button type="button" className="g-primary" onClick={start} disabled={starting}>
            {starting ? "Zarpando…" : intro.cta} <span aria-hidden="true">→</span>
          </button>
        </motion.div>
      </section>
    );
  }

  if (phase === "summary" && summary) {
    return (
      <section className="g-shell">
        <Confetti />
        <SessionSummaryView summary={summary} exitHref={exitHref} />
      </section>
    );
  }

  if (!current) return null;
  const { challenge, round } = current;
  const locked = Boolean(result) || checking;
  const revealIds = result?.reveal?.correctIds ?? null;
  const wrong = result ? !result.correct : false;
  const progress = total ? (solved / total) * 100 : 0;

  return (
    <section className="g-shell g-playing">
      <div className="g-topbar">
        <button type="button" className="g-close" aria-label="Salir de la expedición" onClick={() => setConfirmExit(true)}>✕</button>
        <div className="g-progress" role="progressbar" aria-label="Avance de la sesión" aria-valuemin={0} aria-valuemax={total} aria-valuenow={solved}>
          <motion.span animate={{ width: `${progress}%` }} transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }} />
        </div>
        <span className="g-xp-chip" aria-label={`${sessionXp} puntos de experiencia en esta sesión`}>
          <b aria-hidden="true">✦</b>{sessionXp}
        </span>
      </div>

      {confirmExit && (
        <div className="g-exit" role="alertdialog" aria-label="¿Salir de la expedición?">
          <p>¿Salir ahora? Lo que ya resolviste queda guardado, pero la isla no se completa.</p>
          <div>
            <button type="button" className="g-secondary" onClick={() => setConfirmExit(false)}>Seguir jugando</button>
            <Link href={exitHref} className="g-secondary g-secondary-quiet">Salir</Link>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={`${challenge.id}-${round}`}
          className="g-card"
          initial={reducedMotion ? false : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: -36 }}
          transition={{ duration: reducedMotion ? 0 : 0.26, ease: "easeOut" }}
        >
          <div className="g-card-meta">
            <span className="g-concept">{challenge.concept}</span>
            {round > 0 && <span className="g-retry-tag">Segunda vuelta</span>}
            {combo >= 2 && !result && <span className="g-combo" aria-label={`${combo} aciertos seguidos`}>🔥 ×{combo}</span>}
          </div>

          {challenge.evidence && (
            <EvidenceView
              evidence={challenge.evidence}
              pick={challenge.type === "pick" ? {
                selected: typeof answer === "string" ? answer : null,
                onSelect: (id) => { setAnswer(id); playUiSound("select"); },
                locked,
                correctId: revealIds?.[0] ?? null,
                wrongId: wrong && typeof answer === "string" ? answer : null
              } : undefined}
            />
          )}

          <h1 className="g-prompt">{challenge.prompt}</h1>
          {challenge.context && <p className="g-context">{challenge.context}</p>}
          <p className="g-instruction">{INSTRUCTIONS[challenge.type]}</p>

          <ChallengeInput
            challenge={challenge}
            answer={answer}
            onChange={(value) => { setAnswer(value); if (challenge.type !== "numeric") playUiSound("select"); }}
            marks={{ locked, correctIds: revealIds, wrong }}
            numericText={numericText}
            onNumericText={setNumericText}
          />

          {!result && (
            <div className="g-hint">
              {hintOpen
                ? <p role="status"><span aria-hidden="true">💡</span> {challenge.hint}</p>
                : <button type="button" onClick={() => setHintOpen(true)}>💡 Ver una pista</button>}
            </div>
          )}
        </motion.article>
      </AnimatePresence>

      <div className={`g-footer ${result ? (result.correct ? "g-footer-correct" : "g-footer-wrong") : ""}`}>
        <AnimatePresence initial={false}>
          {result && (
            <motion.div
              ref={feedbackRef}
              tabIndex={-1}
              className="g-feedback"
              role="status"
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
            >
              <div className="g-feedback-head">
                <span className="g-feedback-icon" aria-hidden="true">{result.correct ? "✓" : "↺"}</span>
                <strong>{result.correct ? praise : result.reveal ? "Esta era la respuesta" : "Casi. Mira esto"}</strong>
                {result.correct && result.xp > 0 && <span className="g-feedback-xp">+{result.xp} XP</span>}
              </div>
              {!result.correct && result.reveal && <p className="g-feedback-answer">{result.reveal.answerText}</p>}
              <p>{result.reveal ? result.reveal.explanation : result.feedback}</p>
              {result.correct && result.reveal && (
                <p className="g-takeaway"><span aria-hidden="true">✦</span> {result.reveal.takeaway}</p>
              )}
              {!result.correct && <p className="g-feedback-note">Volverá a aparecer antes de terminar, para que la fijes.</p>}
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="g-error" role="alert">{error}</p>}
        {result ? (
          <button type="button" className="g-primary" onClick={next}>
            {result.summary ? "Ver resultados" : "Continuar"} <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" className="g-primary" onClick={check} disabled={answer === null || checking}>
            {checking ? "Revisando…" : "Comprobar"}
          </button>
        )}
      </div>
    </section>
  );
}
