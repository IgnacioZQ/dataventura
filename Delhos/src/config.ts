// Enlaces de Delhos al resto del sitio: rutas del mismo dominio (mapa en ../herramientas/sitio.mjs),
// así funcionan igual en local (npm start en la raíz) y publicadas.
export const SITIO = {
  academy: 'academy/',
  academyCursos: 'academy/Cursos',
  academyWebinars: 'academy/Webinars',
  academyNosotros: 'academy/Nosotros',
  academyAcceso: 'academy/Acceso',
  dataventura: 'dataventura/'
};

export const CORREO = 'contacto@delhosacademy.cl';

/** Recursos de public/. */
export const recurso = (ruta: string) => `${import.meta.env.BASE_URL}${ruta.replace(/^\//, '')}`;
