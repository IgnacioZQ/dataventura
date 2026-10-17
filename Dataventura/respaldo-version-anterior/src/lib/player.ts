import "server-only";
import { islandEntries } from "@/content";
import { db } from "@/lib/db";

export const orderedIslandSlugs = islandEntries.map((entry) => entry.island.slug);

export type IslandProgressMap = Record<string, { completed: boolean; stars: number; attempts: number }>;

export async function getIslandProgress(userId: string): Promise<IslandProgressMap> {
  const rows = await db.userIslandProgress.findMany({
    where: { userId },
    select: { islandSlug: true, completed: true, stars: true, attempts: true }
  });
  return Object.fromEntries(rows.map(({ islandSlug, ...rest }) => [islandSlug, rest]));
}

export function completedSet(progress: IslandProgressMap) {
  return new Set(Object.entries(progress).filter(([, value]) => value.completed).map(([slug]) => slug));
}

/** Conceptos con repaso pendiente. */
export function countDueReviews(userId: string, now = new Date()) {
  return db.userChallengeProgress.count({ where: { userId, attempts: { gt: 0 }, nextReviewAt: { lte: now } } });
}
