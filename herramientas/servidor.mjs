// Servidor local del sitio unificado: http://localhost:8080
//   /              landing de Delhos          (carpeta Delhos)
//   /academy/      Delhos Academy             (compilación en "Delhos Academy/dist")
//   /dataventura/  landing de Dataventura     (carpeta "Página Dataventura")
// La app web de Dataventura corre aparte (Next.js, puerto 3000); ver Dataventura/README.md.
// Uso: npm start  (o PORT=9000 npm start)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, RUTAS, EXCLUIR, PUERTO } from './sitio.mjs';

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.map': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm'
};

function archivo(ruta) {
  try { return fs.statSync(ruta).isFile() ? ruta : null; } catch { return null; }
}

/** Devuelve el archivo que responde a una ruta del sitio, o null si no existe. */
export function resolver(url) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(url, 'http://x').pathname); } catch { return null; }
  const ruta = RUTAS.find(r => pathname.startsWith(r.prefijo));
  if (!ruta) return null;
  const base = path.join(RAIZ, ruta.carpeta);
  const relativo = pathname.slice(ruta.prefijo.length);
  const destino = path.normalize(path.join(base, relativo));
  if (!destino.startsWith(base) || EXCLUIR.has(path.basename(destino))) return null;
  const encontrado = archivo(destino) || archivo(path.join(destino, 'index.html'));
  if (encontrado) return encontrado;
  // En la app de React, una ruta sin extensión (por ejemplo /academy/Cursos) la resuelve su router.
  if (ruta.spa && !path.extname(relativo)) return archivo(path.join(base, 'index.html'));
  return null;
}

const servidor = http.createServer((req, res) => {
  const { pathname, search } = new URL(req.url, 'http://x');
  // /academy y /dataventura sin barra final: se redirigen para que las rutas relativas funcionen.
  const sinBarra = RUTAS.find(r => r.prefijo !== '/' && pathname === r.prefijo.slice(0, -1));
  if (sinBarra) {
    res.writeHead(301, { Location: sinBarra.prefijo + search });
    return res.end();
  }
  const encontrado = resolver(req.url);
  if (!encontrado) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(`No existe ${pathname}`);
  }
  const cabeceras = {
    'Content-Type': TIPOS[path.extname(encontrado).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'Accept-Ranges': 'bytes'
  };
  // Pedidos por tramos (los videos los usan para avanzar y retroceder).
  const { size } = fs.statSync(encontrado);
  const tramo = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (tramo && (tramo[1] || tramo[2])) {
    const inicio = tramo[1] ? Number(tramo[1]) : Math.max(0, size - Number(tramo[2]));
    const fin = tramo[1] && tramo[2] ? Math.min(Number(tramo[2]), size - 1) : size - 1;
    if (inicio > fin || inicio >= size) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, { ...cabeceras, 'Content-Range': `bytes ${inicio}-${fin}/${size}`, 'Content-Length': fin - inicio + 1 });
    return fs.createReadStream(encontrado, { start: inicio, end: fin }).pipe(res);
  }
  res.writeHead(200, { ...cabeceras, 'Content-Length': size });
  fs.createReadStream(encontrado).pipe(res);
});

for (const { proyecto, carpeta, prefijo } of RUTAS.filter(r => r.proyecto)) {
  if (!archivo(path.join(RAIZ, carpeta, 'index.html'))) {
    console.warn(`Aviso: ${proyecto} no está compilada; ${prefijo} no responderá hasta ejecutar "npm run compilar".`);
  }
}
servidor.listen(PUERTO, () => {
  console.log(`Sitio de Delhos en http://localhost:${PUERTO}/`);
  console.log(`  Delhos Academy        http://localhost:${PUERTO}/academy/`);
  console.log(`  Página Dataventura    http://localhost:${PUERTO}/dataventura/`);
});
