import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SessionPlayer } from "@/components/game/session-player";
import { AppNav } from "@/components/ui/app-nav";
import { CaptainNexus } from "@/components/ui/captain-nexus";
import { db } from "@/lib/db";
import { pickReviewChallengeIds } from "@/lib/sessions";

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, review] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id }, select: { soundEnabled: true, onboardingCompletedAt: true } }),
    pickReviewChallengeIds(session.user.id)
  ]);
  if (!user) redirect("/login");
  if (!user.onboardingCompletedAt) redirect("/onboarding");

  if (review.ids.length === 0) {
    return (
      <main className="g-page g-page-with-nav">
        <section className="g-shell g-empty">
          <CaptainNexus className="g-empty-captain" />
          <h1>Aún no hay nada que repasar</h1>
          <p>Cuando completes tu primera isla, aquí volverán los conceptos justo antes de que se te olviden.</p>
          <Link href="/dashboard" className="g-primary">Ir al mapa <span aria-hidden="true">→</span></Link>
        </section>
        <AppNav active="review" dueReviews={0} />
      </main>
    );
  }

  const upToDate = review.dueCount === 0;
  return (
    <main className="g-page">
      <SessionPlayer
        soundEnabled={user.soundEnabled}
        startBody={{ kind: "REVIEW" }}
        intro={{
          eyebrow: "Repaso inteligente",
          title: upToDate ? "Estás al día" : `${review.dueCount} ${review.dueCount === 1 ? "concepto te espera" : "conceptos te esperan"}`,
          text: upToDate
            ? "No tienes repasos pendientes. Si quieres, adelantamos los próximos para mantener el criterio afilado."
            : "Traje de vuelta lo que más te costó y lo que toca refrescar. Repasar justo a tiempo es lo que convierte una respuesta en un hábito.",
          facts: [`${review.ids.length} preguntas`, "Unos 3 minutos", "+5 XP por acierto limpio"],
          cta: upToDate ? "Adelantar repaso" : "Empezar repaso"
        }}
      />
    </main>
  );
}
