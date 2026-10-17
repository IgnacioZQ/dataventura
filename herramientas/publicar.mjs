// Arma la carpeta publicar/ con el sitio unificado, lista para subir a un hosting estático con un solo dominio:
//   publicar/               landing de Delhos (compilada)
//   publicar/academy/       Delhos Academy (compilada)
//   publicar/dataventura/   landing de Dataventura (compilada)
// La app web de Dataventura se publica aparte (Next.js con base de datos); ver Dataventura/README.md.
// Uso: npm run publicar
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ, RUTAS, EXCLUIR } from './sitio.mjs';

const SALIDA = path.join(RAIZ, 'publicar');

// 1. Compilar los proyectos de React (con sus dependencias, si aún no están instaladas).
for (const { proyecto } of RUTAS.filter(r => r.proyecto)) {
  const cwd = path.join(RAIZ, proyecto);
  console.log(`\n— Compilando ${proyecto}`);
  if (!fs.existsSync(path.join(cwd, 'node_modules'))) execSync('npm ci', { cwd, stdio: 'inherit' });
  execSync('npm run build', { cwd, stdio: 'inherit' });
}
if (!process.env.VITE_DATAVENTURA_APP_URL) {
  console.warn('\nAviso: falta VITE_DATAVENTURA_APP_URL. La página de Dataventura llevará a la app publicada por defecto (https://datamind-three.vercel.app).');
}

// 2. Copiar cada carpeta a su ruta, partiendo por la raíz.
fs.rmSync(SALIDA, { recursive: true, force: true });
for (const { prefijo, carpeta } of [...RUTAS].sort((a, b) => a.prefijo.length - b.prefijo.length)) {
  fs.cpSync(path.join(RAIZ, carpeta), path.join(SALIDA, prefijo), {
    recursive: true,
    filter: (origen) => !EXCLUIR.has(path.basename(origen))
  });
}

// 3. Rutas internas de la Academy (React): cualquier /academy/... sin archivo propio responde con su index.html.
//    Vercel lo toma de vercel.json (en la raíz del repositorio); Netlify y Cloudflare Pages, de _redirects.
const spa = RUTAS.filter(r => r.spa).map(r => `${r.prefijo}*  ${r.prefijo}index.html  200`);
fs.writeFileSync(path.join(SALIDA, '_redirects'), spa.join('\n') + '\n');

// 4. Cada ruta interna de la Academy (Cursos, Webinars, Acceso…) recibe su propia copia de index.html
//    (academy/Cursos/index.html, etc.). Así existen como archivos y funcionan en cualquier hosting, aunque
//    no aplique la regla de _redirects (Cloudflare Pages servía la portada de Delhos en /academy/Cursos).
for (const { prefijo, proyecto } of RUTAS.filter(r => r.spa)) {
  const config = fs.readFileSync(path.join(RAIZ, proyecto, 'src', 'pages.config.js'), 'utf8');
  // El archivo trae un ejemplo de PAGES en su comentario inicial: vale el último bloque, el real.
  const bloques = [...config.matchAll(/export const PAGES = \{([\s\S]*?)\}/g)];
  const paginas = [...(bloques.at(-1)?.[1] ?? '').matchAll(/"([^"]+)"\s*:/g)].map(m => m[1]);
  const indice = path.join(SALIDA, prefijo, 'index.html');
  for (const pagina of paginas) {
    const carpeta = path.join(SALIDA, prefijo, pagina);
    fs.mkdirSync(carpeta, { recursive: true });
    fs.copyFileSync(indice, path.join(carpeta, 'index.html'));
  }
  console.log(`\nRutas internas de ${proyecto} con su propia página: ${paginas.join(', ')}`);
}

console.log(`\nSitio listo en ${path.relative(process.cwd(), SALIDA) || '.'}/`);
for (const { prefijo, carpeta } of RUTAS) console.log(`  ${prefijo.padEnd(14)} ← ${carpeta}`);
