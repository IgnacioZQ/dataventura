// Secciones del rediseño que se repiten en varias páginas: preguntas frecuentes y el llamado final en azul marino.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { A } from '@/components/rediseno/Marco';
import { Iman, Revelar } from '@/components/rediseno/Movimiento';
import { cuando, useCursos } from '@/lib/catalogo';
import { PREGUNTAS } from '@/lib/contenido-academy';

export function Preguntas({ titulo = 'Resolvemos tus dudas', lista = PREGUNTAS }) {
  const [abierta, setAbierta] = useState(0);
  return (
    <section className="sec border-t border-linea bg-white">
      <div className="wrap grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Revelar className="flex flex-col gap-4 lg:sticky lg:top-[120px]">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 className="h" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)' }}>{titulo}</h2>
          <p className="m-0 text-[17px] leading-relaxed text-texto">¿No encuentras lo que buscas? <A pagina="Contacto" className="font-semibold">Escríbenos</A>.</p>
        </Revelar>
        <Revelar className="border-t border-tinta">
          {lista.map((f, i) => {
            const abierto = abierta === i;
            return (
              <div key={f.q} className="border-b border-linea">
                <h3 className="m-0">
                  <button type="button" className="faqb" onClick={() => setAbierta(abierto ? -1 : i)} aria-expanded={abierto} aria-controls={abierto ? `faq-${i}` : undefined}>
                    {f.q}
                    <motion.span aria-hidden animate={{ rotate: abierto ? 45 : 0, backgroundColor: abierto ? '#1E3A5F' : '#EEF1F4', color: abierto ? '#FFFFFF' : '#4A5563' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="flex size-8 flex-none items-center justify-center rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {abierto && (
                    <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden">
                      <p className="m-0 pb-[22px] pr-12 leading-[1.7] text-texto">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Revelar>
      </div>
    </section>
  );
}

export function Llamado({ titulo, texto = 'Postular no te compromete a pagar. Te escribimos para confirmar tu cupo.' }) {
  const { cursos } = useCursos();
  const proximo = cursos.filter(c => c.abierto && c.inicioLargo).sort((a, b) => a.inicioFecha - b.inicioFecha)[0];
  return (
    <>
      <svg className="block h-10 w-full bg-marino sm:h-20" aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0 0h1440v28c-200 44-420 56-700 24S220 6 0 44z" fill="#FFFFFF" /></svg>
      <section className="relative overflow-hidden bg-marino pb-[104px] pt-[72px] text-white">
        <svg aria-hidden="true" viewBox="0 0 600 400" className="absolute -right-20 -top-[60px] h-[420px] w-[640px]"><defs><filter id="cb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70" /></filter></defs><circle className="blob" filter="url(#cb)" cx="300" cy="200" r="170" fill="#2E6DB4" opacity="0.5" /></svg>
        <Revelar className="wrap relative flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[620px] flex-col gap-3.5">
            <h2 className="h !text-white" style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}>{titulo ?? (proximo ? `La próxima cohorte comienza ${cuando(proximo.inicioLargo)}` : 'Postulaciones abiertas para las próximas cohortes')}</h2>
            <p className="m-0 text-lg leading-relaxed text-[#C7D2DE]">{texto}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Iman><A pagina="Inscripcion" query={proximo ? `?curso=${proximo.id}` : ''} className="btn btn-w !min-h-[52px] !px-[26px] active:scale-[0.98]">Postular ahora <span className="arr" aria-hidden>→</span></A></Iman>
            <A pagina="Cursos" className="inline-flex min-h-11 items-center font-semibold !text-white underline underline-offset-[5px] hover:decoration-2">Ver cursos</A>
          </div>
        </Revelar>
      </section>
    </>
  );
}
