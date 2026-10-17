// Idioma del sitio (español, inglés o portugués), como en el diseño: se elige en el menú y se recuerda en el navegador.
import { createContext, type ReactNode, useContext, useLayoutEffect, useState } from 'react';
import { type Idioma, IDIOMAS, TEXTOS, type Textos } from './textos';

const CLAVE = 'dv_idioma';

/** Etiqueta de idioma para `lang` y para `Intl` (números, porcentajes). */
const LOCALES: Record<Idioma, string> = { es: 'es-CL', en: 'en', pt: 'pt-BR' };

function inicial(): Idioma {
  try {
    const guardado = localStorage.getItem(CLAVE) as Idioma | null;
    if (guardado && TEXTOS[guardado]) return guardado;
  } catch { /* sin almacenamiento */ }
  // El primero de los idiomas preferidos del navegador que el sitio tenga (no solo el principal).
  const preferidos = typeof navigator === 'undefined' ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];
  const elegido = preferidos.map(l => (l || '').slice(0, 2).toLowerCase()).find((l): l is Idioma => l === 'es' || l === 'en' || l === 'pt');
  return elegido ?? 'es';
}

const Contexto = createContext<{ idioma: Idioma; locale: string; t: Textos; cambiar: (i: Idioma) => void }>({ idioma: 'es', locale: 'es-CL', t: TEXTOS.es, cambiar: () => {} });

export function ProveedorIdioma({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(inicial);
  // Antes de pintar, para que el primer cuadro ya tenga el idioma correcto (lectores de pantalla, guiones).
  useLayoutEffect(() => {
    document.documentElement.lang = LOCALES[idioma];
  }, [idioma]);
  const cambiar = (i: Idioma) => {
    setIdioma(i);
    try { localStorage.setItem(CLAVE, i); } catch { /* sin almacenamiento */ }
  };
  return <Contexto.Provider value={{ idioma, locale: LOCALES[idioma], t: TEXTOS[idioma] as Textos, cambiar }}>{children}</Contexto.Provider>;
}

export const useIdioma = () => useContext(Contexto);

/** Título de la pestaña y meta description en el idioma elegido. */
export function useSeo(titulo: string, descripcion: string) {
  useLayoutEffect(() => {
    document.title = titulo;
    document.querySelector('meta[name="description"]')?.setAttribute('content', descripcion);
  }, [titulo, descripcion]);
}

export { IDIOMAS };
