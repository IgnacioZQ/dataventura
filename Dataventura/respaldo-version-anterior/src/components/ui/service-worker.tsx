"use client";

import { useEffect } from "react";

/** Registra el service worker (solo en producción) para que la app sea instalable y avise cuando no hay conexión. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}
