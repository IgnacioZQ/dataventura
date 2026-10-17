// Datos fijos de la landing que no dependen del idioma (los textos están en src/i18n). Salen de la configuración
// oficial de la app (Dataventura/app: src/content/world.ts y CONTENIDO.md). No se inventan cifras.

/** Los 20 mapas, en orden de ruta, con los colores de su mar (paletas de world.ts). */
export const MARES = [
  { nombre: 'Archipiélago del Origen', mar: '#f7f4ff', ola: '#b8a4f5', ruta: '#7b4dff' },
  { nombre: 'Mar en Calma', mar: '#e8f6ff', ola: '#8fc4ee', ruta: '#2f7fd0' },
  { nombre: 'Arrecife de Coral', mar: '#dcf7f3', ola: '#6fcfc2', ruta: '#0e8d9c' },
  { nombre: 'Mar de Dunas', mar: '#f8e9c6', ola: '#d9b574', ruta: '#a8611e' },
  { nombre: 'Pantano de los Susurros', mar: '#e2efd4', ola: '#8fb37a', ruta: '#3f7a3a' },
  { nombre: 'Costa del Atardecer', mar: '#ffe6d6', ola: '#f2a27f', ruta: '#c9501a' },
  { nombre: 'Bancos de Niebla', mar: '#eceaf2', ola: '#b3aec6', ruta: '#6b6580' },
  { nombre: 'Fiordos de Hielo', mar: '#eaf7ff', ola: '#9fd3ee', ruta: '#2a86b8' },
  { nombre: 'Cañones Rojos', mar: '#f7dcc4', ola: '#d99a6c', ruta: '#8f3a1c' },
  { nombre: 'Manglar Profundo', mar: '#c5dbb8', ola: '#6f9a66', ruta: '#2d6431' },
  { nombre: 'Mar de Jade', mar: '#dff5e6', ola: '#7fcf9d', ruta: '#1f8a52' },
  { nombre: 'Islas de Ceniza', mar: '#e9e2e1', ola: '#b09a98', ruta: '#b23b1e' },
  { nombre: 'Aguas Oscuras', mar: '#1d2550', ola: '#4a5aa8', ruta: '#8fb4ff', oscuro: true },
  { nombre: 'Mar de las Tormentas', mar: '#3b3560', ola: '#7a70b8', ruta: '#cdbcff', oscuro: true },
  { nombre: 'Ventisca Polar', mar: '#243a5c', ola: '#6f9fc8', ruta: '#a8dcf5', oscuro: true },
  { nombre: 'Niebla Fantasma', mar: '#34364a', ola: '#7c7f9c', ruta: '#c9cde6', oscuro: true },
  { nombre: 'Fosa de Lava', mar: '#34191f', ola: '#8a3a33', ruta: '#ffb35c', oscuro: true },
  { nombre: 'Fosa Abisal', mar: '#0f1634', ola: '#34478f', ruta: '#b9a4ff', oscuro: true },
  { nombre: 'Ojo del Huracán', mar: '#2a3350', ola: '#6a7fb0', ruta: '#bcd0ff', oscuro: true },
  { nombre: 'Bahía del Tesoro', mar: '#fff3d2', ola: '#e9b949', ruta: '#b07d00' }
] as const;

/**
 * Las 5 dimensiones del diagnóstico, en el orden de la app, con su color (los nombres están en src/i18n).
 * `texto`: el mismo tono apenas más oscuro para letras chicas (y números blancos encima), con contraste AA
 * (≥ 4,5:1) contra blanco; en lectura y crítico el color original ya pasa.
 */
export const DIMENSIONES = [
  { id: 'lectura', color: '#7b4dff', texto: '#7b4dff', fondo: '#efe9ff' },
  { id: 'numeros', color: '#2f7fd0', texto: '#2a72bd', fondo: '#e8f6ff' },
  { id: 'estadistica', color: '#0e8d9c', texto: '#0c7f8c', fondo: '#dcf7f3' },
  { id: 'critico', color: '#c9501a', texto: '#c9501a', fondo: '#ffe6d6' },
  { id: 'decision', color: '#1f8a52', texto: '#1c824d', fondo: '#dff5e6' }
] as const;
