"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CaptainNexus } from "@/components/ui/captain-nexus";
import { levelInfo } from "@/lib/game";
import type { SessionSummary } from "@/lib/sessions";

function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const controls = animate(0, to, { duration: 0.9, delay: 0.35, ease: "easeOut", onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [to, reducedMotion]);
  return <>{prefix}{reducedMotion ? to : value}{suffix}</>;
}

function headline(summary: SessionSummary) {
  if (summary.kind === "REVIEW") return summary.misses === 0 ? "¡Repaso impecable!" : "¡Repaso completado!";
  if (summary.routeCompleted) return "¡Ruta completada!";
  if (summary.stars === 3) return "¡Expedición perfecta!";
  return "¡Isla completada!";
}

export function SessionSummaryView({ summary, exitHref }: { summary: SessionSummary; exitHref: string }) {
  const reducedMotion = useReducedMotion();
  const before = levelInfo(summary.totalXpBefore);
  const after = levelInfo(summary.totalXpAfter);
  const leveledUp = after.level > before.level;
  const [barProgress, setBarProgress] = useState(leveledUp ? 0 : before.progress);

  useEffect(() => {
    const timer = window.setTimeout(() => setBarProgress(after.progress), reducedMotion ? 0 : 500);
    return () => window.clearTimeout(timer);
  }, [after.progress, reducedMotion]);

  return (
    <motion.div
      className="g-summary"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
    >
      <div className="g-summary-hero">
        <CaptainNexus className="g-summary-captain" />
        {summary.stars !== null && (
          <div className="g-stars" role="img" aria-label={`${summary.stars} de 3 estrellas`}>
            {[1, 2, 3].map((star) => (
              <motion.span
                key={star}
                className={star <= summary.stars! ? "g-star g-star-on" : "g-star"}
                initial={reducedMotion ? false : { scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.25 + star * 0.18, type: "spring", stiffness: 320, damping: 14 }}
              >
                ★
              </motion.span>
            ))}
          </div>
        )}
        <h1>{headline(summary)}</h1>
        {summary.closing && <p className="g-summary-closing">{summary.closing}</p>}
      </div>

      <div className="g-tiles">
        <div className="g-tile g-tile-xp">
          <span>XP ganados</span>
          <strong><CountUp to={summary.xpEarned} prefix="+" /></strong>
          {summary.bonusXp > 0 && <small>incluye +{summary.bonusXp} por completar la isla</small>}
        </div>
        <div className="g-tile g-tile-accuracy">
          <span>Precisión</span>
          <strong><CountUp to={summary.accuracy} suffix="%" /></strong>
          <small>{summary.misses === 0 ? "sin errores" : `${summary.misses} ${summary.misses === 1 ? "tropiezo" : "tropiezos"} en el camino`}</small>
        </div>
        <div className="g-tile g-tile-streak">
          <span>Racha</span>
          <strong>🔥 {summary.streak}</strong>
          <small>{summary.streakGrew ? (summary.streak === 1 ? "¡empezó hoy!" : "¡un día más!") : "ya sumaste hoy"}</small>
        </div>
      </div>

      <div className="g-level">
        <div className="g-level-head">
          <span>Nivel {after.level} · {after.rank}</span>
          <span>{after.toNext} XP para el siguiente</span>
        </div>
        <div className="g-level-track" role="progressbar" aria-label={`Progreso del nivel ${after.level}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(after.progress * 100)}>
          <span style={{ width: `${barProgress * 100}%` }} />
        </div>
        {leveledUp && <p className="g-level-up" role="status">⬆ ¡Subiste a nivel {after.level}! Ahora eres {after.rank}.</p>}
      </div>

      <section className="g-learned" aria-labelledby="g-learned-title">
        <h2 id="g-learned-title">{summary.kind === "REVIEW" ? "Lo que reforzaste" : "Lo que te llevas de esta isla"}</h2>
        <ul>
          {summary.takeaways.map((item, index) => (
            <motion.li
              key={`${item.concept}-${index}`}
              initial={reducedMotion ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.6 + index * 0.12 }}
            >
              <span aria-hidden="true">✦</span>
              <div><strong>{item.concept}</strong><p>{item.takeaway}</p></div>
            </motion.li>
          ))}
        </ul>
        {summary.kind === "ISLAND" && <p className="g-learned-note">Estos conceptos volverán en tu Repaso para que no se te escapen.</p>}
      </section>

      <div className="g-summary-actions">
        {summary.kind === "ISLAND" && summary.nextIslandSlug && summary.firstCompletion ? (
          <Link className="g-primary" href={`/session?island=${summary.nextIslandSlug}`}>
            {summary.routeCompleted ? "Zarpar a la nueva ruta" : "Siguiente isla"} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link className="g-primary" href={exitHref}>Volver al mapa <span aria-hidden="true">→</span></Link>
        )}
        {summary.kind === "ISLAND" && summary.nextIslandSlug && summary.firstCompletion && (
          <Link className="g-secondary" href={exitHref}>Ver el mapa</Link>
        )}
      </div>
    </motion.div>
  );
}
