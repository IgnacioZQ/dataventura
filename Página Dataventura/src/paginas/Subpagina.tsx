// Subpáginas del diseño (Quiénes somos, Cómo enseñamos, Contacto): encabezado con vuelta a la portada y
// selector de idioma, NEXUS en una pose distinta en cada una, contenido traducido y el mismo pie de la landing.
import { ArrowLeft, LifeBuoy, Mail } from 'lucide-react';
import { motion, MotionConfig } from 'motion/react';
import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Nexus, type Pose } from '@/components/Nexus';
import { Barrido } from '@/components/Piezas';
import { Saltar, SelectorIdioma } from '@/components/secciones/Encabezado';
import { Pie } from '@/components/secciones/Pie';
import { app, CORREO, REDES, SITIO } from '@/config';
import { ProveedorIdioma, useIdioma, useSeo } from '@/i18n/idioma';
import '@/index.css';

type Clave = 'quienes' | 'como' | 'contacto';

const aparece = { oculto: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

function Marco({ clave, pose, children }: { clave: Clave; pose: Pose; children: ReactNode }) {
  const { t } = useIdioma();
  const p = t.paginas[clave];
  // Título de la pestaña y meta description en el idioma elegido.
  useSeo(`${p.h1} · Dataventura`, t.seo.paginas[clave]);
  return (
    <>
      <Saltar />
      <header className="sticky top-0 z-50 border-b-2 border-borde bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[880px] items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <a href={SITIO.inicio} className="group flex min-h-11 items-center gap-2.5 rounded-xl font-ui text-sm font-extrabold text-gris transition-colors hover:text-dv-700">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" strokeWidth={3} />
            <Nexus pose="idle" cabeza tam={44} decorativo />
            <span>{p.back}</span>
          </a>
          <SelectorIdioma />
        </div>
      </header>
      <main id="contenido" className="bg-lila-100">
        <motion.div initial="oculto" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mx-auto flex max-w-[880px] flex-col gap-7 px-4 pt-14 pb-18 sm:px-5">
          <motion.div variants={aparece} className="flex flex-wrap items-center gap-6">
            <Nexus pose={pose} tam={130} decorativo />
            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
              <h1 className="font-display text-[clamp(2.25rem,6vw,3.25rem)] leading-[1.05] text-balance text-dv">{p.h1}</h1>
              <p className="text-[19px] leading-relaxed font-bold text-suave">{p.lead}</p>
            </div>
          </motion.div>
          {children}
        </motion.div>
      </main>
      <Pie />
      <Barrido />
    </>
  );
}

const tarjeta = 'rounded-[22px] border-2 border-borde bg-white shadow-[0_4px_0_#e5e0f2]';

function Quienes() {
  const { t } = useIdioma();
  const p = t.paginas.quienes;
  return (
    <Marco clave="quienes" pose="hello">
      <motion.div variants={aparece} className={`${tarjeta} px-6 py-6 sm:px-7`}>
        <p className="text-[17px] leading-[1.65] font-semibold text-suave">{p.body}</p>
      </motion.div>
      <div className="grid gap-3.5 sm:grid-cols-3">
        {p.values.map((v, i) => (
          <motion.div key={v.h} variants={aparece} whileHover={{ y: -4 }} className={`${tarjeta} flex flex-col gap-1.5 px-5 py-[18px]`}>
            {/* Tonos -700 de verde y coral: el número blanco sobre los tonos claros quedaba en 2,4:1 y 3,4:1. */}
            <span className="mb-1 grid size-9 place-items-center rounded-xl font-display text-lg text-white" style={{ background: ['#167a55', '#7b4dff', '#bd3752'][i] }}>{i + 1}</span>
            <span className="font-ui text-lg font-extrabold text-tinta">{v.h}</span>
            <span className="text-[15px] leading-normal font-semibold text-gris">{v.p}</span>
          </motion.div>
        ))}
      </div>
      <motion.div variants={aparece} className="flex flex-col gap-3">
        <h2 className="font-display text-[30px] text-tinta">{p.teamH}</h2>
        <a href={SITIO.delhos} data-wipe="delhos" className="flex items-center gap-4 rounded-[20px] border-2 border-dashed border-lila-300 bg-white px-5 py-[18px] transition-colors hover:border-dv">
          <img src="/marca/delhos-icono-app.svg" alt="" width={56} height={56} className="size-14 shrink-0 rounded-full bg-lila-200" />
          <span className="flex flex-col gap-1">
            <span className="font-ui text-[17px] font-extrabold text-tinta">{p.teamName}</span>
            <span className="text-[15px] font-semibold text-gris">{p.teamBio}</span>
          </span>
        </a>
      </motion.div>
    </Marco>
  );
}

function Como() {
  const { t } = useIdioma();
  return (
    <Marco clave="como" pose="think">
      <ol className="flex flex-col gap-3.5">
        {(t.paginas.como.steps as string[][]).map(([h, texto], i) => (
          <motion.li key={h} variants={aparece} className={`${tarjeta} flex items-start gap-4 px-5 py-[18px]`}>
            <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-dv font-display text-[22px] text-white shadow-[0_4px_0_#5a30d6]">{i + 1}</span>
            <span className="flex flex-col gap-1.5">
              <span className="font-ui text-[19px] font-extrabold text-tinta">{h}</span>
              <span className="leading-relaxed font-semibold text-suave">{texto}</span>
            </span>
          </motion.li>
        ))}
      </ol>
      <motion.a variants={aparece} href={app('/diagnostico')} data-wipe="dv" className="btn-juego brillo max-w-full self-start !min-h-[56px] !px-6 whitespace-normal">{t.diag.expres.cta}</motion.a>
    </Marco>
  );
}

function Contacto() {
  const { t } = useIdioma();
  const p = t.paginas.contacto;
  const redes = REDES.filter(r => r.url);
  return (
    <Marco clave="contacto" pose="happy">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <motion.a variants={aparece} whileHover={{ y: -4 }} href={`mailto:${CORREO}`} className={`${tarjeta} flex flex-col gap-1.5 p-5`}>
          <span className="flex items-center gap-2 font-ui text-[13px] font-extrabold tracking-[.1em] text-dv-700"><Mail className="size-4" strokeWidth={3} />{p.mailH}</span>
          <span className="font-ui text-xl font-extrabold break-all text-tinta">{CORREO}</span>
          <span className="text-[15px] font-semibold text-gris">{p.mailP}</span>
        </motion.a>
        <motion.a variants={aparece} whileHover={{ y: -4 }} href={app('/ayuda')} data-wipe="dv" className={`${tarjeta} flex flex-col gap-1.5 p-5`}>
          <span className="flex items-center gap-2 font-ui text-[13px] font-extrabold tracking-[.1em] text-dv-700 uppercase"><LifeBuoy className="size-4" strokeWidth={3} />{t.paginas.ayuda}</span>
          <span className="text-[15px] font-semibold text-gris">{t.paginas.ayudaP}</span>
          <span className="mt-auto font-ui text-sm font-extrabold text-dv">{t.paginas.abrir} →</span>
        </motion.a>
        {redes.length > 0 && (
          <motion.div variants={aparece} className={`${tarjeta} flex flex-col gap-2.5 p-5 sm:col-span-2`}>
            <span className="font-ui text-[13px] font-extrabold tracking-[.1em] text-dv-700">{p.socialH}</span>
            <div className="flex flex-wrap gap-2">
              {redes.map(r => <a key={r.nombre} href={r.url} target="_blank" rel="noopener" className="flex min-h-11 items-center rounded-xl bg-lila-200 px-3.5 font-ui font-extrabold text-dv-700">{r.nombre}</a>)}
            </div>
          </motion.div>
        )}
      </div>
      <motion.div variants={aparece} className="flex flex-col gap-2 rounded-[22px] border-2 border-borde bg-white px-5 py-[18px]">
        <span className="font-ui text-lg font-extrabold text-tinta">{p.whyH}</span>
        <ul className="flex list-disc flex-col gap-1 pl-5 leading-normal font-semibold text-suave">
          {(p.why as string[]).map(w => <li key={w}>{w}</li>)}
        </ul>
      </motion.div>
    </Marco>
  );
}

const PAGINAS = { quienes: Quienes, como: Como, contacto: Contacto };

/** Monta la subpágina indicada (cada HTML de subpágina llama a esto con su clave). */
export function montar(clave: Clave) {
  const Pagina = PAGINAS[clave];
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <ProveedorIdioma><Pagina /></ProveedorIdioma>
      </MotionConfig>
    </StrictMode>
  );
}
