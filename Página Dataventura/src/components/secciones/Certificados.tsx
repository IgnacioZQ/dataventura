// 10 · Certificados de Delhos Academy: tarjeta con inclinación (Tilt), brillo (Glow Effect) y código que se descifra.
import { BadgeCheck, FileDown, Share2 } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import { Contenedor } from '@/components/Piezas';
import { GlowEffect } from '@/components/ui/motion-primitives/glow-effect';
import { TextScramble } from '@/components/ui/motion-primitives/text-scramble';
import { Tilt } from '@/components/ui/motion-primitives/tilt';
import { SITIO } from '@/config';
import { useIdioma } from '@/i18n/idioma';

export function Certificados() {
  const { t } = useIdioma();
  const c = t.cert;
  const [descifrar, setDescifrar] = useState(false);
  // El brillo de colores anima el fondo de una capa desenfocada en bucle: solo a la vista y sin «reducir movimiento».
  const reducir = useReducedMotion();
  const caja = useRef<HTMLDivElement>(null);
  const aLaVista = useInView(caja);
  return (
    <section id="certificados" className="bg-white py-16 md:py-20">
      <Contenedor className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }} className="flex flex-col items-start gap-4">
          <span className="pildora"><b>10</b>{c.pill}</span>
          <h2 className="titulo-seccion text-tinta">{c.h1} <span className="text-dv">{c.h2}</span></h2>
          <p className="text-lg font-semibold text-suave">{c.p}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {[BadgeCheck, Share2, FileDown].map((Icono, i) => (
              <li key={i} className="flex items-start gap-3 font-bold text-suave"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-lila-200 text-dv-700"><Icono className="size-5" /></span>{c.bullets[i]}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-semibold text-gris">{c.premium} <a href={SITIO.academy} data-wipe="ac" className="font-extrabold text-dv-700 underline decoration-2 underline-offset-4 transition-colors hover:text-dv">{c.academy}</a></p>
        </motion.div>

        <div ref={caja} className="relative mx-auto w-full max-w-[500px]" onPointerEnter={() => setDescifrar(true)} onFocus={() => setDescifrar(true)}>
          <GlowEffect colors={['#7b4dff', '#ffd166', '#a98bff', '#2fbf8a']} mode={reducir || !aLaVista ? 'static' : 'colorShift'} blur="strong" className="rounded-[34px] opacity-50" />
          <Tilt rotationFactor={10} className="relative">
            <div className="relative overflow-hidden rounded-[30px] border-4 border-tinta bg-white p-7 shadow-[0_12px_0_#7b4dff] sm:p-9">
              <p translate="no" className="font-ui text-xs font-extrabold tracking-[.18em] text-dv-700">{c.tarjeta.marca}</p>
              <p className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-none text-tinta">{c.tarjeta.titulo}</p>
              <p className="mt-4 font-bold text-suave">{c.tarjeta.certifica}</p>
              <p className="font-display text-2xl text-tinta">{c.tarjeta.nombre}</p>
              <p className="mt-1 font-bold text-suave">{c.tarjeta.completo1} <span className="text-dv">{c.tarjeta.etapa}</span> {c.tarjeta.completo2}</p>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="font-ui text-[11px] font-extrabold tracking-[.14em] text-gris">{c.tarjeta.codigo}</p>
                  <div translate="no">
                    <TextScramble as="p" trigger={descifrar} duration={1.2} characterSet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789" className="font-mono text-xl font-bold text-tinta sm:text-2xl">DV-7K2P-Q9XM</TextScramble>
                  </div>
                </div>
                <div translate="no" className="grid size-24 shrink-0 rotate-[-10deg] place-items-center rounded-full border-[6px] border-oro bg-dv text-center font-display text-[15px] leading-tight text-white shadow-[0_5px_0_#5a30d6]">Delhos<br />Academy</div>
              </div>
            </div>
          </Tilt>
        </div>
      </Contenedor>
    </section>
  );
}
