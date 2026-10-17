// Mapa del sitio unificado: qué carpeta del repositorio se publica en cada ruta del dominio.
// Lo usan el servidor local (servidor.mjs) y el armado para publicar (publicar.mjs), así en local
// se navega exactamente con las mismas rutas que tendrá el dominio.
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Del prefijo más largo al más corto: la primera ruta que calza es la que responde. */
export const RUTAS = [
  // Las tres páginas son apps de React: se sirve su compilación (dist/).
  // En la Academy, toda ruta interna cae en su index.html (la resuelve su router).
  { prefijo: '/academy/', carpeta: 'Delhos Academy/dist', spa: true, proyecto: 'Delhos Academy' },
  { prefijo: '/dataventura/', carpeta: 'Página Dataventura/dist', proyecto: 'Página Dataventura' },
  { prefijo: '/', carpeta: 'Delhos/dist', proyecto: 'Delhos' }
];

/** Archivos de trabajo que no se publican aunque estén dentro de una carpeta del sitio. */
export const EXCLUIR = new Set(['README.md']);

export const PUERTO = Number(process.env.PORT) || 8080;
