// Dirección de la app web de Dataventura: el único dato que cambia al publicar.
//
// - En local (localhost o 127.0.0.1) la app corre con Next.js en http://localhost:3000.
// - Publicada, es la app en Vercel (la misma que usa el diseño «Dataventura Landing»). Si cambia de dominio, se
//   define VITE_DATAVENTURA_APP_URL al compilar (en Vercel: Settings › Environment Variables).
const LOCAL = 'http://localhost:3000';
const PUBLICA = ((import.meta.env.VITE_DATAVENTURA_APP_URL as string | undefined) || 'https://datamind-three.vercel.app').trim().replace(/\/+$/, '');

const enLocal = typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

export const APP_URL = enLocal ? LOCAL : PUBLICA;
/** Dirección pública de la app sin «https://», para mostrarla en el video de lanzamiento. */
export const APP_DOMINIO = PUBLICA.replace(/^https?:\/\//, '');

/** Dirección completa de una pantalla de la app (rutas reales de Dataventura). */
export const app = (ruta: '/' | '/diagnostico' | '/diagnostico?tipo=completo' | '/login' | '/register' | '/ayuda' | '/terminos' | '/privacidad') =>
  `${APP_URL}${ruta === '/' ? '/' : ruta}`;

/** Otras páginas del sitio de Delhos, en el mismo dominio (mapa en ../herramientas/sitio.mjs). */
export const SITIO = {
  delhos: '/',
  academy: '/academy/',
  /** Portada de esta landing (sirve también desde las páginas internas). */
  inicio: import.meta.env.BASE_URL
};

/** Redes de Dataventura: vacías, no se muestran. Completar cuando existan las cuentas. */
export const REDES: { nombre: string; url: string }[] = [
  { nombre: 'Instagram', url: '' },
  { nombre: 'TikTok', url: '' },
  { nombre: 'LinkedIn', url: '' }
];

/** Correo público de contacto (el de Delhos, hasta que Dataventura tenga uno propio). */
export const CORREO = 'contacto@delhosacademy.cl';

/** Recursos de public/ con la ruta base (/dataventura/). */
export const recurso = (ruta: string) => `${import.meta.env.BASE_URL}${ruta.replace(/^\//, '')}`;
