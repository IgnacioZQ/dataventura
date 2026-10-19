// Encabezado del diseño: NEXUS como logo, selector de idioma, botón que aparece al bajar y barra de progreso.
import { AnimatePresence, motion, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Nexus } from '@/components/Nexus';
import { app, SITIO } from '@/config';
import { IDIOMAS, useIdioma } from '@/i18n/idioma';
import { useProgresoScroll } from '@/lib/scroll';
import { cn } from '@/lib/utils';

/** Enlace para saltar al contenido, visible solo con el teclado. */
export function Saltar() {
  const { t } = useIdioma();
  return (
    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-xl focus:bg-tinta focus:px-4 focus:py-3 focus:font-ui focus:font-bold focus:text-white">{t.saltar}</a>
  );
}

/** «IDIOMA DEL SITIO:» → «Idioma del sitio:» (en mayúsculas, algunos lectores de pantalla lo deletrean). */
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function SelectorIdioma({ compacto = false }: { compacto?: boolean }) {
  const { idioma, t, cambiar } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const idMenu = useId();
  // Al cerrar desde dentro del panel, el foco vuelve al botón (si no, cae al <body> al desmontarse la opción).
  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false);
    if (devolverFoco) disparador.current?.focus();
  };
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setAbierto(false);
      if (caja.current?.contains(document.activeElement)) disparador.current?.focus();
    };
    addEventListener('pointerdown', fuera); addEventListener('keydown', esc);
    return () => { removeEventListener('pointerdown', fuera); removeEventListener('keydown', esc); };
  }, [abierto]);
  const actual = IDIOMAS.find(l => l.id === idioma)?.nombre ?? '';
  return (
    <div ref={caja} className="relative">
      <button ref={disparador} type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-controls={abierto ? idMenu : undefined}
        aria-label={`${capitalizar(String(t.siteLang))} ${actual}`}
        className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 font-ui text-[13px] font-extrabold tracking-[.08em] text-gris transition-[transform,color,background-color] hover:bg-lila-50 hover:text-tinta active:translate-y-[3px]">
        <span className={cn(compacto ? 'hidden' : 'hidden sm:inline')}>{t.siteLang} {t.langName}</span>
        <span className={cn(!compacto && 'sm:hidden')}>{idioma.toUpperCase()}</span>
        <ChevronDown className={cn('size-3.5 transition-transform', abierto && 'rotate-180')} strokeWidth={3} />
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.div id={idMenu} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className="absolute top-[50px] right-0 z-50 flex w-[210px] origin-top-right flex-col gap-1 rounded-2xl border-2 border-borde bg-white p-2 shadow-[0_4px_0_#e5e0f2]">
            {IDIOMAS.map(l => (
              <button key={l.id} type="button" lang={l.id} onClick={e => { cambiar(l.id); cerrar(e.detail === 0 || caja.current?.contains(document.activeElement) === true); }} aria-pressed={idioma === l.id}
                className={cn('min-h-11 rounded-xl px-3.5 text-left font-ui text-[15px] font-extrabold transition-transform active:translate-y-[3px]', idioma === l.id ? 'bg-lila-200 text-dv-700' : 'text-tinta hover:bg-lila-50')}>
                {l.nombre}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Encabezado() {
  const { t } = useIdioma();
  const { scrollYProgress, scrollY } = useProgresoScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const [verCta, setVerCta] = useState(false);
  useEffect(() => scrollY.on('change', y => setVerCta(y > 480)), [scrollY]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-borde bg-white/85 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-[64px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-5">
        <a href={SITIO.inicio} aria-label={t.logoAria} className="group flex items-center gap-2 rounded-2xl">
          {/* Quieto: la cabecera siempre está a la vista y su respiración invalidaba el diseño en cada cuadro. */}
          <motion.span whileHover={{ scale: 1.06, rotate: -3 }} whileTap={{ scale: 0.94 }}><Nexus pose="idle" cabeza tam={52} estatico decorativo /></motion.span>
          <span className="hidden flex-col leading-none min-[420px]:flex">
            <span translate="no" className="font-display text-[22px] text-dv">Dataventura</span>
            <span translate="no" className="font-ui text-[10px] font-extrabold tracking-[.16em] text-gris uppercase">by Delhos</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          {/* layout="position": al aparecer el botón, el selector se desliza en vez de saltar a la izquierda. */}
          <motion.div layout="position" transition={{ type: 'spring', stiffness: 420, damping: 34 }}><SelectorIdioma /></motion.div>
          <AnimatePresence>
            {verCta && (
              <motion.a href={app('/')} data-wipe="dv" initial={{ opacity: 0, y: -6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.9 }}
                className="btn-juego !min-h-[42px] !rounded-[14px] !px-4 !text-[13px]">
                {t.startShort}
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.div aria-hidden className="absolute right-0 -bottom-[2px] left-0 h-[3px] origin-left bg-gradient-to-r from-dv via-rosa to-oro" style={{ scaleX: progreso }} />
    </header>
  );
}
