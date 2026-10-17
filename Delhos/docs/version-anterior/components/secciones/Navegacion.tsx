// Barra de navegación del sistema: firma a la izquierda, menú, botón is-sm a la derecha. Fija; sobre la portada
// oscura es transparente y, al bajar, toma `fondo` al 85% con desenfoque. Productos y Servicios despliegan su
// único destino (Dataventura y Delhos Academy), como pidió el usuario.
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Firma, Icono } from '@/components/Piezas';
import { recurso, SITIO } from '@/config';
import { cn } from '@/lib/utils';

const MENUS = [
  { id: 'productos', titulo: 'Productos', destino: { nombre: 'Dataventura', bajada: 'Piensa con datos en 5 minutos al día', href: SITIO.dataventura, wipe: 'dv', logo: 'assets/dataventura/dataventura-icon.svg', color: '#7b4dff' } },
  { id: 'servicios', titulo: 'Servicios', destino: { nombre: 'Delhos Academy', bajada: 'Cursos en vivo de ciencia de datos e IA', href: SITIO.academy, wipe: 'ac', logo: 'assets/academy/academy-logo-192.png', color: '#2B7CB3' } }
];
const ENLACES = [
  { href: '#ecosistema', texto: 'Ecosistema' },
  { href: '#desafio', texto: 'El desafío' },
  { href: '#preguntas', texto: 'Preguntas' }
];

function Desplegable({ menu, oscuro }: { menu: (typeof MENUS)[number]; oscuro: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setAbierto(false); };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    addEventListener('pointerdown', fuera); addEventListener('keydown', esc);
    return () => { removeEventListener('pointerdown', fuera); removeEventListener('keydown', esc); };
  }, [abierto]);
  const d = menu.destino;
  return (
    <div ref={ref} className="relative" onPointerEnter={e => e.pointerType === 'mouse' && setAbierto(true)} onPointerLeave={e => e.pointerType === 'mouse' && setAbierto(false)}>
      <button type="button" aria-expanded={abierto} aria-controls={`menu-${menu.id}`} onClick={() => setAbierto(!abierto)}
        className={cn('flex min-h-11 items-center gap-1 rounded-full px-3 text-[14px] font-semibold transition-colors', oscuro ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-texto hover:bg-superficie-alt hover:text-tinta')}>
        {menu.titulo}<ChevronDown className={cn('size-4 transition-transform duration-300', abierto && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.div id={`menu-${menu.id}`} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 z-50 pt-2" data-theme="light">
            <a href={d.href} data-wipe={d.wipe} className="group flex w-[300px] items-center gap-3 rounded-[18px] border-[1.5px] border-linea bg-superficie p-3 text-tinta shadow-[0_24px_60px_-24px_rgba(30,61,89,.45)]">
              <img src={recurso(d.logo)} alt="" className="size-11 rounded-xl" />
              <span className="flex-1">
                <span className="block font-display text-[17px] font-bold tracking-[-0.02em]">{d.nombre}</span>
                <span className="block text-[13px] leading-snug text-texto-suave">{d.bajada}</span>
              </span>
              <span className="text-enlace transition-transform duration-200 group-hover:translate-x-1"><Icono nombre="flecha" tam={18} /></span>
              <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full" style={{ background: d.color }} aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navegacion() {
  const [oscuro, setOscuro] = useState(true);
  const [movil, setMovil] = useState(false);

  useEffect(() => {
    const medir = () => {
      const portada = document.getElementById('inicio');
      setOscuro(!!portada && portada.getBoundingClientRect().bottom > 72);
    };
    medir();
    addEventListener('scroll', medir, { passive: true });
    addEventListener('resize', medir);
    return () => { removeEventListener('scroll', medir); removeEventListener('resize', medir); };
  }, []);

  const tema = oscuro && !movil ? 'dark' : 'light';
  return (
    <header data-theme={tema} className={cn('fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
      tema === 'dark' ? 'border-b border-transparent bg-transparent' : 'border-b border-linea bg-[rgba(248,250,252,.85)] backdrop-blur-md')}>
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#inicio" aria-label="Delhos, inicio" className="rounded-xl"><Firma oscuro={tema === 'dark'} tam={36} /></a>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {MENUS.map(m => <Desplegable key={m.id} menu={m} oscuro={tema === 'dark'} />)}
          {ENLACES.map(e => (
            <a key={e.href} href={e.href} className={cn('flex min-h-11 items-center rounded-full px-3 text-[14px] font-semibold transition-colors', tema === 'dark' ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-texto hover:bg-superficie-alt hover:text-tinta')}>{e.texto}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contacto" className="dh-btn is-sm hidden sm:inline-flex">Conversemos</a>
          <button type="button" onClick={() => setMovil(!movil)} aria-expanded={movil} aria-controls="menu-movil" aria-label={movil ? 'Cerrar menú' : 'Abrir menú'}
            className={cn('grid size-11 place-items-center rounded-full lg:hidden', tema === 'dark' ? 'text-white hover:bg-white/10' : 'text-tinta hover:bg-superficie-alt')}>
            {movil ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {movil && (
          <motion.nav id="menu-movil" aria-label="Principal" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }} className="overflow-hidden border-t border-linea bg-fondo lg:hidden">
            <div className="flex flex-col gap-2 px-4 py-4">
              {MENUS.map(m => (
                <a key={m.id} href={m.destino.href} data-wipe={m.destino.wipe} className="flex items-center gap-3 rounded-[18px] border-[1.5px] border-linea bg-superficie p-3">
                  <img src={recurso(m.destino.logo)} alt="" className="size-10 rounded-xl" />
                  <span><span className="block font-mono text-[11px] tracking-[.14em] text-texto-suave uppercase">{m.titulo}</span><span className="block font-display text-lg font-bold text-tinta">{m.destino.nombre}</span></span>
                </a>
              ))}
              {ENLACES.map(e => <a key={e.href} href={e.href} onClick={() => setMovil(false)} className="flex min-h-12 items-center rounded-xl px-3 font-semibold text-tinta hover:bg-superficie-alt">{e.texto}</a>)}
              <a href="#contacto" onClick={() => setMovil(false)} className="dh-btn mt-1">Conversemos</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
