// Catálogo de contenido: única fuente de verdad de rutas, islas y desafíos.
// Módulo puro (sin dependencias de servidor) para poder probarlo; el acceso desde la app
// pasa por "@/content", que lo marca como solo-servidor.
import type { Challenge, Island, PublicIsland, PublicRoute, Route } from "./types";
import { skills } from "./types";
import { rutaEvidencia } from "./routes/evidencia";
import { rutaPatrones } from "./routes/patrones";
import { rutaDecision } from "./routes/decision";

export const routes: Route[] = [rutaEvidencia, rutaPatrones, rutaDecision];

export const XP_BY_DIFFICULTY = { BASIC: 10, INTERMEDIATE: 15, ADVANCED: 20 } as const;
export const ISLAND_BONUS_XP = 20;

export type IslandEntry = { island: Island; route: Route; routeIndex: number; islandIndex: number; order: number };
export type ChallengeEntry = { challenge: Challenge; island: Island; route: Route; baseXp: number };

/** Todas las islas en orden de juego. */
export const islandEntries: IslandEntry[] = routes.flatMap((route, routeIndex) =>
  route.islands.map((island, islandIndex) => ({ island, route, routeIndex, islandIndex, order: 0 }))
);
islandEntries.forEach((entry, index) => { entry.order = index; });

const islandBySlug = new Map(islandEntries.map((entry) => [entry.island.slug, entry]));
const challengeById = new Map<string, ChallengeEntry>(
  islandEntries.flatMap(({ island, route }) =>
    island.challenges.map((challenge) => [
      challenge.id,
      { challenge, island, route, baseXp: XP_BY_DIFFICULTY[route.difficulty] }
    ] as const)
  )
);

export function getIsland(slug: string) {
  return islandBySlug.get(slug);
}

export function getChallenge(id: string) {
  return challengeById.get(id);
}

export const allChallenges: ChallengeEntry[] = [...challengeById.values()];

export function toPublicIsland(island: Island, route: Route): PublicIsland {
  return {
    slug: island.slug,
    name: island.name,
    topic: island.topic,
    skillLabel: skills[island.skill].label,
    challengeCount: island.challenges.length,
    maxXp: island.challenges.length * XP_BY_DIFFICULTY[route.difficulty] + ISLAND_BONUS_XP
  };
}

export function getPublicRoutes(): PublicRoute[] {
  return routes.map((route) => ({
    slug: route.slug,
    name: route.name,
    subtitle: route.subtitle,
    level: route.level,
    difficulty: route.difficulty,
    islands: route.islands.map((island) => toPublicIsland(island, route))
  }));
}
