// Los formularios públicos (contacto e inscripción) no tienen servidor de correo: arman el mensaje y abren
// la aplicación de correo de la persona, dirigido al correo de la Academy.
import { CORREO_CONTACTO } from '@/config/sitio';

/**
 * @param {string} asunto
 * @param {Array<[string, string]>} campos pares [etiqueta, valor]; los vacíos se omiten
 */
export function abrirCorreo(asunto, campos) {
  const cuerpo = campos
    .filter(([, valor]) => valor && String(valor).trim())
    .map(([etiqueta, valor]) => `${etiqueta}: ${String(valor).trim()}`)
    .join('\n');
  const enlace = `mailto:${CORREO_CONTACTO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = enlace;
}
