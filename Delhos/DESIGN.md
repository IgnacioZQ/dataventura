---
name: Delhos
description: Landing del ecosistema Delhos (educación, tecnología e innovación). Sistema de diseño «Delhos» de Claude Design.
colors:
  marino: "#011F51"
  azul: "#1E6194"
  cielo: "#4A90C2"
  celeste: "#93C5FD"
  chispa: "#E9B949"
  chispa-suave: "#FBF1D9"
  noche: "#081D35"
  fondo: "#FFFFFF"
  perla: "#F7F8FA"
  superficie-alt: "#EFF3F7"
  linea: "#E4E8EE"
  borde-suave: "#C9D3DE"
  tinta: "#081D35"
  texto: "#1E3A5F"
  texto-suave: "#5B7186"
  accion: "#1E6194"
  accion-hover: "#174E78"
  exito: "#15803D"
  peligro: "#B91C1C"
  submarca-academy: "#2B7CB3"
  submarca-dataventura: "#7b4dff"
typography:
  display: { family: "Bricolage Grotesque", weight: 700, tracking: "-0.04em (héroe) / -0.03em (h2)" }
  texto: { family: "Plus Jakarta Sans", weight: "400–800" }
  mono: { family: "JetBrains Mono", use: "kickers, datos, cifras" }
  hero: { size: "clamp(2.6rem, 6.4vw, 4.8rem)", lineHeight: 0.98 }
  h2: { size: "clamp(2rem, 4.4vw, 2.9rem)", lineHeight: 1.08 }
  lead: { size: "1.12rem", lineHeight: 1.7, maxWidth: "60ch" }
  kicker: { size: "12px", weight: 500, tracking: "0.14em", transform: uppercase }
  boton: { size: "15px", weight: 700 }
spacing: { base: 4px, gutter: "max(16px, safe-area)", section: 80px, maxWidth: 1248px }
rounded: { sm: 13px, md: 18px, lg: 26px, xl: 32px, pill: 999px }
shadows:
  tarjeta: "0 24px 60px -24px rgba(30, 61, 89, .35)"
  boton: "0 16px 32px -12px rgba(30, 97, 148, .85)"
motion: { ease: "cubic-bezier(.16, 1, .3, 1)", spring: "cubic-bezier(.34, 1.56, .64, 1)" }
---

# DESIGN.md · Delhos

## Overview

Landing clara con trama y red de datos en el héroe, un azul de acción y una sola chispa ámbar. Las dos plataformas
aparecen como destinos con su propia identidad (azul Academy y morado Dataventura); la marca Delhos no usa degradados
azul-violeta. Fuente de verdad visual: el diseño de Claude Design «Diseño Landing Page Delhos» y el sistema «Delhos».
La hoja del diseño vive sin cambios en `src/estilos/diseno.css`.

## Colors

- **Acción** `azul` #1E6194 (hover #174E78): botones primarios, enlaces, foco.
- **Chispa** `chispa` #E9B949: único acento cálido (datos que viajan en la red, progreso, botón de la película). Texto sobre
  claro en `chispa-texto` #A87A12 para mantener contraste.
- **Tinta y texto**: títulos en `tinta` #081D35, cuerpo en `texto` #1E3A5F, secundario en `texto-suave` #5B7186.
- **Superficies**: blanco, `perla` #F7F8FA y `superficie-alt` #EFF3F7 alternan secciones; `noche` #081D35 para el pie y la
  película.
- Submarcas solo dentro de sus tarjetas y en el barrido al navegar.

## Typography

Bricolage Grotesque en titulares con tracking negativo (-0.04em en el héroe, -0.03em en h2), Plus Jakarta Sans para el
texto y JetBrains Mono en mayúsculas espaciadas para kickers y datos. Cifras que cambian con `tabular-nums`.

## Layout

- Contenedor de 1200 px + 48 px de margen; márgenes laterales mínimos de 16 px que respetan el área segura.
- Ritmo: 80 px entre secciones; base de espaciado de 4 px.
- Héroe a dos columnas (texto a la izquierda, escenario con las plataformas a la derecha) que se apila bajo 1080 px.
- Corte principal a 920 px: el menú pasa a hamburguesa y el índice lateral se oculta.

## Elevation & Depth

Sombras teñidas del azul de la marca (nunca negro puro). Las tarjetas suben con `sombra-tarjeta` al pasar el mouse;
el reflejo (`glare`) sigue al puntero.

## Shapes

Botones en píldora (999 px), tarjetas con 18–32 px, fichas pequeñas con 13 px.

## Components

- **Botón** (`.btn`): píldora de 48 px de alto, imán al puntero con mouse fino, brillo que sigue al puntero.
- **Kicker** (`.kicker`): mono 12 px en mayúsculas con punto de color.
- **Desplegables** Productos / Servicios: tarjeta por plataforma con su ilustración; subrayado que se desliza.
- **Tarjetas de plataforma** (`.show`, `.branch`): inclinación 3D y reflejo; vistas ilustrativas marcadas como tales.
- **Preguntas** (`.q`): acordeón con un solo ítem abierto.
- **Contacto**: campos con etiqueta flotante; prepara el mensaje para copiar o abrir en el correo.
- **Película**: composición de Remotion en una ventana modal con controles propios.

## Do's and Don'ts

- Do: un solo acento cálido (chispa); azul para acciones y foco; textos reales del ecosistema; vistas ilustrativas
  rotuladas.
- Do: todo efecto respeta `prefers-reduced-motion` y tiene limpieza.
- Don't: degradados azul-violeta en la marca Delhos; cifras, clientes o testimonios inventados; ofrecer consultoría o
  capacitación a medida.
- Don't: negro puro; botones sin foco visible.

## Responsive Behavior

- 1080 px: el héroe se apila. 920 px: menú hamburguesa, desplegables dentro del menú, sin índice lateral.
- 640 px: tarjetas del ecosistema y del desafío a una columna; capítulos de la película ocultos.
- Áreas táctiles de 44 px como mínimo.

## Referencia estructural

Se usó **Linear** (awesome-design-md, `linear.app`) solo para estructura y ritmo, sin tomar su identidad:
- adoptado: tracking negativo creciente en los titulares grandes y tracking positivo en el eyebrow (kicker), base de
  espaciado de 4 px, un único acento cromático con roles fijos (acción y foco), áreas táctiles de 44 px, el producto
  como protagonista (vistas de cada plataforma en el héroe);
- descartado: el lienzo oscuro y los botones rectangulares, porque el sistema Delhos es claro y usa píldoras.
