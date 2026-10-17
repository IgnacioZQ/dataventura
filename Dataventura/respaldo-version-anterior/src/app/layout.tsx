import type { Metadata, Viewport } from "next";
import { ServiceWorker } from "@/components/ui/service-worker";
import "./globals.css";
import "./game.css";

export const metadata: Metadata = {
  title: "DataMind — Gimnasio de Pensamiento Analítico",
  description: "Entrena tu criterio para decidir mejor con datos.",
  applicationName: "DataMind",
  appleWebApp: { capable: true, title: "DataMind", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#100b18"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
