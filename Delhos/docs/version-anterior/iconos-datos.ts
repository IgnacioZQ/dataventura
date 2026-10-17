// Íconos de la marca Delhos (sistema de diseño, grupo Iconos): trazo de 2px, estilo Lucide.
// Generado desde public/marca/iconos/*.svg; se dibujan en línea para heredar el color del texto.
export const ICONOS = {
  "certificado": "<circle cx=\"12\" cy=\"8\" r=\"6\"/><path d=\"M15.5 13 17 22l-5-3-5 3 1.5-9\"/>",
  "check": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m8 12 3 3 5-6\"/>",
  "chevron": "<path d=\"m6 9 6 6 6-6\"/>",
  "comunidad": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>",
  "contenido": "<path d=\"M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z\"/><path d=\"M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z\"/>",
  "correo": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/><path d=\"m2 7 10 7 10-7\"/>",
  "educacion": "<path d=\"M22 10 12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 2 9 2 12 0v-5\"/>",
  "energia": "<path d=\"M13 2 3 14h9l-1 8 10-12h-9z\"/>",
  "enlace-externo": "<path d=\"M7 7h10v10\"/><path d=\"M7 17 17 7\"/>",
  "flecha-abajo": "<path d=\"M12 5v14\"/><path d=\"m5 12 7 7 7-7\"/>",
  "flecha-arriba": "<path d=\"M12 19V5\"/><path d=\"m5 12 7-7 7 7\"/>",
  "flecha": "<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>",
  "innovacion": "<path d=\"M9 18h6\"/><path d=\"M10 22h4\"/><path d=\"M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z\"/>",
  "mensaje": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/>",
  "objetivo": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>",
  "online": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20\"/><path d=\"M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z\"/>",
  "orientacion": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z\"/>",
  "tecnologia": "<path d=\"m16 18 6-6-6-6\"/><path d=\"m8 6-6 6 6 6\"/>"
} as const;

export type NombreIcono = keyof typeof ICONOS;
