import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DataMind — Gimnasio de Pensamiento Analítico",
    short_name: "DataMind",
    description: "Entrena tu criterio para decidir mejor con datos.",
    lang: "es-CL",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0912",
    theme_color: "#100b18",
    categories: ["education", "games"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ],
    shortcuts: [
      { name: "Repaso", url: "/review", description: "Repasa los conceptos pendientes" }
    ]
  };
}
