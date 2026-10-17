// Las composiciones de Remotion listas para la página (este módulo se carga aparte, con lazy()).
import { CursoPromo, PROMO } from '@/remotion/CursoPromo';
import { HeroLoop } from '@/remotion/HeroLoop';
import { LOGO_ACADEMY } from '@/config/sitio';
import Reproductor from './Reproductor';

/** Animación del hero: una clase en vivo, práctica con datos, retroalimentación y certificado (12 s en bucle). */
export function HeroAnimado() {
  return (
    <Reproductor component={HeroLoop} duracion={360} ancho={1200} alto={900} cuadroQuieto={150}
      etiqueta="Animación: una clase en vivo, práctica con datos reales, retroalimentación del instructor y certificado" />
  );
}

/** Video de presentación de un curso, armado con sus datos (20 s en bucle, con controles). */
export function PromoCurso({ curso }) {
  return (
    <Reproductor component={CursoPromo} controles duracion={PROMO.duracion} fps={PROMO.fps} ancho={PROMO.ancho} alto={PROMO.alto} cuadroQuieto={40}
      inputProps={{ titulo: curso.titulo, nivel: curso.nivel, inicio: curso.inicioLargo, modulos: curso.modulos.map(m => m.t), logo: LOGO_ACADEMY }} />
  );
}
