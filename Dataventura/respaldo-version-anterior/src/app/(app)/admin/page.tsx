import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { allChallenges, getChallenge } from "@/content";
import { db } from "@/lib/db";
import { accuracy } from "@/lib/game";

const WEEK_MS = 7 * 86_400_000;
const weekAgoDate = () => new Date(Date.now() - WEEK_MS);
const MIN_ATTEMPTS_FOR_RANKING = 5;

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const weekAgo = weekAgoDate();
  const [userCount, activePlayers, sessionTotals, recentUsers, challengeStats] = await Promise.all([
    db.user.count(),
    db.playSession.findMany({ where: { completedAt: { gte: weekAgo } }, distinct: ["userId"], select: { userId: true } }),
    db.playSession.aggregate({ where: { completedAt: { not: null } }, _count: true, _sum: { answers: true, misses: true } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, nombre: true, createdAt: true, totalXp: true, onboardingCompletedAt: true }
    }),
    db.userChallengeProgress.groupBy({ by: ["challengeId"], _sum: { attempts: true, correctCount: true }, _count: true })
  ]);

  const answers = sessionTotals._sum.answers ?? 0;
  const misses = sessionTotals._sum.misses ?? 0;
  const hardest = challengeStats
    .map((row) => ({
      entry: getChallenge(row.challengeId),
      attempts: row._sum.attempts ?? 0,
      correct: row._sum.correctCount ?? 0,
      players: row._count
    }))
    .filter((row) => row.entry && row.attempts >= MIN_ATTEMPTS_FOR_RANKING)
    .map((row) => ({ ...row, rate: accuracy(row.correct, row.attempts) }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 6);

  const metrics = [
    { label: "Personas registradas", value: userCount.toLocaleString("es-CL") },
    { label: "Activas en 7 días", value: activePlayers.length.toLocaleString("es-CL") },
    { label: "Sesiones terminadas", value: sessionTotals._count.toLocaleString("es-CL") },
    { label: "Precisión global", value: answers ? `${accuracy(answers - misses, answers)}%` : "—" }
  ];

  return (
    <main className="g-page">
      <div className="p-wrap p-wrap-wide">
        <header className="p-admin-head">
          <div>
            <p className="g-eyebrow">Administración</p>
            <h1>Cómo va DataMind</h1>
          </div>
          <Link href="/profile" className="g-secondary">Volver</Link>
        </header>

        <section className="p-tiles" aria-label="Métricas generales">
          {metrics.map((metric) => (
            <div key={metric.label} className="g-tile">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </section>

        <section className="p-card" aria-labelledby="hardest-title">
          <h2 id="hardest-title">Desafíos que más cuestan</h2>
          <p className="p-card-note">
            Ordenados por menor porcentaje de acierto (mínimo {MIN_ATTEMPTS_FOR_RANKING} intentos). Sirven para revisar si el enunciado es confuso o el concepto necesita más práctica. El catálogo tiene {allChallenges.length} desafíos.
          </p>
          {hardest.length === 0 ? (
            <p className="p-empty">Todavía no hay suficientes respuestas para armar este ranking.</p>
          ) : (
            <ul className="p-list">
              {hardest.map((row) => (
                <li key={row.entry!.challenge.id}>
                  <div>
                    <strong>{row.entry!.challenge.concept}</strong>
                    <small>{row.entry!.island.name} · {row.players} {row.players === 1 ? "persona" : "personas"} · {row.attempts} intentos</small>
                  </div>
                  <span className="p-list-value">{row.rate}%</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="p-card" aria-labelledby="recent-title">
          <h2 id="recent-title">Registros recientes</h2>
          {recentUsers.length === 0 ? (
            <p className="p-empty">Aún no hay personas registradas.</p>
          ) : (
            <ul className="p-list">
              {recentUsers.map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.nombre}</strong>
                    <small>
                      {user.createdAt.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                      {user.onboardingCompletedAt ? "" : " · sin terminar la bienvenida"}
                    </small>
                  </div>
                  <span className="p-list-value">{user.totalXp} XP</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
