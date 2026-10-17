# Dataventura · app web

App de Delhos para aprender a pensar con datos en 5 minutos al día, sin escribir código: preguntas interactivas
con gráficos, explicación inmediata y progreso visible, recorriendo el Archipiélago de los Datos junto al
Capitán NEXUS. Antes se llamaba DataMind.

Esta carpeta es la **aplicación**. Su landing, la página que la presenta y desde la que se entra a la app, es
otro proyecto: [`../Página Dataventura/`](../Página%20Dataventura/README.md).

## Qué hay en esta carpeta

| Carpeta o archivo | Qué es |
| --- | --- |
| `app/` | La app: Next.js 16, React 19, Prisma con PostgreSQL y Auth.js. Tiene su propio repositorio git (en GitHub sigue llamándose `IgnacioZQ/datamind`) y su documentación completa en [app/README.md](app/README.md). |
| `Preguntas/` | Fuentes del contenido: bancos de 500 preguntas, el diagnóstico de pensamiento analítico y las equivalencias de ids entre versiones del banco. Los scripts de la app las leen como `../Preguntas`, por eso esta carpeta vive al lado de `app/` y no debe moverse. |
| `dataventura-piloto.html` | Prototipo de un solo archivo, anterior a la app. |
| `respaldo-version-anterior/` | Código de la versión anterior de la app (3 rutas y 15 islas), guardado como respaldo. |

## Cómo se conecta con el resto del sitio

```
Delhos (/) ──► Página Dataventura (/dataventura/) ──► esta app
                                                       local: http://localhost:3000
```

- La landing de Delhos ya no enlaza a la app: lleva a la página de Dataventura, y desde ahí se entra a la app.
- La app corre aparte porque necesita servidor y base de datos. En producción conviene darle un subdominio del
  mismo dominio de Delhos (por ejemplo `app.` + el dominio).
- De vuelta, la app muestra en Ajustes › Acerca de los enlaces a la página de Dataventura y a Delhos Academy cuando
  tiene definida `NEXT_PUBLIC_SITE_URL` (el dominio de Delhos; en local, `http://localhost:8080`). Sin ella, esos
  enlaces no aparecen.

## Correrla en local

Necesita PostgreSQL. Su `.env` apunta a `localhost:5432`; en este equipo PostgreSQL 17 está instalado pero sin un
servicio activo, así que primero hay que levantar la base. Luego, dentro de `app/`: `npm ci`, `npx prisma migrate
deploy`, `npm run build` y `npm start` (detalles en [app/README.md](app/README.md)). Queda en
http://localhost:3000, que es justo donde la busca la página de Dataventura cuando se navega en local.

## Estado (revisado el 14 de octubre de 2026)

- La verificación de tipos pasa y las 194 pruebas también.
- Está lista para publicarse en Vercel con PostgreSQL administrado: ver «Despliegue» en
  [app/README.md](app/README.md) y la guía [app/docs/LANZAMIENTO.md](app/docs/LANZAMIENTO.md).
- Sigue pendiente `COURSES` en `app/src/config/app.ts`: el curso de Delhos Academy que se recomienda para cada
  dimensión del diagnóstico.
