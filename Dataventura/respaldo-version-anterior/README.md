# DataMind

Gimnasio de pensamiento analítico: un juego al estilo Duolingo para entrenar el criterio con datos. La persona recorre el Archipiélago de los Datos junto al Capitán Nexus, resuelve desafíos con evidencia interactiva y repasa los conceptos antes de olvidarlos.

Es una aplicación web instalable (PWA) hecha con Next.js 16, React 19, TypeScript, Tailwind, Prisma/PostgreSQL y Auth.js.

## Cómo se juega

- **3 rutas, 15 islas, 45 desafíos.** Cada isla es una sesión corta: historia de apertura, 3 desafíos y un resumen con lo aprendido.
- **Cinco formas de responder:** elegir una alternativa, marcar varias, ordenar pasos, escribir un número y tocar el dato directamente en la tabla o el gráfico.
- **Equivocarse cuesta y enseña.** Al fallar se explica por qué esa respuesta no alcanza (sin revelar la correcta), el desafío vuelve al final de la sesión y vale menos XP. Tras dos fallos seguidos se muestra la solución.
- **Estrellas, niveles y racha.** Cada isla entrega de 1 a 3 estrellas según los errores; el XP sube de nivel y de rango (Grumete → Almirante); jugar en días seguidos mantiene la racha.
- **Repaso espaciado.** Cada concepto visto entra a una cola de repaso (cajas de Leitner: 1, 2, 4, 8, 16 y 32 días). Fallar lo devuelve al inicio.

## Estructura

| Ruta | Qué contiene |
| --- | --- |
| `src/content/` | **Todo el contenido del juego.** `types.ts` define el modelo; `routes/*.ts` tiene las islas y desafíos; `content.test.ts` valida que cada desafío sea jugable. |
| `src/lib/game.ts` | Reglas puras: niveles, XP, estrellas, racha, repaso y desbloqueo de islas. |
| `src/lib/grading.ts` | Corrección de respuestas y versión pública de cada desafío (sin solución). |
| `src/lib/sessions.ts` | Flujo de una sesión en el servidor: iniciar, responder, completar. |
| `src/components/game/` | Reproductor de sesión, evidencia visual, controles de respuesta y resumen. |
| `src/components/archipelago/` | Mapa del archipiélago. |
| `src/app/` | Páginas y rutas API (App Router). |
| `prisma/` | Esquema y migraciones. La base guarda solo personas y progreso. |
| `public/sw.js`, `src/app/manifest.ts` | Soporte PWA: instalación y pantalla sin conexión. |

Las respuestas correctas nunca salen del servidor: `src/content/index.ts` está marcado como `server-only` y el navegador solo recibe la versión pública de cada desafío.

## Agregar o editar desafíos

1. Edita el archivo de la ruta en `src/content/routes/`. Cada desafío declara su tipo, enunciado, evidencia, pista, explicación y la idea para llevarse (`takeaway`).
2. Ejecuta `npm test`. El validador revisa, entre otras cosas, que toda alternativa incorrecta explique su error, que la correcta no se delate por ser la más larga y que los datos de la evidencia sean coherentes.
3. No cambies los `slug` de islas ni los `id` de desafíos ya publicados: el progreso guardado depende de ellos.

## Requisitos

- Node.js 20.11 o superior y npm 10 o superior.
- PostgreSQL 14 o superior.

## Instalación local

1. Copia `.env.example` a `.env`.
2. Ajusta `DATABASE_URL`, crea un `AUTH_SECRET` y define las credenciales de las cuentas de prueba (mínimo 12 caracteres).
3. Instala, migra y arranca:

```bash
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

4. Abre `http://localhost:3000`.

Para generar `AUTH_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

## Comandos

```bash
npm run dev         # servidor de desarrollo
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # pruebas (reglas del juego, corrección y validación del contenido)
npm run build       # compilación de producción
npm run db:migrate  # crear una migración nueva tras cambiar el esquema
npm run db:deploy   # aplicar migraciones existentes
npm run db:seed     # crear las cuentas de prueba
npm run db:studio   # explorar la base de datos
```

El flujo de GitHub Actions (`.github/workflows/ci.yml`) ejecuta lint, tipos, pruebas y compilación en cada push y pull request.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión PostgreSQL |
| `AUTH_SECRET` | Firma de sesiones Auth.js |
| `AUTH_URL` | Origen local o desplegado |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Cuenta de administración de prueba |
| `SEED_STUDENT_EMAIL` / `SEED_STUDENT_PASSWORD` | Cuenta de estudiante de prueba |

No subas `.env`: está excluido por `.gitignore`.

## Despliegue (Vercel + PostgreSQL administrado)

1. Crea una base PostgreSQL (por ejemplo, en Neon) y un proyecto en Vercel conectado al repositorio.
2. Configura `DATABASE_URL`, `AUTH_SECRET` y `AUTH_URL` en Vercel.
3. En cada despliegue de producción, `scripts/vercel-build.mjs` aplica las migraciones pendientes antes de compilar.

> **Atención con la migración `20261009120000_game_core`.** Elimina las tablas de contenido y de funciones que nunca se usaron (desafíos del seed antiguo, suscripciones, logros, evaluaciones, sesiones de Auth.js) y varias columnas sin uso de `User`. Conserva cuentas, XP y progreso por isla. Si tu base de producción tiene datos que quieras guardar en esas tablas, respáldala antes de desplegar.

## Instalar como app

La app es una PWA. En Android (Chrome) aparece el botón «Instalar DataMind» en el Perfil; en iPhone se usa Compartir → «Agregar a pantalla de inicio». El service worker solo se registra en producción. Sin conexión se muestra una pantalla de aviso: el juego necesita red porque las respuestas se corrigen en el servidor.

Para publicar en Google Play o App Store, el siguiente paso natural es envolver esta misma web con Capacitor.

## Prototipo original

`datamind-piloto.html`, en la carpeta padre, es el prototipo estático inicial. Se conserva como referencia y no forma parte de esta app.
