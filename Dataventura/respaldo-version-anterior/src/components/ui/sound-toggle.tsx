"use client";

import { useEffect, useState } from "react";
import { playUiSound, setSoundEnabled } from "@/lib/audio";

export function SoundToggle({ enabledInitially }: { enabledInitially: boolean }) {
  const [enabled, setEnabled] = useState(enabledInitially);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabledInitially) return;
    const activateAudio = () => {
      setSoundEnabled(true);
      playUiSound("select");
    };
    window.addEventListener("pointerdown", activateAudio, { once: true });
    window.addEventListener("keydown", activateAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", activateAudio);
      window.removeEventListener("keydown", activateAudio);
    };
  }, [enabledInitially]);

  async function toggleSound() {
    if (saving) return;
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    setSoundEnabled(nextEnabled);
    if (nextEnabled) playUiSound("select");
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/preferences/sound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: nextEnabled })
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "No pudimos guardar tu preferencia de audio.");
      }
    } catch (cause) {
      setEnabled(!nextEnabled);
      setSoundEnabled(!nextEnabled);
      setError(cause instanceof Error ? cause.message : "No pudimos guardar tu preferencia de audio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sound-control">
      <button
        type="button"
        className="sound-toggle"
        onClick={toggleSound}
        aria-pressed={enabled}
        aria-label={enabled ? "Silenciar música y sonidos" : "Activar música y sonidos"}
        title={enabled ? "Silenciar música y sonidos" : "Activar música y sonidos"}
        disabled={saving}
      >
        <span aria-hidden="true">{enabled ? "♫" : "♪"}</span>
        <span className="sr-only">{enabled ? "Audio activado" : "Audio desactivado"}</span>
      </button>
      {error && <span className="sound-error" role="alert">{error}</span>}
    </div>
  );
}
