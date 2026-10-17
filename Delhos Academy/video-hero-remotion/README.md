# Video del hero · Delhos Academy (Remotion)

Animación de 12 s en bucle que muestra la experiencia del aula: una clase en vivo, la práctica con datos, la retroalimentación del instructor y el certificado. Es la misma animación que corre en vivo en la portada del rediseño.

## Primer uso

1. Copia el logo a `public/academy-logo.png` (está en `../public/marca/academy-logo.png`).
2. Instala y abre el estudio:

```bash
npm install
npm run studio
```

## Exportar

```bash
npm run render          # out/hero-loop.mp4 (1200×900, para la web)
npm run render:webm     # out/hero-loop.webm (más liviano para la web)
npm run render:vertical # out/hero-vertical.mp4 (1080×1920, Reels y Shorts)
npm run poster          # out/hero-poster.png (imagen de respaldo del video)
```

En la web, usa el WebM con el póster de respaldo y respeta la preferencia de movimiento reducido:

```html
<video autoplay muted loop playsinline poster="hero-poster.png">
  <source src="hero-loop.webm" type="video/webm">
  <source src="hero-loop.mp4" type="video/mp4">
</video>
```

Los nombres (Camila, Matías) y el texto del instructor son de ejemplo; cámbialos en `src/HeroLoop.tsx`.
