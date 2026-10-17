// Pie oscuro del sistema: frase de marca en display-l con la segunda parte en celeste, columnas con kicker.
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Ola } from '@/components/Fondos';
import { Contenedor, Firma, Icono } from '@/components/Piezas';
import { TextEffect } from '@/components/ui/motion-primitives/text-effect';
import { CORREO, SITIO } from '@/config';

const COLUMNAS = [
  { titulo: 'Productos', enlaces: [{ t: 'Dataventura', h: SITIO.dataventura, w: 'dv' }] },
  { titulo: 'Servicios', enlaces: [{ t: 'Delhos Academy', h: SITIO.academy, w: 'ac' }, { t: 'Cursos', h: SITIO.academyCursos, w: 'ac' }, { t: 'Webinars y workshops', h: SITIO.academyWebinars, w: 'ac' }, { t: 'Acceso estudiantes', h: SITIO.academyAcceso, w: 'ac' }] },
  { titulo: 'Delhos', enlaces: [{ t: 'Ecosistema', h: '#ecosistema' }, { t: 'El desafío', h: '#desafio' }, { t: 'Preguntas frecuentes', h: '#preguntas' }, { t: 'Contacto', h: '#contacto' }] }
];

export function Pie() {
  const frase = useRef<HTMLParagraphElement>(null);
  const visto = useInView(frase, { once: true, margin: '-60px' });
  return (
    <footer data-theme="dark" className="dh-oscuro relative overflow-hidden">
      <Ola color="#EFF6FF" semilla={41} alto={70} invertida />
      <div className="dh-trama absolute inset-0 top-[70px] opacity-30" aria-hidden />
      <Contenedor className="relative pt-12 pb-28">
        <p ref={frase} className="min-h-[2.2em] max-w-[20ch] font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.07] font-bold tracking-[-0.03em] text-white">
          <TextEffect as="span" per="word" preset="fade" className="block" trigger={visto}>Educación, tecnología e innovación,</TextEffect>
          <span className="text-celeste"><TextEffect as="span" per="word" preset="fade" delay={0.3} trigger={visto}>unidas para aprender distinto.</TextEffect></span>
        </p>
        <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Firma oscuro tam={40} />
            <p className="max-w-[36ch] text-[14px] leading-[22px] text-texto-suave">Un ecosistema de educación, tecnología e innovación para aprender a programar y a pensar con datos. 100% online, para todo el mundo de habla hispana.</p>
          </div>
          {COLUMNAS.map(c => (
            <nav key={c.titulo} aria-label={c.titulo} className="flex flex-col gap-2.5">
              <span className="dh-kicker !text-[11px] before:!hidden">{c.titulo}</span>
              {c.enlaces.map(e => (
                <a key={e.t} href={e.h} data-wipe={'w' in e ? e.w : undefined} className="w-fit text-[15px] font-semibold text-texto transition-colors hover:text-celeste">{e.t}</a>
              ))}
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-linea pt-6 text-[14px] text-texto-suave">
          <span>© {new Date().getFullYear()} Delhos. Todos los derechos reservados.</span>
          <a href={`mailto:${CORREO}`} className="flex items-center gap-2 font-semibold text-texto hover:text-celeste"><Icono nombre="correo" tam={18} />{CORREO}</a>
        </div>
      </Contenedor>
    </footer>
  );
}
