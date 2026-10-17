---
name: Dataventura
description: Landing de Dataventura, la app de Delhos para pensar con datos en 5 minutos al día. Diseño de Claude Design «Dataventura Landing».
colors:
  dv: "#7b4dff"
  dv-600: "#6a3de8"
  dv-700: "#5a30d6"
  dv-900: "#3b2a6e"
  tinta: "#1b1230"
  oro: "#ffd166"
  oro-700: "#d6a572"
  lila-50: "#f7f4ff"
  lila-100: "#f4f0ff"
  lila-200: "#efe9ff"
  lila-300: "#cdbcff"
  borde: "#e5e0f2"
  suave: "#4a4360"
  gris: "#6b6580"
  verde: "#2fbf8a"
  verde-700: "#167a55"
  coral: "#f0556f"
typography:
  display: { family: "Lilita One", weight: 400, use: "titulares y cifras" }
  ui: { family: "Outfit", weight: "600–800", use: "botones, píldoras, etiquetas" }
  texto: { family: "Nunito", weight: "600–800", use: "cuerpo" }
  seccion: { size: "clamp(2.25rem, 5vw, 3.25rem)", lineHeight: 1.05 }
  pildora: { size: "13px", weight: 800, tracking: "0.08em", transform: uppercase }
  boton: { size: "15–16px", weight: 800, tracking: "0.05em", transform: uppercase }
spacing: { base: 4px, gutter: 16px, section: "64–80px", maxWidth: 1120px }
rounded: { boton: 16px, tarjeta: 26px, ficha: 14px, telefono: 42px, pill: 999px }
shadows:
  boton: "0 5px 0 #5a30d6 (botón de juego: sombra sólida que se hunde al presionar)"
  tarjeta: "0 6px 0 #e5e0f2"
---

# DESIGN.md · Dataventura

## Overview

Lúdico y claro: lila de fondo, morado de marca, un oro de acento y el Capitán NEXUS como identidad. Botones «de juego»
con sombra sólida que se hunden al presionar, píldoras numeradas por sección y retos que se pueden jugar en la página.
Trilingüe (español, inglés y portugués). Implementado con Tailwind 4 en `src/index.css` y componentes de Motion
Primitives y Watermelon UI adaptados.

## Colors

- **Marca y acción**: `dv` #7b4dff en botones primarios, títulos de sección y enlaces; `dv-700` #5a30d6 para sombras de
  botón, pie y video tutorial.
- **Acento**: `oro` #ffd166, solo para la llamada final, gemas y resaltados; nunca como color de texto sobre fondo claro.
- **Superficies**: blanco y lilas (`lila-50`–`lila-200`) alternados por sección, separados con olas.
- **Respuestas**: verde para correcto, coral para incorrecto y racha.

## Typography

Lilita One para titulares y cifras, Outfit en mayúsculas espaciadas para botones y píldoras, Nunito para el cuerpo.
Las mayúsculas quedan reservadas para píldoras, botones y etiquetas.

## Layout

- Contenedor de 1120 px con márgenes de 16 px en celular.
- Secciones de 64–80 px de alto de ritmo; filas de retos en zigzag (texto y pieza jugable alternados).
- Una idea por sección, con su píldora numerada (01 a 11).

## Elevation & Depth

Sombras sólidas desplazadas (estética de juego) en botones y tarjetas; sombras difusas solo en teléfonos y videos.

## Shapes

Esquinas generosas: botones de 16 px, tarjetas de 26 px, teléfonos de 42 px y píldoras completas.

## Components

- **Botón de juego** (`.btn-juego`, variantes `blanco`, `oro`, `oscuro`): se hunde 5 px al presionar.
- **Píldora de sección** (`.pildora`) con número.
- **Retos jugables**: gráfico, sin código, predicción y racha, con confeti al acertar.
- **Capitán NEXUS**: mascota animada (cinco poses) que reacciona y guía.
- **Videos**: «Una partida en 26 segundos» y el video de lanzamiento, ambos de Remotion, y el tutorial de instalación.
- **Instalación**: pestañas por sistema (elige solo el del dispositivo) y QR generado con la dirección de la app.

## Do's and Don'ts

- Do: datos reales de la app (8 tipos de reto, 5 etapas, 20 mapas, diagnóstico de 5 o 20 preguntas).
- Do: la mascota como identidad; el oro como único acento; respeto a «reducir movimiento».
- Don't: tiendas de aplicaciones (la app se usa desde el navegador); cifras de uso o testimonios inventados.
- Don't: texto oro sobre fondo claro; más de un acento cálido por pantalla.

## Responsive Behavior

- Bajo 768 px todo pasa a una columna; las filas de retos dejan de alternar.
- El QR se oculta en celulares (ya están en el teléfono).
- Áreas táctiles de 44 px o más en botones, pestañas y opciones.

## Referencia estructural

Se usó **PostHog** (awesome-design-md, `posthog`) solo para estructura y ritmo, sin tomar su identidad:
- adoptado: la mascota como parte de la identidad (no un ícono genérico), un único color fuerte para la llamada
  principal, mayúsculas solo en eyebrows y etiquetas, ritmo uniforme entre secciones, tarjetas con 24 px de relleno
  interior y la estrategia de colapso por anchos;
- descartado: su lienzo crema y su tipografía, porque Dataventura tiene su propia marca.
