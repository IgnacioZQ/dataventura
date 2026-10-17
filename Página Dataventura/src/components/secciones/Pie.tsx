// Cierre (titular final con NEXUS y botón a la app) y pie con las columnas del diseño más el ecosistema Delhos.
// El pie se usa también en las subpáginas, por eso los anclajes apuntan siempre a la portada.
import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Limite } from '@/components/Limite';
import { Nexus } from '@/components/Nexus';
import { Contenedor } from '@/components/Piezas';
import { ShimmerLink } from '@/components/ui/watermelon/shimmer-button';
import { app, REDES, SITIO } from '@/config';
import { useIdioma } from '@/i18n/idioma';
import { Flecha } from './Instalar';

// El video de lanzamiento usa Remotion: se carga aparte, cuando el cierre está por aparecer.
const VideoLanzamiento = lazy(() => import('./VideoLanzamiento'));

export const PAGINAS = {
  quienes: `${SITIO.inicio}quienes-somos/`,
  como: `${SITIO.inicio}como-ensenamos/`,
  contacto: `${SITIO.inicio}contacto/`
};

type Enlace = { label: string; href: string; wipe?: string; externo?: boolean };

export function Cierre() {
  const { t } = useIdioma();
  return (
    <section className="relative overflow-hidden bg-dv py-16 text-white md:py-20">
      <svg aria-hidden className="absolute inset-0 size-full opacity-[.12]" preserveAspectRatio="none" viewBox="0 0 1440 400">
        <path d="M0 260 C240 200 480 320 720 250 C960 180 1200 300 1440 230 V400 H0 Z" fill="#fff" />
        <path d="M0 320 C300 270 520 380 800 320 C1080 260 1240 360 1440 300 V400 H0 Z" fill="#fff" />
      </svg>
      {/* minmax(0,1fr) + whitespace-normal en el botón: en 320 px el CTA ya no ensancha la columna ni corta el título. */}
      <Contenedor className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 md:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 flex-col items-center gap-6 text-center md:items-start md:text-left">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
            <Nexus pose="happy" tam={130} decorativo />
          </motion.div>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.02] text-balance">
            <span className="block">{t.ctaH1}</span><span className="block text-oro">{t.ctaH2}</span>
          </h2>
          <ShimmerLink href={app('/')} data-wipe="dv" className="oro brillo !min-h-[60px] max-w-full !px-8 whitespace-normal">{t.cierre.cta}<Flecha /></ShimmerLink>
        </div>
        {/* Si el archivo del video no llega, se omite solo el video (no toda la página). */}
        <Limite>
          <motion.figure initial={{ opacity: 0, y: 40, rotate: 3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="mx-auto m-0 flex w-[min(300px,78vw)] flex-col gap-3">
            <Suspense fallback={<div className="aspect-[9/16] w-full rounded-[28px] bg-dv-700" />}>
              <VideoLanzamiento etiqueta={t.cierre.videoAria} />
            </Suspense>
            {/* Blanco: lila-200 sobre el morado quedaba en 4,1:1. */}
            <figcaption className="text-center font-ui text-sm font-extrabold tracking-wide text-white">{t.cierre.video}{t.vidNote ? ` · ${t.vidNote}` : ''}</figcaption>
          </motion.figure>
        </Limite>
      </Contenedor>
    </section>
  );
}

export function Pie() {
  const { t } = useIdioma();
  const destinos: string[][] = [
    [PAGINAS.quienes, PAGINAS.como, PAGINAS.contacto],
    [`${SITIO.inicio}#etapas`, app('/'), app('/')],
    [`${SITIO.inicio}#preguntas`, app('/ayuda')],
    [app('/privacidad'), app('/terminos')]
  ];
  const redes = REDES.filter(r => r.url);
  const columnas: { h: string; l: Enlace[] }[] = (t.foot as { h: string; l: string[] }[]).slice(0, 4).map((c, ci) => ({
    h: c.h,
    l: c.l.map((label, li) => {
      const href = destinos[ci][li];
      return { label, href, wipe: href.startsWith('http') ? 'dv' : undefined };
    })
  }));
  if (redes.length) columnas.push({ h: t.foot[4].h, l: redes.map(r => ({ label: r.nombre, href: r.url, externo: true })) });
  columnas.push({ h: t.pie.ecosistema, l: [{ label: 'Delhos', href: SITIO.delhos, wipe: 'delhos' }, { label: 'Delhos Academy', href: SITIO.academy, wipe: 'ac' }] });

  return (
    <footer className="border-t-2 border-dv bg-dv-700 pt-12 pb-28 text-white">
      <Contenedor className="flex flex-col gap-11">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          {columnas.map(c => (
            <nav key={c.h} aria-label={c.h} className="flex flex-col gap-3">
              <span className="font-ui text-[19px] font-extrabold">{c.h}</span>
              {c.l.map(e => (
                <a key={e.label} href={e.href} data-wipe={e.wipe} target={e.externo ? '_blank' : undefined} rel={e.externo ? 'noopener' : undefined}
                  className="w-fit text-[15px] font-bold text-white/90 transition-colors hover:text-oro">{e.label}</a>
              ))}
            </nav>
          ))}
        </div>
        <div className="h-0.5 bg-dv" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href={`${SITIO.inicio}#inicio`} aria-label={t.logoAria} className="grid size-16 place-items-center rounded-full bg-white shadow-[0_4px_0_#3b2a6e] transition-transform hover:scale-105">
            <Nexus pose="idle" cabeza tam={54} decorativo />
          </a>
          {/* El año sale del reloj (el texto del diseño trae uno fijo). */}
          <span className="text-sm font-bold text-lila-200">{String(t.copy).replace(/\b\d{4}\b/, String(new Date().getFullYear()))} · <span translate="no">by Delhos</span></span>
        </div>
      </Contenedor>
    </footer>
  );
}
