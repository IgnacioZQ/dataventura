// Datos del sitio que comparten varias pantallas.

/** Ruta donde se publica la Academy dentro del dominio de Delhos: "/academy/" (ver vite.config.js). */
const BASE = import.meta.env.BASE_URL;

export const LOGO_ACADEMY = `${BASE}marca/academy-logo.png`;
export const LOGO_ACADEMY_CIRCULAR = `${BASE}marca/academy-logo-circular.png`;

/** Correo público de la Academy: recibe los mensajes del formulario de contacto y las inscripciones. */
export const CORREO_CONTACTO = 'contacto@delhosacademy.cl';

/** Las otras páginas del ecosistema, en el mismo dominio (mapa en herramientas/sitio.mjs, en la raíz del repositorio). */
export const ECOSISTEMA = {
  delhos: '/',
  dataventura: '/dataventura/'
};
