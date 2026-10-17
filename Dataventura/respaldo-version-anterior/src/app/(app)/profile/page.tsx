import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { allChallenges, islandEntries, skills } from "@/content";
import type { SkillId } from "@/content";
import { ProfileActions } from "@/components/profile/profile-actions";
import { AppNav } from "@/components/ui/app-nav";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { db } from "@/lib/db";
import { accuracy, effectiveStreak, levelInfo, MASTERED_BOX, utcDay } from "@/lib/game";
import { countDueReviews, getIslandProgress } from "@/lib/player";

const goalLabels = {
  DECISIONES: "Tomar mejores decisiones con datos",
  PROFESIONAL: "Mejorar mis habilidades profesionales",
  ESTUDIOS: "Prepararme para estudios o certificaciones",
  CURIOSIDAD: "Curiosidad personal"
} as const;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, islandProgress, challengeProgress, dueReviews, sessionsCompleted] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        nombre: true, email: true, role: true, totalXp: true, dailyStreak: true, bestStreak: true, lastActiveDay: true,
        soundEnabled: true, objetivoDeclarado: true, onboardingCompletedAt: true
      }
    }),
    getIslandProgress(userId),
    db.userChallengeProgress.findMany({
      where: { userId },
      select: { challengeId: true, attempts: true, correctCount: true, firstSolvedAt: true, box: true }
    }),
    countDueReviews(userId),
    db.playSession.count({ where: { userId, completedAt: { not: null } } })
  ]);
  if (!user) redirect("/login");
  if (!user.onboardingCompletedAt) redirect("/onboarding");

  const level = levelInfo(user.totalXp);
  const streak = effectiveStreak(user.dailyStreak, user.lastActiveDay, utcDay(new Date()));
  const islandsDone = Object.values(islandProgress).filter((island) => island.completed).length;
  const stars = Object.values(islandProgress).reduce((sum, island) => sum + island.stars, 0);
  const attempts = challengeProgress.reduce((sum, row) => sum + row.attempts, 0);
  const hits = challengeProgress.reduce((sum, row) => sum + row.correctCount, 0);

  const progressById = new Map(challengeProgress.map((row) => [row.challengeId, row]));
  const skillRows = (Object.keys(skills) as SkillId[]).map((id) => {
    const challenges = allChallenges.filter((entry) => entry.island.skill === id);
    const solved = challenges.filter((entry) => progressById.get(entry.challenge.id)?.firstSolvedAt).length;
    const mastered = challenges.filter((entry) => (progressById.get(entry.challenge.id)?.box ?? 0) >= MASTERED_BOX).length;
    return { id, ...skills[id], total: challenges.length, solved, mastered };
  });

  const tiles = [
    { label: "Experiencia", value: `${level.xp} XP`, detail: `Nivel ${level.level}` },
    { label: "Racha actual", value: `🔥 ${streak}`, detail: `Mejor racha: ${user.bestStreak} ${user.bestStreak === 1 ? "día" : "días"}` },
    { label: "Islas completadas", value: `${islandsDone}/${islandEntries.length}`, detail: `${stars} de ${islandEntries.length * 3} estrellas` },
    { label: "Precisión", value: attempts ? `${accuracy(hits, attempts)}%` : "—", detail: `${sessionsCompleted} ${sessionsCompleted === 1 ? "sesión terminada" : "sesiones terminadas"}` }
  ];

  return (
    <main className="g-page g-page-with-nav">
      <div className="p-wrap">
        <header className="p-header">
          <span className="p-avatar" aria-hidden="true">{user.nombre.trim().charAt(0).toLocaleUpperCase() || "N"}</span>
          <div className="p-header-copy">
            <h1>{user.nombre}</h1>
            <p>{level.rank} · Nivel {level.level}</p>
            <div className="g-level-track" role="progressbar" aria-label={`Progreso del nivel ${level.level}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level.progress * 100)}>
              <span style={{ width: `${level.progress * 100}%` }} />
            </div>
            <small>{level.toNext} XP para el nivel {level.level + 1}</small>
          </div>
          <SoundToggle enabledInitially={user.soundEnabled} />
        </header>

        <section className="p-tiles" aria-label="Tus números">
          {tiles.map((tile) => (
            <div key={tile.label} className="g-tile">
              <span>{tile.label}</span>
              <strong>{tile.value}</strong>
              <small>{tile.detail}</small>
            </div>
          ))}
        </section>

        <section className="p-card" aria-labelledby="skills-title">
          <h2 id="skills-title">Tu criterio, habilidad por habilidad</h2>
          <p className="p-card-note">
            La barra avanza al resolver desafíos. Un concepto queda <b>dominado</b> cuando lo aciertas varias veces seguidas en el Repaso.
          </p>
          <ul className="p-skills">
            {skillRows.map((skill) => (
              <li key={skill.id}>
                <div className="p-skill-head">
                  <strong>{skill.label}</strong>
                  <span>{skill.solved}/{skill.total}</span>
                </div>
                <div className="p-skill-track" role="progressbar" aria-label={skill.label} aria-valuemin={0} aria-valuemax={skill.total} aria-valuenow={skill.solved}>
                  <span className="p-skill-solved" style={{ width: `${(skill.solved / skill.total) * 100}%` }} />
                  <span className="p-skill-mastered" style={{ width: `${(skill.mastered / skill.total) * 100}%` }} />
                </div>
                <small>{skill.description}{skill.mastered > 0 ? ` · ${skill.mastered} dominados` : ""}</small>
              </li>
            ))}
          </ul>
        </section>

        {user.objetivoDeclarado && (
          <section className="p-card">
            <h2>Tu objetivo</h2>
            <p className="p-goal">{goalLabels[user.objetivoDeclarado]}</p>
          </section>
        )}

        <section className="p-card">
          <h2>Cuenta</h2>
          <p className="p-card-note">{user.email}</p>
          {user.role === "ADMIN" && <Link href="/admin" className="g-secondary p-admin-link">Panel de administración</Link>}
          <ProfileActions />
        </section>
      </div>
      <AppNav active="profile" dueReviews={dueReviews} />
    </main>
  );
}
