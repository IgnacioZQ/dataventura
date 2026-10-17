# Delhos · landing

Página principal de Delhos, el ecosistema que une educación, tecnología e innovación. Presenta sus dos plataformas:
**Delhos Academy** (servicio: cursos en vivo de ciencia de datos e IA) y **Dataventura** (producto: app para pensar
con datos en 5 minutos al día). Se publica en la raíz (`/`) del dominio, junto a Delhos Academy (`/academy/`) y la
página de Dataventura (`/dataventura/`).

## Correr en local

```bash
npm ci
npm run dev        # http://localhost:5173  (con recarga en vivo; los enlaces a las otras páginas no responden)
npm run build      # compila en dist/
```

Para navegar el sitio completo, desde la raíz del repositorio: `npm run compilar` y `npm start`
(http://localhost:8080).

## Diseño

La página es el diseño de Claude Design del proyecto **«Diseño Landing Page Delhos»**, portado a React con el mismo
marcado y la misma hoja de estilos:

- `src/estilos/diseno.css` es la hoja del diseño sin cambios (tokens del sistema Delhos, submarcas, animaciones).
  Los ajustes van aparte, en `src/estilos/ajustes.css`: tipografías autoalojadas con Fontsource (Bricolage Grotesque,
  Plus Jakarta Sans, JetBrains Mono, Fredoka y Figtree) y el reproductor de la película.
- `src/diseno/simbolos.ts`: el símbolo de Delhos, los íconos, las ilustraciones de Dataventura y las tramas, definidos
  una vez y usados con `<use href="#…">`.
- `src/componentes/`: Cabecera (intro, navegación con desplegables, menú del celular, índice lateral), Héroe y banda
  de temas, Película, Secciones (ecosistema, desafío, preguntas y contacto) y Pie.
- `src/efectos.ts`: los efectos visuales que el diseño hacía con su script (aparición al hacer scroll, botones
  magnéticos, red de datos del héroe, palabra que se descifra, inclinación y reflejo, banda que acelera con el
  scroll, ramas que se dibujan, tarjetas del desafío, nombre gigante del pie y barrido de color), con su limpieza.
  Todo respeta «reducir movimiento».

**Película «Delhos en 20 segundos».** El diseño la animaba cuadro a cuadro «estilo Remotion»; aquí es una composición
de [Remotion](https://www.remotion.dev) (`src/remotion/Pelicula20.tsx`, 1920×1080, 30 fps, 600 cuadros, cinco
escenas) que se reproduce con `@remotion/player` dentro de la ventana del diseño, con sus controles: reproducir,
pausar, adelantar, capítulos y tiempo. Remotion se carga recién al abrirla. Licencia: gratis hasta 3 personas en la
empresa; sobre eso pide licencia (remotion.dev/license).

## Enlaces

- Delhos Academy: `academy/`, `academy/Cursos` y `academy/Webinars`. Dataventura: `dataventura/` (su página, desde
  donde se entra a la app). Son rutas del mismo dominio (`src/config.ts`), con el barrido de color del diseño al
  navegar. El diseño enlazaba a Base44 y directo a la app; se cambiaron por estas rutas.
- El formulario de contacto no envía datos a ningún servidor: prepara el mensaje para copiarlo o abrirlo en la
  aplicación de correo, dirigido a `contacto@delhosacademy.cl`.

## Versión anterior

La landing anterior (sistema de diseño Delhos con Motion Primitives, Watermelon UI y el video «Entrelazar») quedó
en `docs/version-anterior/` como referencia; no forma parte de la compilación.
