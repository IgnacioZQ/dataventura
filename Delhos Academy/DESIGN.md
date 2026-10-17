---
name: Delhos Academy
description: Sitio y plataforma de Delhos Academy (cursos en vivo de ciencia de datos e IA). Rediseño de Claude Design «Delhos Academy — Rediseño web».
colors:
  tinta: "#16202C"
  texto: "#4A5563"
  gris: "#6B7685"
  marino: "#1E3A5F"
  marino-hover: "#2A4C77"
  marino-700: "#1E4E86"
  azul: "#2E6DB4"
  azul-suave: "#EAF2FB"
  azul-lavado: "#D6E6F7"
  papel: "#F7F8FA"
  blanco: "#FFFFFF"
  linea: "#E3E7EC"
  linea-fuerte: "#CBD3DC"
  linea-suave: "#EEF1F4"
  verde: "#1F6B43"
  verde-suave: "#E8F5EE"
  naranja: "#9A3412"
  naranja-suave: "#FFF1E8"
  peligro: "#B42318"
  noche: "#16202C"
typography:
  display: { family: "Source Serif 4", weight: 600, tracking: "-0.015em", lineHeight: 1.12 }
  texto: { family: "Figtree", weight: "400–700" }
  hero: { size: "clamp(42px, 5.2vw, 64px)" }
  seccion: { size: "clamp(32px, 3.6vw, 44px)" }
  lead: { size: "19px", lineHeight: 1.6 }
  eyebrow: { size: "13px", weight: 600, tracking: "0.06em", transform: uppercase }
  boton: { size: "16px", weight: 600 }
spacing: { base: 4px, gutter: "32px (20px en celular)", section: "112px (80px en celular)", maxWidth: 1180px }
rounded: { boton: 10px, input: 10px, tarjeta: 16px, panel: 20px, pill: 999px }
shadows:
  tarjeta: "0 12px 32px rgba(22, 32, 44, .06)"
  tarjeta-hover: "0 16px 40px rgba(22, 32, 44, .08)"
  destacado: "0 30px 70px rgba(30, 58, 95, .14)"
---

# DESIGN.md · Delhos Academy

## Overview

Editorial y sobrio: fondo papel, titulares en serif (Source Serif 4), texto en Figtree y azul marino como único acento.
Las filas de cursos, las listas con líneas finas y el espacio en blanco ordenan el contenido; las tarjetas se usan solo
cuando hay elevación real (precio del curso, formularios, paneles). Implementado en `src/styles/rediseno.css`,
`tailwind.config.js` y las variables de `src/index.css` (los componentes de shadcn/ui heredan la paleta).

## Colors

- **Acción**: `marino` #1E3A5F (hover #2A4C77) en botones primarios; `azul` #2E6DB4 en enlaces, detalles y foco.
- **Superficies**: `papel` #F7F8FA como lienzo, blanco para secciones alternas y tarjetas; `noche` #16202C en el pie.
- **Estados**: verde para «postulaciones abiertas» y «en vivo», naranja para tareas por vencer, rojo para errores.
- Texto secundario en `gris` #6B7685 solo en tamaños de 14 px o más.

## Typography

Serif 600 con tracking -0.015em para titulares, Figtree para todo lo demás. Eyebrow en mayúsculas con tracking
positivo. Cuerpo con interlineado 1.6–1.7. En los paneles, la serif queda solo en el título de cada vista.

## Layout

- Contenedor de 1180 px con 32 px de margen (20 px en celular).
- Ritmo de 112 px entre secciones (80 px en celular); base de espaciado de 4 px.
- Columnas de 2 en escritorio que se apilan bajo 900 px; filas de curso que pasan a una columna con un resumen.

## Elevation & Depth

Sombras suaves teñidas de la tinta, nunca negras. La inclinación 3D del héroe y el brillo bajo el cursor se apagan con
pantalla táctil o «reducir movimiento».

## Shapes

Botones e inputs rectangulares con 10 px; tarjetas con 16 px; píldoras solo para estados y etiquetas.

## Components

- **Botones**: `.btn-p` (marino), `.btn-s` (blanco con borde), `.btn-w` (blanco sobre marino); 48 px de alto.
- **Fila de curso** (`.crow`): número, título serif, resumen, nivel, inicio y valor; se desplaza al pasar el mouse.
- **Formularios**: etiqueta arriba, ayuda o error debajo (`.fld`, `.lbl`, `.inp`, `.hint`, `.error`).
- **Acordeones**: preguntas y temario con un ítem abierto.
- **Paneles**: encabezado blanco, navegación lateral (fila deslizable en celular), tarjetas con estados y la acción
  principal arriba a la derecha.
- **Videos**: animación del hero y presentación de cada curso hechas con Remotion.

## Do's and Don'ts

- Do: datos reales de cursos, webinars e instructores; estados vacíos, de carga y de error en cada lista.
- Do: un solo acento (marino) y azul para detalles; foco visible en todo control.
- Don't: inventar fechas, precios, nombres o testimonios; ofrecer capacitación a medida.
- Don't: botones en píldora ni sombras pesadas; serif en controles o tablas.

## Responsive Behavior

- 900 px: menú en botón, columnas a una, filas de curso compactas, barra fija de postulación en el detalle.
- 860 px: la navegación de los paneles pasa a fila deslizable.
- Áreas táctiles de 44 px; inputs de 48 px.

## Referencia estructural

Se usó **Notion** (awesome-design-md, `notion`) solo para estructura y ritmo, sin tomar su identidad:
- adoptado: botones rectangulares de esquinas suaves (no píldora), tarjetas con radio de 12–16 px, interlineado
  generoso para lectura, un acento dominante para la llamada principal, el producto real como imagen del héroe, y la
  estrategia de colapso (columnas 2 → 1, navegación a menú, tablas con desplazamiento);
- descartado: su paleta de tarjetas pastel y su tipografía, porque la Academy tiene su propio sistema.
