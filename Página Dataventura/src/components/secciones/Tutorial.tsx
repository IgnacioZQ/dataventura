// Video tutorial: cómo dejar Dataventura en la pantalla de inicio. El video se reproduce solo, sin sonido,
// cuando está a la vista (y nunca solo si la persona pidió reducir el movimiento).
import { motion, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Contenedor } from '@/components/Piezas';
import { ShimmerLink } from '@/components/ui/watermelon/shimmer-button';
import { app, recurso } from '@/config';
import { useIdioma } from '@/i18n/idioma';
import { Flecha } from './Instalar';

export function Tutorial() {
  const { t } = useIdioma();
  const video = useRef<HTMLVideoElement>(null);
  const visible = useInView(video, { margin: '-20% 0px' });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible && !matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
    else v.pause();
  }, [visible]);

  return (
    // overflow-x-clip: el halo de 360 px ensanchaba la página en teléfonos de 320 px (el navegador la alejaba).
    <section id="tutorial" className="overflow-x-clip bg-dv-700 pt-10 pb-18 text-white md:pb-20">
      <Contenedor className="flex flex-wrap-reverse items-center justify-center gap-x-16 gap-y-10">
        <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
          className="relative flex flex-[0_1_320px] justify-center">
          <div aria-hidden className="absolute top-1/2 left-1/2 size-[360px] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,209,102,.35),transparent_70%)]" />
          <div className="relative w-[300px] max-w-full rounded-[40px] bg-tinta p-2.5 shadow-[0_10px_0_#3b2a6e,0_30px_60px_rgba(27,18,48,.35)]">
            <video ref={video} poster={recurso('media/tutorial-instalar-poster.jpg')} width={280} height={498} muted loop playsInline controls preload="metadata"
              aria-label={t.vidAria} className="block aspect-[9/16] h-auto w-full rounded-[30px] bg-dv object-cover">
              <source src={recurso('media/tutorial-instalar.webm')} type="video/webm" />
              <source src={recurso('media/tutorial-instalar.mp4')} type="video/mp4" />
              {t.tutorial.sinVideo}
            </video>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55 }}
          className="flex max-w-[460px] flex-[1_1_340px] flex-col gap-[18px]">
          <span className="pildora self-start !border-white/20 !bg-white/15 !text-white">
            <b className="!bg-oro"><svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><path d="M7 4l13 8-13 8z" fill="#1b1230" /></svg></b>{t.vidPill}
          </span>
          <h2 className="titulo-seccion text-white">{t.vidH}</h2>
          <p className="text-lg leading-relaxed font-semibold text-lila-200">{t.vidP}</p>
          <ShimmerLink href={app('/')} data-wipe="dv" className="oro brillo self-start !min-h-[56px] !px-6">{t.open}<Flecha /></ShimmerLink>
          {/* lila-200 sobre morado marino: 6,3:1 (lila-300 quedaba en 4,3:1). */}
          {t.vidNote && <span className="text-sm font-bold text-lila-200">{t.vidNote}</span>}
        </motion.div>
      </Contenedor>
    </section>
  );
}
