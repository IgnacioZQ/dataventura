import { Contenedor, Encabezado, Icono } from '@/components/Piezas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/motion-primitives/accordion';
import { SITIO } from '@/config';
import { PREGUNTAS } from '@/contenido';

export function Preguntas() {
  return (
    <section id="preguntas" className="relative bg-fondo py-20 sm:py-[120px]">
      <Contenedor className="grid gap-12 lg:grid-cols-[380px_1fr] lg:gap-[72px]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Encabezado kicker="Preguntas frecuentes" titulo="Lo que más" destacado="nos preguntan." bajada="Si no encuentras tu respuesta, escríbenos: te respondemos a la brevedad." />
          <a href="#contacto" className="dh-btn is-secundario mt-6">Conversemos<Icono nombre="flecha" tam={18} className="dh-flecha" /></a>
        </div>

        <Accordion className="flex flex-col gap-3" transition={{ duration: 0.3, ease: 'easeOut' }} variants={{ expanded: { opacity: 1, y: 0 }, collapsed: { opacity: 0, y: -6 } }}>
          {PREGUNTAS.map((q, i) => (
            <AccordionItem key={q.p} value={i} className="dh-tarjeta overflow-hidden">
              <AccordionTrigger className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="dh-h3 !text-[19px] !leading-[26px]">{q.p}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-superficie-alt text-enlace transition-transform duration-300 group-data-expanded:rotate-180 group-data-expanded:bg-azul group-data-expanded:text-white">
                  <Icono nombre="chevron" tam={18} />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p className="max-w-[60ch] text-texto">{q.r}</p>
                {'enlace' in q && q.enlace && (
                  <a href={SITIO[q.enlace.destino]} data-wipe={q.enlace.wipe} className="dh-btn is-texto mt-1">{q.enlace.texto}<Icono nombre="flecha" tam={18} className="dh-flecha" /></a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Contenedor>
    </section>
  );
}
