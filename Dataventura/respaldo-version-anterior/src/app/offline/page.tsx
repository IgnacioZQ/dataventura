import { CaptainNexus } from "@/components/ui/captain-nexus";

export const metadata = { title: "Sin conexión — DataMind" };

export default function OfflinePage() {
  return (
    <main className="g-page">
      <section className="g-shell g-empty">
        <CaptainNexus className="g-empty-captain" />
        <h1>Nos quedamos sin viento</h1>
        <p>No hay conexión en este momento. Tu progreso está a salvo: vuelve a intentarlo cuando recuperes señal.</p>
        {/* Enlace normal a propósito: fuerza una carga completa desde la red. */}
        <a href="/dashboard" className="g-primary">Reintentar</a>
      </section>
    </main>
  );
}
