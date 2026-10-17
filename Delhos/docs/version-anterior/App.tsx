import { MotionConfig } from 'motion/react';
import { Barrido } from '@/components/Piezas';
import { Contacto } from '@/components/secciones/Contacto';
import { Desafio } from '@/components/secciones/Desafio';
import { BandaTemas, Ecosistema } from '@/components/secciones/Ecosistema';
import { Navegacion } from '@/components/secciones/Navegacion';
import { Pie } from '@/components/secciones/Pie';
import { Portada } from '@/components/secciones/Portada';
import { Preguntas } from '@/components/secciones/Preguntas';
import { ScrollIsland } from '@/components/ui/watermelon/scroll-island';

// Orden pedido por el usuario: portada → el ecosistema → el desafío → preguntas frecuentes → contacto.
const SECCIONES = [
  { id: 'ecosistema', title: 'El ecosistema Delhos' },
  { id: 'desafio', title: 'El desafío' },
  { id: 'preguntas', title: 'Preguntas frecuentes' },
  { id: 'contacto', title: 'Contacto' }
];

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-noche focus:px-4 focus:py-3 focus:font-bold focus:text-white">Saltar al contenido</a>
      <Navegacion />
      <main id="contenido">
        <Portada />
        <BandaTemas />
        <Ecosistema />
        <Desafio />
        <Preguntas />
        <Contacto />
      </main>
      <Pie />
      <ScrollIsland topics={SECCIONES} cta={{ href: '#contacto', label: 'Conversemos' }} />
      <Barrido />
    </MotionConfig>
  );
}
