import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getIsland, toPublicIsland } from "@/content";
import { SessionPlayer } from "@/components/game/session-player";
import { db } from "@/lib/db";
import { isIslandUnlocked } from "@/lib/game";
import { completedSet, getIslandProgress, orderedIslandSlugs } from "@/lib/player";

export default async function SessionPage({ searchParams }: { searchParams: Promise<{ island?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { island: slug } = await searchParams;
  const entry = slug ? getIsland(slug) : undefined;
  if (!entry) redirect("/dashboard");

  const [user, progress] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id }, select: { soundEnabled: true, onboardingCompletedAt: true } }),
    getIslandProgress(session.user.id)
  ]);
  if (!user) redirect("/login");
  if (!user.onboardingCompletedAt) redirect("/onboarding");
  if (!isIslandUnlocked(orderedIslandSlugs, completedSet(progress), entry.island.slug)) redirect("/dashboard");

  const island = toPublicIsland(entry.island, entry.route);
  const replay = progress[island.slug]?.completed ?? false;

  return (
    <main className="g-page">
      <SessionPlayer
        key={island.slug}
        soundEnabled={user.soundEnabled}
        startBody={{ kind: "ISLAND", islandSlug: island.slug }}
        intro={{
          eyebrow: `${entry.route.name} · Isla ${entry.islandIndex + 1} de ${entry.route.islands.length}`,
          title: island.name,
          text: entry.island.story.opening,
          facts: [
            island.topic,
            `${island.challengeCount} desafíos`,
            replay ? "Repite para mejorar tus estrellas" : `Hasta ${island.maxXp} XP`
          ],
          cta: replay ? "Volver a explorar" : "Comenzar expedición"
        }}
      />
    </main>
  );
}
