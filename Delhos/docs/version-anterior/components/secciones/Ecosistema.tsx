// Banda de temas + El ecosistema Delhos: pilares (TarjetaPilar), el video de marca y una ficha por plataforma,
// cada una con su propio color (las submarcas aparecen como destinos, con su logo y color).
import { motion } from 'motion/react';
import { lazy, Suspense } from 'react';
import { Mancha } from '@/components/Fondos';
import { Contenedor, Encabezado, Icono, Revelar } from '@/components/Piezas';
import { InfiniteSlider } from '@/components/ui/motion-primitives/infinite-slider';
import { Spotlight } from '@/components/ui/motion-primitives/spotlight';
import { recurso, SITIO } from '@/config';
import { ACADEMY, DATAVENTURA, PILARES, TEMAS } from '@/contenido';

export function BandaTemas() {
  return (
    <div className="bg-superficie-alt pt-2 pb-10" aria-label="Temas que se aprenden en Delhos">
      <InfiniteSlider gap={28} speed={38} speedOnHover={12}>
        {TEMAS.map(t => (
          <span key={t} className="flex items-center gap-3 font-display text-[22px] font-semibold tracking-[-0.02em] whitespace-nowrap text-tinta">
            <span className="size-2 rounded-full bg-chispa" aria-hidden />{t}
          </span>
        ))}
      </InfiniteSlider>
    </div>
  );
}

// El video de Remotion se carga aparte, cuando la sección lo necesita.
const Video = lazy(() => import('@/components/VideoMarca'));

function Ficha({ tipo, nombre, logo, colores, estado, tag, descripcion, chips, rasgos, cta, wipe, extra, arte }: {
  tipo: string; nombre: string; logo: string; colores: [string, string]; estado: string; tag: string; descripcion: string;
  chips: string[]; rasgos: { titulo: string; texto: string }[]; cta: { texto: string; href: string }; wipe: 'ac' | 'dv';
  extra?: { texto: string; href: string }; arte: string;
}) {
  return (
    <article className="dh-tarjeta is-viva relative flex flex-col overflow-hidden">
      <Spotlight className="from-[rgba(147,197,253,.35)] via-[rgba(147,197,253,.12)] to-transparent" size={300} />
      <div className="relative overflow-hidden px-6 pt-6 pb-0 text-white" style={{ background: `linear-gradient(135deg, ${colores[0]}, ${colores[1]})` }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[.14em] text-white/80 uppercase">{tipo}</span>
          <span className="rounded-full bg-white/18 px-3 py-1 font-mono text-[11px] tracking-[.1em] uppercase">{estado}</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <img src={recurso(logo)} alt="" className="size-14 rounded-2xl shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)]" />
          <h3 className="font-display text-[30px] leading-none font-bold tracking-[-0.025em]">{nombre}</h3>
        </div>
        <p className="mt-3 max-w-[40ch] font-semibold text-white/90">{tag}</p>
        <div className="mx-auto mt-5 h-[150px] w-[88%] overflow-hidden rounded-t-[18px] border border-b-0 border-white/20 bg-white/10">
          <img src={recurso(arte)} alt="" className="w-full object-cover object-top" loading="lazy" />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-5 p-6">
        <p className="text-texto">{descripcion}</p>
        <ul className="flex flex-wrap gap-2" aria-label={`Temas de ${nombre}`}>
          {chips.map(c => <li key={c} className="dh-insignia normal-case tracking-normal" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600 }}>{c}</li>)}
        </ul>
        <ul className="grid gap-4 sm:grid-cols-2">
          {rasgos.map(r => (
            <li key={r.titulo} className="flex gap-3">
              <span className="mt-0.5 text-exito"><Icono nombre="check" tam={20} /></span>
              <span><b className="block font-bold text-tinta">{r.titulo}</b><span className="text-[14px] leading-[22px] text-texto-suave">{r.texto}</span></span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
          <a href={cta.href} data-wipe={wipe} className="dh-btn">{cta.texto}<Icono nombre="flecha" tam={18} className="dh-flecha" /></a>
          {extra && <a href={extra.href} data-wipe={wipe} className="dh-btn is-texto">{extra.texto}<Icono nombre="flecha" tam={18} className="dh-flecha" /></a>}
        </div>
      </div>
    </article>
  );
}

export function Ecosistema() {
  return (
    <section id="ecosistema" className="relative overflow-hidden bg-fondo py-20 sm:py-[120px]">
      <div className="dh-trama-clara absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_35%)]" aria-hidden />
      <Mancha color="rgba(147,197,253,.18)" semilla={23} tam={560} className="-top-40 -left-40" />
      <Contenedor className="relative">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <Encabezado kicker="El ecosistema Delhos" titulo="Educación, tecnología e innovación," destacado="unidas para aprender distinto." />
          <Revelar retraso={1}><p className="dh-lead">Delhos reúne tres mundos para crear formas innovadoras de aprender ciencia de datos, inteligencia artificial y más. De esa unión nacen un servicio y un producto: Delhos Academy, para aprender en vivo con instructores, y Dataventura, para entrenar el pensamiento con datos jugando unos minutos al día.</p></Revelar>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {PILARES.map((p, i) => (
            <Revelar as="li" key={p.nombre} retraso={i} className="dh-tarjeta is-viva relative flex items-start gap-4 p-6">
              <Spotlight className="from-[rgba(147,197,253,.35)] via-[rgba(147,197,253,.12)] to-transparent" size={220} />
              <span className="dh-pilar-ico relative"><Icono nombre={p.icono} tam={24} /></span>
              <div className="relative"><h3 className="dh-h3">{p.nombre}</h3><p className="mt-1 text-texto">{p.texto}</p></div>
            </Revelar>
          ))}
        </ul>

        <Revelar className="mx-auto mt-14 max-w-[960px]">
          <Suspense fallback={<div className="aspect-video rounded-[32px] bg-noche" />}><Video /></Suspense>
        </Revelar>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <motion.div id="productos" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.35, ease: 'easeOut' }} className="scroll-mt-24">
            <Ficha tipo="Productos" nombre="Dataventura" logo="assets/dataventura/dataventura-icon.svg" colores={['#5a30d6', '#7b4dff']} estado="Nuevo"
              tag={DATAVENTURA.tag} descripcion={DATAVENTURA.descripcion} chips={DATAVENTURA.chips} rasgos={DATAVENTURA.rasgos}
              cta={{ texto: 'Conocer Dataventura', href: SITIO.dataventura }} wipe="dv" arte="assets/dataventura/app-mapa.webp" />
          </motion.div>
          <motion.div id="servicios" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }} className="scroll-mt-24">
            <Ficha tipo="Servicios" nombre="Delhos Academy" logo="assets/academy/academy-logo-192.png" colores={['#1E3D59', '#2B7CB3']} estado="Disponible"
              tag={ACADEMY.tag} descripcion={ACADEMY.descripcion} chips={ACADEMY.chips} rasgos={ACADEMY.rasgos}
              cta={{ texto: 'Ver cursos', href: SITIO.academyCursos }} extra={{ texto: 'Webinars y workshops', href: SITIO.academyWebinars }} wipe="ac" arte="assets/academy/academy-inicio.webp" />
          </motion.div>
        </div>
      </Contenedor>
    </section>
  );
}
