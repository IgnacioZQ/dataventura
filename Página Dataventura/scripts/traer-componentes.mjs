// Descarga componentes desde registros compatibles con shadcn (Motion Primitives y Watermelon UI) y los
// deja en src/components/ui/<origen>/. Equivale a "npx shadcn add <url>", sin preguntas interactivas.
// Uso: node scripts/traer-componentes.mjs
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');

const COMPONENTES = {
  'motion-primitives': [
    'in-view', 'tilt', 'magnetic', 'accordion', 'border-trail', 'infinite-slider', 'text-scramble', 'glow-effect'
  ].map(n => `https://motion-primitives.com/c/${n}.json`),
  watermelon: [
    'shimmer-button', 'card-swipe', 'fluid-tabs', 'scroll-island'
  ].map(n => `https://registry.watermelon.sh/r/${n}.json`)
};

const dependencias = new Set();
for (const [origen, urls] of Object.entries(COMPONENTES)) {
  const carpeta = path.join(RAIZ, 'src/components/ui', origen);
  fs.mkdirSync(carpeta, { recursive: true });
  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) { console.error(`✗ ${url}: ${res.status}`); continue; }
    const item = await res.json();
    for (const d of item.dependencies || []) dependencias.add(d);
    for (const f of item.files || []) {
      const nombre = path.basename(f.target || f.path);
      fs.writeFileSync(path.join(carpeta, nombre), f.content);
      console.log(`✓ ${origen}/${nombre}${item.registryDependencies?.length ? '  (usa: ' + item.registryDependencies.join(', ') + ')' : ''}`);
    }
  }
}
console.log('\nDependencias que piden:', [...dependencias].join(' '));
