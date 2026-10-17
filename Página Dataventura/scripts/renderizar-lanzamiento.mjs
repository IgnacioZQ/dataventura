// Exporta el video de lanzamiento (src/remotion/lanzamiento) con Remotion.
//   node scripts/renderizar-lanzamiento.mjs                      → video-lanzamiento/dataventura-lanzamiento.mp4 y portada.png
//   node scripts/renderizar-lanzamiento.mjs cuadros <carpeta> 90,600,1400   → fotogramas sueltos para revisar
// La dirección de la app del cierre sale de DATAVENTURA_URL (por defecto, la app publicada).
// Navegador: si existe Microsoft Edge se usa ese; si no, Remotion descarga su propio Chrome.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const RAIZ = path.resolve(import.meta.dirname, '..');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browserExecutable = process.env.REMOTION_BROWSER || (fs.existsSync(EDGE) ? EDGE : null);
const url = (process.env.DATAVENTURA_URL || 'datamind-three.vercel.app').replace(/^https?:\/\//, '').replace(/\/+$/, '');
const inputProps = { url };

const serveUrl = await bundle({
  entryPoint: path.join(RAIZ, 'src/remotion/lanzamiento/raiz.tsx'),
  publicDir: path.join(RAIZ, 'public'),
  webpackOverride: c => ({ ...c, resolve: { ...c.resolve, alias: { ...(c.resolve?.alias ?? {}), '@': path.join(RAIZ, 'src') } } })
});
const composition = await selectComposition({ serveUrl, id: 'Lanzamiento', inputProps, browserExecutable });

if (process.argv[2] === 'cuadros') {
  const carpeta = path.resolve(process.argv[3] || 'cuadros');
  fs.mkdirSync(carpeta, { recursive: true });
  for (const frame of (process.argv[4] || '0').split(',').map(Number)) {
    const output = path.join(carpeta, `cuadro-${String(frame).padStart(4, '0')}.png`);
    await renderStill({ composition, serveUrl, frame, output, inputProps, browserExecutable });
    console.log('✓', output);
  }
} else {
  const salida = path.join(RAIZ, 'video-lanzamiento');
  fs.mkdirSync(salida, { recursive: true });
  let ultimo = -1;
  await renderMedia({
    composition, serveUrl, inputProps, browserExecutable,
    codec: 'h264', crf: 18, pixelFormat: 'yuv420p',
    outputLocation: path.join(salida, 'render-crudo.mp4'),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== ultimo) { ultimo = p; console.log(`${p * 10}%`); } }
  });
  // Remotion entrega el video en rango de color completo (yuvj420p); se pasa a yuv420p estándar para que Instagram,
  // TikTok y WhatsApp lo muestren con los colores correctos. Usa el ffmpeg que trae Remotion.
  const ffmpeg = path.join(RAIZ, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
  execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', path.join(salida, 'render-crudo.mp4'), '-vf', 'scale=in_range=full:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-profile:v', 'high', '-level', '4.2', '-movflags', '+faststart', '-an', path.join(salida, 'dataventura-lanzamiento.mp4')]);
  fs.rmSync(path.join(salida, 'render-crudo.mp4'));
  await renderStill({ composition, serveUrl, frame: 2620, output: path.join(salida, 'portada.png'), inputProps, browserExecutable });
  console.log('Listo:', salida);
}
