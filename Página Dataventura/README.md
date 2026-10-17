# Página Dataventura · landing

Landing de **Dataventura**, la app de Delhos para aprender a pensar con datos en 5 minutos al día. Presenta la app
y lleva a ella: todos los botones de acción abren la app web (no hay descargas ni tiendas). Se publica en la ruta
**`/dataventura/`** del dominio de Delhos, junto a la landing de Delhos (`/`) y Delhos Academy (`/academy/`).

La app en sí es otro proyecto: [`../Dataventura/`](../Dataventura/README.md).

## Correr en local

```bash
npm ci
npm run dev        # http://localhost:5173/dataventura/  (con recarga en vivo)
npm run build      # compila en dist/
```

Para verla dentro del sitio completo, desde la raíz del repositorio: `npm run compilar` y `npm start`
(http://localhost:8080/dataventura/). La app de Dataventura debe estar corriendo en http://localhost:3000 para que
sus botones lleven a algún lado.

Páginas que se compilan (Vite multipágina, ver `vite.config.ts`):

| Ruta | Archivo |
| --- | --- |
| `/dataventura/` | `index.html` → `src/main.tsx` → `src/App.tsx` |
| `/dataventura/quienes-somos/` | `quienes-somos/index.html` → `src/paginas/quienes.tsx` |
| `/dataventura/como-ensenamos/` | `como-ensenamos/index.html` → `src/paginas/como.tsx` |
| `/dataventura/contacto/` | `contacto/index.html` → `src/paginas/contacto.tsx` |

## Dirección de la app

Es el único dato que cambia al publicar. `src/config.ts` la resuelve así:

- Navegando en local (`localhost`), la app está en `http://localhost:3000`.
- Publicada, sale de la variable **`VITE_DATAVENTURA_APP_URL`** al compilar (por ejemplo
  `https://app.tudominio.cl`). Si falta, se usa la app ya publicada, `https://datamind-three.vercel.app`, y
  `npm run publicar` lo avisa. En Vercel se define en Settings › Environment Variables del proyecto del sitio.

El código QR de «Llévala contigo» se genera en el navegador con esa misma dirección (paquete `qrcode`): en local
apunta al computador y lo dice debajo; publicado, a la app.

Las redes sociales (`REDES` en `src/config.ts`) están vacías: la columna «Síguenos» del pie y la tarjeta de redes de
Contacto aparecen solas cuando se completen sus direcciones.

## Video de lanzamiento

Video vertical de 45 s (1080×1920, 60 fps, sin audio) para Reels, TikTok y Shorts, hecho con Remotion
(`src/remotion/lanzamiento/`). El guion está en `video-lanzamiento/STORYBOARD.md`. Se reproduce en vivo en el cierre
de la landing y se exporta a MP4:

```bash
npm run video      # video-lanzamiento/dataventura-lanzamiento.mp4 y portada.png
```

Usa Microsoft Edge si está instalado (si no, Remotion descarga su propio navegador) y deja el MP4 en `yuv420p`
estándar. La dirección de la app del cierre sale de `DATAVENTURA_URL` (por defecto, la app publicada). Las pantallas de
diagnóstico, resultado y mapa son capturas reales; el reto del helado, la racha y el certificado están recreados con
datos reales de la app. La música se agrega al publicar.

## Idiomas

Español, inglés y portugués, con el selector del encabezado. La elección se guarda en el navegador (`dv_idioma`) y,
si no hay, se usa el idioma del navegador. Los textos están en `src/i18n/`:

- `diseno.json`: los del diseño «Dataventura Landing» de Claude Design, con los datos corregidos según la app real
  (8 tipos de reto, 20 mapas de 5 islas, meta diaria de 3, 5 o 10 minutos).
- `textos.ts`: los de las secciones agregadas al traspasarlo (video, dimensiones, diagnóstico, certificados,
  preguntas frecuentes, subpáginas) y los del video de Remotion, que también se traduce.

## Cómo está hecha

React 19 + Vite + Tailwind CSS 4, con:

| Herramienta | Para qué | Dónde |
| --- | --- | --- |
| [Motion](https://motion.dev) | Todas las animaciones: apariciones, resortes, parallax, arrastre | en todo el proyecto |
| [Motion Primitives](https://motion-primitives.com) (MIT) | In View, Tilt, Magnetic, Accordion, Border Trail, Infinite Slider (la cinta de temas), Text Scramble y Glow Effect | `src/components/ui/motion-primitives/` |
| [Watermelon UI](https://ui.watermelon.sh) (MIT) | Fluid Tabs (meta diaria y pasos de instalación), Card Swipe (las 5 dimensiones), Scroll Island (el índice flotante) y Shimmer Button | `src/components/ui/watermelon/` |
| [Remotion](https://www.remotion.dev) | «Una partida en 26 segundos»: un video programado que se dibuja en vivo con `@remotion/player`, en el idioma elegido, y se puede saltar por capítulos | `src/remotion/Partida.tsx` |
| Fondos estilo [Haikei](https://haikei.app) | Manchas difuminadas de la portada, olas que separan las secciones lilas y las olas del video | `src/index.css`, `src/components/secciones/Etapas.tsx`, `src/lib/haikei.ts` |

Los componentes de los dos registros se trajeron con `node scripts/traer-componentes.mjs` (equivale a
`npx shadcn add <url>`). Los de Watermelon UI se adaptaron a la marca y sin dependencias de íconos de terceros; cada
archivo lo indica en su encabezado. En Motion Primitives solo se corrigieron tipos y dos detalles marcados con
«Ajuste de Dataventura».

**Licencia de Remotion.** Es gratis para personas, organizaciones sin fines de lucro y empresas de hasta 3
personas; sobre ese tamaño requiere una licencia de empresa (remotion.dev/license). El reproductor declara
`acknowledgeRemotionLicense`.

## De dónde sale el contenido

Los textos están en `src/i18n/` y los datos fijos (colores de los 20 mares y de las 5 dimensiones) en
`src/contenido.ts`. Todo viene de la documentación oficial de la app (`../Dataventura/app`: README,
CONTENIDO.md, `src/config/app.ts`, `src/content/world.ts`, `src/content/texts.ts` y el banco de preguntas): las 5
etapas con sus temas reales, los 20 mapas con los colores de sus mares, las 5 dimensiones, los 8 tipos de reto, el
diagnóstico, el hábito y los certificados. No hay cifras de uso, testimonios ni precios.

- Las capturas de `public/img/app/` son de la app real corriendo en local, con una cuenta de prueba.
- El diseño es «Dataventura Landing» de Claude Design: portada, cinta de temas, los cuatro retos jugables (01–04),
  el recorrido por las 5 etapas, el reto de la semana, «Llévala contigo», el video tutorial, el pie y las tres
  subpáginas. El Capitán NEXUS (`src/components/Nexus.tsx`) viene de ahí, con sus cinco poses animadas.
- El video tutorial (`public/media/`) es el del diseño.
- El código del certificado (DV-7K2P-Q9XM) y el informe por dimensión son ejemplos ilustrativos y se presentan así.

## Estructura

```
index.html                  metadatos, favicon e imagen para compartir
src/App.tsx                 orden de las secciones de la portada
src/paginas/                subpáginas (Quiénes somos, Cómo enseñamos, Contacto)
src/config.ts               dirección de la app, redes, correo y enlaces al resto del sitio
src/i18n/                   textos en español, inglés y portugués, y el selector de idioma
src/contenido.ts            datos fijos (colores de mares y dimensiones)
src/components/secciones/   una sección por archivo
src/components/Nexus.tsx    el Capitán NEXUS animado
src/components/Piezas.tsx   galeón, teléfono, confeti y barrido de color al cambiar de sitio
src/remotion/Partida.tsx    el video
public/icons, public/img    iconos oficiales y capturas de la app
public/media                video tutorial de instalación (webm, mp4 y portada)
```
