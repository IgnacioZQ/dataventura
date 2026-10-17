# Páginas web de Delhos

Este repositorio reúne el sitio de Delhos: la landing de la empresa y las páginas de sus dos plataformas,
**Delhos Academy** (servicio) y **Dataventura** (producto). Todo se publica unido bajo **un solo dominio**:

| Ruta del dominio | Carpeta | Qué es | Tecnología |
| --- | --- | --- | --- |
| `/` | [`Delhos/`](Delhos/README.md) | Landing de Delhos, la empresa | React + Vite con el sistema de diseño «Delhos», Motion, Remotion, Motion Primitives y Watermelon UI |
| `/academy/` | [`Delhos Academy/`](Delhos%20Academy/README.md) | Delhos Academy: cursos en vivo | React + Vite, sin backend |
| `/dataventura/` | [`Página Dataventura/`](Página%20Dataventura/README.md) | Landing de Dataventura | React + Vite, con Motion, Remotion, Motion Primitives y Watermelon UI |
| aparte | [`Dataventura/`](Dataventura/README.md) | La app web de Dataventura (antes DataMind) y su banco de preguntas | Next.js + PostgreSQL |

`herramientas/` tiene el servidor local y el armado para publicar; las dos leen el mismo mapa de rutas
(`herramientas/sitio.mjs`), así en local se navega con las mismas direcciones que tendrá el dominio.

## Verlo todo en local

Requiere Node.js. Desde esta carpeta:

```bash
npm run compilar   # compila las tres páginas: Delhos, Delhos Academy y Página Dataventura
                   # (la primera vez, antes: npm ci dentro de cada una de esas carpetas)
npm start          # http://localhost:8080
```

- http://localhost:8080/ — Delhos
- http://localhost:8080/academy/ — Delhos Academy
- http://localhost:8080/dataventura/ — Página Dataventura

La app de Dataventura corre aparte en http://localhost:3000 (necesita PostgreSQL; ver
[Dataventura/README.md](Dataventura/README.md)). Navegando en local, la página de Dataventura ya apunta ahí.

## Cómo se conectan

```
Delhos (/)
 ├─► Delhos Academy (/academy/)        con barrido azul
 └─► Página Dataventura (/dataventura/) con barrido morado
        └─► app web de Dataventura      local: http://localhost:3000
                                        publicada: la variable VITE_DATAVENTURA_APP_URL
```

- Delhos Academy vuelve a Delhos y a Dataventura desde su pie de página; la página de Dataventura, desde su menú y
  su pie.
- Los enlaces entre páginas son rutas del mismo dominio: no hay que cambiarlos al publicar.
- Cada marca conserva su color: Delhos `#1E6194`, Delhos Academy `#2B7CB3` y Dataventura `#7b4dff`.

## Publicar con el dominio

1. `npm run publicar` compila las tres páginas y arma la carpeta `publicar/` con el sitio completo (Delhos en la
   raíz, `academy/` y `dataventura/`).
2. En **Vercel**: importar este repositorio con la raíz como Root Directory. `vercel.json` ya indica el comando
   (`npm run publicar`), la carpeta de salida y la regla que necesitan las rutas internas de la Academy. Al conectar
   el dominio, las tres páginas quedan bajo él. En **Netlify** o **Cloudflare Pages** sirve lo mismo: comando
   `npm run publicar` y carpeta `publicar` (incluye un `_redirects` con la regla de la Academy).
3. La **app de Dataventura** se publica como un proyecto aparte (por ejemplo en Vercel con Root Directory
   `Dataventura/app` y una base PostgreSQL administrada), idealmente en un subdominio del mismo dominio, como
   `app.` + el dominio. Luego:
   - en el proyecto del sitio, definir la variable `VITE_DATAVENTURA_APP_URL` con esa dirección (es lo único que
     cambia al publicar; ver [Página Dataventura/README.md](Página%20Dataventura/README.md));
   - en la app, definir `NEXT_PUBLIC_SITE_URL` con el dominio de Delhos, para que muestre los enlaces de vuelta.

## Lo que no se sube

`node_modules/`, `dist/`, `.next/`, `publicar/` y los archivos `.env*` (salvo `.env.example`) se regeneran o son
locales; cada proyecto los excluye en su `.gitignore`.
