// Preguntas frecuentes con el Accordion de Motion Primitives; NEXUS "piensa" mientras tanto.
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Nexus } from '@/components/Nexus';
import { Contenedor } from '@/components/Piezas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/motion-primitives/accordion';
import { useIdioma } from '@/i18n/idioma';

export function Preguntas() {
  const { t } = useIdioma();
  return (
    <section id="preguntas" className="relative bg-lila-100 py-16 md:py-24">
      <Contenedor className="grid gap-12 lg:grid-cols-[320px_1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center lg:sticky lg:top-28 lg:self-start lg:items-start lg:text-left">
          <span className="pildora"><b>?</b>{t.faq.pill}</span>
          <h2 className="titulo-seccion mt-4 text-dv">{t.faq.h}</h2>
          <div className="mt-6"><Nexus pose="think" tam={140} decorativo /></div>
        </motion.div>

        <Accordion key={t.langName} className="flex flex-col gap-3" transition={{ type: 'spring', stiffness: 160, damping: 22 }} variants={{ expanded: { opacity: 1, scale: 1 }, collapsed: { opacity: 0, scale: 0.98 } }}>
          {t.faq.items.map((q, i) => (
            <AccordionItem key={i} value={i} className="tarjeta overflow-hidden">
              {/* foco-dentro: la tarjeta recorta lo que sobresale, así que el anillo de foco va hacia adentro. */}
              <AccordionTrigger className="foco-dentro flex min-h-16 w-full items-center justify-between gap-4 rounded-[22px] px-5 py-4 text-left">

                <span className="font-ui text-lg font-extrabold text-tinta">{q.p}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-lila-200 text-dv transition-transform duration-300 group-data-expanded:rotate-45 group-data-expanded:bg-dv group-data-expanded:text-white">
                  <Plus className="size-5" strokeWidth={3} />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <p className="leading-relaxed font-semibold text-suave">{q.r}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Contenedor>
    </section>
  );
}
