"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState, useSyncExternalStore } from "react";

const STANDALONE_QUERY = "(display-mode: standalone)";

function subscribeStandalone(onChange: () => void) {
  const media = window.matchMedia(STANDALONE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/** Acciones del perfil que necesitan el navegador: instalar la app y cerrar sesión. */
export function ProfileActions() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);
  // En el servidor se asume instalada para no mostrar el consejo antes de saberlo.
  const standalone = useSyncExternalStore(subscribeStandalone, () => window.matchMedia(STANDALONE_QUERY).matches, () => true);
  const installed = standalone || justInstalled;

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const onInstalled = () => { setJustInstalled(true); setInstallPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return (
    <div className="p-actions">
      {installPrompt && (
        <button type="button" className="g-primary" onClick={install}>Instalar DataMind en este dispositivo</button>
      )}
      {!installPrompt && !installed && (
        <p className="p-install-tip">
          Para tener DataMind como app, abre el menú de tu navegador y elige «Agregar a pantalla de inicio» o «Instalar».
        </p>
      )}
      <button type="button" className="g-secondary" onClick={() => signOut({ redirectTo: "/" })}>Cerrar sesión</button>
    </div>
  );
}
