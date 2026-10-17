import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPublicRoutes } from "@/content";
import { ArchipelagoMap } from "@/components/archipelago/archipelago-map";
import { db } from "@/lib/db";
import { effectiveStreak, utcDay } from "@/lib/game";
import { countDueReviews, getIslandProgress } from "@/lib/player";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, progress, dueReviews] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { nombre: true, totalXp: true, onboardingCompletedAt: true, soundEnabled: true, dailyStreak: true, lastActiveDay: true }
    }),
    getIslandProgress(session.user.id),
    countDueReviews(session.user.id)
  ]);

  if (!user) redirect("/login");
  if (!user.onboardingCompletedAt) redirect("/onboarding");

  return (
    <ArchipelagoMap
      routes={getPublicRoutes()}
      progress={progress}
      playerName={user.nombre}
      totalXp={user.totalXp}
      streak={effectiveStreak(user.dailyStreak, user.lastActiveDay, utcDay(new Date()))}
      dueReviews={dueReviews}
      soundEnabled={user.soundEnabled}
    />
  );
}
