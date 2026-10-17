import Link from "next/link";
import { auth } from "@/auth";
import { CaptainNexus } from "@/components/ui/captain-nexus";

const points = [
  { title: "Evidencia que se toca", text: "Tablas, gráficos y registros para leer, ordenar y cuestionar. Nada de memorizar definiciones." },
  { title: "Cinco minutos al día", text: "Islas cortas con historia, racha diaria y repaso justo antes de que se te olvide." },
  { title: "Criterio que se nota", text: "Sesgos, escalas engañosas, causalidad e incertidumbre: lo que separa un dato de una buena decisión." }
];

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="home">
      <div className="home-hero">
        <div>
          <p className="g-eyebrow">Gimnasio de pensamiento analítico</p>
          <h1>Tu criterio abre nuevos territorios.</h1>
          <p className="home-lead">
            Explora el Archipiélago de los Datos junto al Capitán Nexus y entrena, jugando, la habilidad de decidir con evidencia.
          </p>
          <div className="home-actions">
            {session?.user ? (
              <Link className="g-primary" href="/dashboard">Continuar travesía <span aria-hidden="true">→</span></Link>
            ) : (
              <>
                <Link className="g-primary" href="/register">Empezar gratis <span aria-hidden="true">→</span></Link>
                <Link className="g-secondary" href="/login">Ya tengo cuenta</Link>
              </>
            )}
          </div>
        </div>
        <CaptainNexus className="home-captain" />
      </div>
      <ul className="home-points">
        {points.map((point) => (
          <li key={point.title}>
            <strong>{point.title}</strong>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
