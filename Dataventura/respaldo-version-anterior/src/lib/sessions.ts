import "server-only";
import type { Prisma } from "@prisma/client";
import { getChallenge, getIsland, ISLAND_BONUS_XP, islandEntries } from "@/content";
import type { PublicChallenge, Reveal } from "@/content";
import { db } from "@/lib/db";
import {
  accuracy, isIslandUnlocked, MISSES_BEFORE_REVEAL, nextStreak, resolveDay, scheduleReview, starsForMisses, xpForSolve
} from "@/lib/game";
import { buildReveal, feedbackFor, grade, parseAnswer, toPublicChallenge } from "@/lib/grading";
import { completedSet, getIslandProgress, orderedIslandSlugs } from "@/lib/player";

export const REVIEW_SESSION_SIZE = 5;

/** Error esperado del flujo de juego, con su código HTTP. */
export class GameError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export type StartedSession = { sessionId: string; challenges: PublicChallenge[] };

export type SessionSummary = {
  kind: "ISLAND" | "REVIEW";
  xpEarned: number;
  bonusXp: number;
  stars: number | null;
  misses: number;
  accuracy: number;
  streak: number;
  streakGrew: boolean;
  totalXpBefore: number;
  totalXpAfter: number;
  firstCompletion: boolean;
  routeCompleted: boolean;
  closing: string | null;
  nextIslandSlug: string | null;
  takeaways: { concept: string; takeaway: string }[];
};

export type AnswerResult = {
  correct: boolean;
  xp: number;
  /** Orientación cuando la respuesta es incorrecta. */
  feedback: string | null;
  /** Solución: llega al acertar o tras varios fallos seguidos. */
  reveal: Reveal | null;
  summary: SessionSummary | null;
};

export async function startIslandSession(userId: string, islandSlug: string): Promise<StartedSession> {
  const entry = getIsland(islandSlug);
  if (!entry) throw new GameError(404, "No encontramos esta isla.");

  const completed = completedSet(await getIslandProgress(userId));
  if (!isIslandUnlocked(orderedIslandSlugs, completed, islandSlug)) {
    throw new GameError(403, "Completa las islas anteriores para desbloquear esta expedición.");
  }

  const session = await db.playSession.create({
    data: { userId, kind: "ISLAND", islandSlug, challengeIds: entry.island.challenges.map((challenge) => challenge.id) },
    select: { id: true }
  });
  return { sessionId: session.id, challenges: entry.island.challenges.map((challenge) => toPublicChallenge(challenge)) };
}

/** Elige qué repasar: primero lo pendiente; si es poco, se adelanta lo próximo a vencer. */
export async function pickReviewChallengeIds(userId: string, now = new Date()) {
  const rows = await db.userChallengeProgress.findMany({
    where: { userId, attempts: { gt: 0 } },
    orderBy: [{ nextReviewAt: "asc" }, { lastAnsweredAt: "asc" }],
    select: { challengeId: true, nextReviewAt: true }
  });
  const known = rows.filter((row) => getChallenge(row.challengeId));
  const due = known.filter((row) => row.nextReviewAt && row.nextReviewAt <= now);
  const upcoming = known.filter((row) => !row.nextReviewAt || row.nextReviewAt > now);
  const picked = due.slice(0, REVIEW_SESSION_SIZE);
  if (picked.length < 3) picked.push(...upcoming.slice(0, REVIEW_SESSION_SIZE - picked.length));
  return { ids: picked.map((row) => row.challengeId), dueCount: due.length, knownCount: known.length };
}

export async function startReviewSession(userId: string): Promise<StartedSession> {
  const { ids } = await pickReviewChallengeIds(userId);
  if (ids.length === 0) throw new GameError(409, "Completa tu primera isla para desbloquear el repaso.");

  const session = await db.playSession.create({
    data: { userId, kind: "REVIEW", challengeIds: ids },
    select: { id: true }
  });
  return { sessionId: session.id, challenges: ids.map((id) => toPublicChallenge(getChallenge(id)!.challenge)) };
}

export async function submitAnswer(input: {
  userId: string;
  sessionId: string;
  challengeId: string;
  rawAnswer: unknown;
  clientDay: unknown;
}): Promise<AnswerResult> {
  const { userId, sessionId, challengeId } = input;
  const session = await db.playSession.findFirst({ where: { id: sessionId, userId } });
  if (!session) throw new GameError(404, "No encontramos esta sesión.");
  if (session.completedAt) throw new GameError(409, "Esta sesión ya terminó.");
  if (!session.challengeIds.includes(challengeId)) throw new GameError(400, "Este desafío no pertenece a la sesión.");
  if (session.solvedIds.includes(challengeId)) throw new GameError(409, "Este desafío ya está resuelto.");

  const entry = getChallenge(challengeId);
  if (!entry) throw new GameError(410, "Este desafío ya no está disponible.");

  const answer = parseAnswer(entry.challenge, input.rawAnswer);
  if (answer === null) throw new GameError(400, "La respuesta enviada no es válida.");

  const correct = grade(entry.challenge, answer);
  const now = new Date();

  return db.$transaction(async (tx) => {
    const prior = await tx.userChallengeProgress.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      create: { userId, challengeId },
      update: {}
    });
    const priorMisses = prior.wrongStreak;
    const schedule = scheduleReview({ box: prior.box, correct, priorMisses, now });

    if (!correct) {
      const wrongStreak = priorMisses + 1;
      await tx.userChallengeProgress.update({
        where: { id: prior.id },
        data: { attempts: { increment: 1 }, wrongStreak, lastAnsweredAt: now, ...schedule }
      });
      await tx.playSession.update({ where: { id: sessionId }, data: { answers: { increment: 1 }, misses: { increment: 1 } } });
      return {
        correct: false,
        xp: 0,
        feedback: feedbackFor(entry.challenge, answer),
        reveal: wrongStreak >= MISSES_BEFORE_REVEAL ? buildReveal(entry.challenge) : null,
        summary: null
      };
    }

    // Marca el desafío como resuelto solo si nadie lo hizo antes (protege ante doble envío).
    const claimed = await tx.playSession.updateMany({
      where: { id: sessionId, completedAt: null, NOT: { solvedIds: { has: challengeId } } },
      data: { solvedIds: { push: challengeId }, answers: { increment: 1 } }
    });
    if (claimed.count === 0) throw new GameError(409, "Este desafío ya está resuelto.");

    const xp = xpForSolve({ baseXp: entry.baseXp, priorMisses, firstSolve: !prior.firstSolvedAt, kind: session.kind });
    await tx.userChallengeProgress.update({
      where: { id: prior.id },
      data: {
        attempts: { increment: 1 },
        correctCount: { increment: 1 },
        wrongStreak: 0,
        firstSolvedAt: prior.firstSolvedAt ?? now,
        lastAnsweredAt: now,
        ...schedule
      }
    });

    const fresh = await tx.playSession.findUniqueOrThrow({ where: { id: sessionId } });
    const finished = fresh.challengeIds.every((id) => fresh.solvedIds.includes(id));
    const summary = finished
      ? await completeSession(tx, { session: fresh, userId, lastXp: xp, today: resolveDay(input.clientDay, now), now })
      : null;

    if (!summary) {
      await tx.playSession.update({ where: { id: sessionId }, data: { xpEarned: { increment: xp } } });
      await tx.user.update({ where: { id: userId }, data: { totalXp: { increment: xp } } });
    }

    return { correct: true, xp, feedback: null, reveal: buildReveal(entry.challenge), summary };
  });
}

async function completeSession(
  tx: Prisma.TransactionClient,
  input: {
    session: { id: string; kind: "ISLAND" | "REVIEW"; islandSlug: string | null; challengeIds: string[]; answers: number; misses: number; xpEarned: number };
    userId: string;
    lastXp: number;
    today: string;
    now: Date;
  }
): Promise<SessionSummary> {
  const { session, userId, lastXp, today, now } = input;
  const islandEntry = session.kind === "ISLAND" && session.islandSlug ? getIsland(session.islandSlug) : undefined;

  let stars: number | null = null;
  let bonusXp = 0;
  let firstCompletion = false;

  if (islandEntry) {
    stars = starsForMisses(session.misses);
    const slug = islandEntry.island.slug;
    const existing = await tx.userIslandProgress.findUnique({ where: { userId_islandSlug: { userId, islandSlug: slug } } });
    firstCompletion = !existing?.completed;
    bonusXp = firstCompletion ? ISLAND_BONUS_XP : 0;
    await tx.userIslandProgress.upsert({
      where: { userId_islandSlug: { userId, islandSlug: slug } },
      create: { userId, islandSlug: slug, attempts: 1, completed: true, stars, completedAt: now, lastAttemptAt: now },
      update: {
        attempts: { increment: 1 },
        completed: true,
        stars: Math.max(existing?.stars ?? 0, stars),
        completedAt: existing?.completedAt ?? now,
        lastAttemptAt: now
      }
    });
  }

  const user = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: { totalXp: true, dailyStreak: true, bestStreak: true, lastActiveDay: true }
  });
  const streak = nextStreak({ streak: user.dailyStreak, lastDay: user.lastActiveDay, today });
  const gained = lastXp + bonusXp;
  const xpEarned = session.xpEarned + gained;

  await tx.user.update({
    where: { id: userId },
    data: { totalXp: { increment: gained }, dailyStreak: streak, bestStreak: Math.max(user.bestStreak, streak), lastActiveDay: today }
  });
  await tx.playSession.update({ where: { id: session.id }, data: { xpEarned, completedAt: now } });
  await tx.analyticsEvent.create({
    data: {
      userId,
      event: "session_completed",
      properties: { kind: session.kind, islandSlug: session.islandSlug, misses: session.misses, answers: session.answers, xpEarned }
    }
  });

  const next = islandEntry ? islandEntries[islandEntry.order + 1] : undefined;
  const lastOfRoute = islandEntry ? islandEntry.islandIndex === islandEntry.route.islands.length - 1 : false;

  return {
    kind: session.kind,
    xpEarned,
    bonusXp,
    stars,
    misses: session.misses,
    accuracy: accuracy(session.challengeIds.length, session.answers),
    streak,
    streakGrew: user.lastActiveDay !== today,
    totalXpBefore: user.totalXp + gained - xpEarned,
    totalXpAfter: user.totalXp + gained,
    firstCompletion,
    routeCompleted: firstCompletion && lastOfRoute,
    closing: islandEntry?.island.story.closing ?? null,
    nextIslandSlug: next?.island.slug ?? null,
    takeaways: session.challengeIds.flatMap((id) => {
      const found = getChallenge(id);
      return found ? [{ concept: found.challenge.concept, takeaway: found.challenge.takeaway }] : [];
    })
  };
}
