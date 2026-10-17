import { MotionConfig } from 'motion/react';
import { lazy, Suspense, useMemo } from 'react';
import { Limite } from '@/components/Limite';
import { Barrido } from '@/components/Piezas';
import { Certificados } from '@/components/secciones/Certificados';
import { Diagnostico } from '@/components/secciones/Diagnostico';
import { Dimensiones } from '@/components/secciones/Dimensiones';
import { Encabezado, Saltar } from '@/components/secciones/Encabezado';
import { SeccionEtapas } from '@/components/secciones/Etapas';
import { Instalar } from '@/components/secciones/Instalar';
import { Cierre, Pie } from '@/components/secciones/Pie';
import { Portada } from '@/components/secciones/Portada';
import { Preguntas } from '@/components/secciones/Preguntas';
import { Pruebalo } from '@/components/secciones/Pruebalo';
import { Cinta, Retos } from '@/components/secciones/Retos';
import { Tutorial } from '@/components/secciones/Tutorial';
import { ScrollIsland } from '@/components/ui/watermelon/scroll-island';
import { app } from '@/config';
import { ProveedorIdioma, useIdioma, useSeo } from '@/i18n/idioma';

// El video de Remotion pesa más: se carga aparte, después de la portada.
const Trailer = lazy(() => import('@/components/secciones/Trailer').then(m => ({ default: m.Trailer })));

// Tramos del índice flotante, en el orden de la página (el número es la posición del título en t.indice).
const TRAMOS: [string, number][] = [['aprende', 0], ['partida', 1], ['etapas', 2], ['pruebalo', 4], ['dimensiones', 3], ['diagnostico', 5], ['certificados', 6], ['instalar', 7], ['preguntas', 8]];

function Landing() {
  const { t, locale } = useIdioma();
  useSeo(t.seo.titulo, t.seo.descripcion);
  const tramos = useMemo(() => TRAMOS.map(([id, i]) => ({ id, title: t.indice[i] })), [t]);
  return (
    <>
      <Saltar />
      <Encabezado />
      <main id="contenido">
        <Portada />
        <Cinta />
        <Retos />
        {/* Si el archivo del video no llega, se omite solo esta sección. */}
        <Limite>
          <Suspense fallback={<div className="h-[640px] bg-white" />}><Trailer /></Suspense>
        </Limite>
        <SeccionEtapas />
        <Pruebalo />
        <Dimensiones />
        <Diagnostico />
        <Certificados />
        <Instalar />
        <Tutorial />
        <Preguntas />
        <Cierre />
      </main>
      <Pie />
      <ScrollIsland topics={tramos} cta={{ href: app('/'), label: t.indiceCta }} textos={t.isla} locale={locale} />
      <Barrido />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ProveedorIdioma>
        <Landing />
      </ProveedorIdioma>
    </MotionConfig>
  );
}
