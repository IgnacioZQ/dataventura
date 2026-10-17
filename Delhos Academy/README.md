# Delhos Academy

Sitio de Delhos Academy, el servicio de cursos en vivo de Delhos: portada, Quiénes somos, Cursos, Webinars y
Workshops, Contacto, inscripción, acceso de estudiantes e instructores y sus paneles. Es una app de React + Vite +
Tailwind + shadcn/ui.

Nació en Base44, que ya no se usa. Se bajó el código y se desconectó por completo: no depende de Base44 ni de
ningún otro servidor. Se publica en la ruta **`/academy/`** del dominio de Delhos, junto a la landing de Delhos
(`/`) y la página de Dataventura (`/dataventura/`).

## Diseño

El sitio sigue el rediseño de Claude Design **«Delhos Academy — Rediseño web»**: fondo claro, titulares en
Source Serif 4, texto en Figtree y azul marino `#1E3A5F` como único acento (paleta en `tailwind.config.js` y
variables en `src/index.css`, así los componentes de shadcn/ui la heredan).

| Pieza | Para qué | Dónde |
| --- | --- | --- |
| Hoja del rediseño | Botones, titulares, filas de cursos, formularios y animaciones ligadas al scroll del diseño | `src/styles/rediseno.css` |
| Marco público | Encabezado con barra de lectura, menú del celular y pie con el ecosistema Delhos | `src/components/rediseno/Marco.jsx` |
| [Motion](https://motion.dev) | Apariciones, cascadas, botones con imán, inclinación 3D y brillo bajo el cursor | `src/components/rediseno/Movimiento.jsx` |
| [Remotion](https://www.remotion.dev) | La animación del hero (una clase en vivo, práctica, retroalimentación y certificado) y el video de presentación de cada curso, armado con sus datos | `src/remotion/`, `src/components/rediseno/VideosRemotion.jsx` |
| Fondos estilo Haikei | Manchas difuminadas del hero, Quiénes somos y Acceso, y la ola antes del llamado final | en cada página |
| Paneles | Encabezado, navegación (en celular, una fila deslizable) y tarjetas de los paneles | `src/components/rediseno/Panel.jsx` |

La composición del hero también existe como proyecto de Remotion aparte, para exportarla a video:
`video-hero-remotion/` (ver su README).

**Licencia de Remotion.** Es gratis para personas, organizaciones sin fines de lucro y empresas de hasta 3
personas; sobre ese tamaño requiere una licencia de empresa (remotion.dev/license).

Los textos de las páginas son los del diseño. Cursos, webinars, instructores, fechas y precios salen siempre de
los datos (no hay cifras ni nombres de ejemplo en la web); cuando no hay datos, cada página muestra un estado vacío.

## Correr en local

Todo el sitio junto, desde la raíz del repositorio:

```bash
npm run academy    # compila esta app (la primera vez, antes: npm ci dentro de esta carpeta)
npm start          # http://localhost:8080/academy/
```

Solo la Academy, con recarga en vivo mientras se edita:

```bash
npm ci
npm run dev        # http://localhost:5173/academy/
```

## De dónde salen los datos

`src/api/client.js` reemplaza al SDK de Base44 con la misma forma de uso (`api.entities.Course.list()`,
`api.functions.invoke(...)`, etc.), así las pantallas no cambiaron:

- **Contenido publicado** (cursos, webinars, instructores, módulos y lecciones): `src/data/datos-iniciales.json`.
  Es lo que ve cualquier visitante. Hoy está vacío, igual que estaba el sitio en Base44, por eso las páginas
  muestran sus estados vacíos («Estamos preparando la próxima cohorte»). Para publicar un curso se agrega ahí; los campos de cada tipo de dato están descritos
  en `docs/base44-original/entities/`.
- **Lo que se crea desde el sitio** (cursos que arma un instructor, mensajes, tareas, notas, foros...): se guarda en
  el navegador de quien lo hace, encima del contenido publicado. Sirve para trabajar y probar en local, pero no se
  comparte entre personas ni equipos.

Por eso, **el portal de estudiantes e instructores (Acceso y sus paneles) necesita un backend real** antes de
usarse con personas: hoy las cuentas y sus contraseñas solo existirían en el navegador. Cuando exista ese
backend, basta con reemplazar `src/api/client.js`.

### Probar los paneles

No hay cuentas de ejemplo. Para entrar a los paneles en local hay que crear, en `datos-iniciales.json` o en el
almacenamiento del navegador (`delhos_academy_datos_v1`), al menos un `Instructor` con `email`, `password` y
`status: "active"`, un `Course` suyo con `status: "active"` y un `Student` con `course_id`. Después, el instructor
puede crear los demás estudiantes desde su panel.

## Formularios y correos

Sin servidor no se envían correos:

- **Contacto e inscripción** abren la aplicación de correo de la persona con el mensaje listo para
  `contacto@delhosacademy.cl` (se cambia en `src/config/sitio.js`). La pantalla le pide enviarlo.
- Los avisos internos del portal (mensajes a estudiantes, etc.) quedan registrados en la consola.
- Agendar clases en Google Calendar y crear la reunión de Meet necesitan un servidor conectado a Google: el sitio
  lo avisa y pide pegar el enlace de Meet en la clase.
- Los archivos que se suben (imágenes, tareas) se guardan en el navegador, hasta 2 MB cada uno.

## Publicar

No se publica sola: va dentro del sitio unificado. Desde la raíz del repositorio, `npm run publicar` compila esta
app y la deja en `publicar/academy/` (ver el README de la raíz). La compilación usa la ruta base `/academy/`
(`vite.config.js`); si algún día se publica en otra ruta, se cambia ahí.

## Qué cambió respecto del código de Base44

- `src/api/client.js` y `src/data/datos-iniciales.json` reemplazan al SDK y al backend de Base44. Las funciones de
  servidor que usaba el sitio están reimplementadas ahí; el código original quedó como referencia en
  `docs/base44-original/`.
- Se quitaron el plugin de Base44 en Vite, el inicio de sesión de la plataforma (no lo usaba ninguna página), las
  plantillas de login de Base44 que no estaban enlazadas, el `.env.local` y el `vercel.json` que reenviaba a Base44.
- Los logos que estaban alojados en Base44 se descargaron a `public/marca/`.
- El sitio vive en `/academy/` y su pie de página enlaza a Delhos y a Dataventura.

## Qué cambió con el rediseño (octubre de 2026)

- Todas las páginas públicas y el marco de los paneles se rehicieron con el diseño nuevo. Los componentes que
  quedaron sin uso están en `docs/version-anterior/`.
- Se arreglaron fallas que existían antes: los avisos de confirmación y error (sonner) no se veían porque no
  estaban montados; en el celular el estudiante no podía llegar a Foro ni a Mensajería; el botón «Contenido» de un
  curso del instructor se quedaba cargando sin salida; al cambiar de página no se volvía arriba.
- El instructor tiene ahora las pestañas **Anuncios** y **Foro** en cada curso: antes los estudiantes veían esas
  secciones, pero nadie podía publicar en ellas.
- La postulación pasó a tres pasos con validación, guarda la postulación (entidad `Inscription`) y abre el correo
  con los datos. Sin parámetros, deja elegir el curso.
- Los paneles se cargan aparte (el archivo principal bajó de 942 KB a 368 KB) y Remotion va en su propio archivo.
