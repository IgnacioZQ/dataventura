// Marco de las páginas públicas del rediseño: encabezado fijo con barra de lectura, menú en celular, pie oscuro
// con el ecosistema Delhos y el brillo bajo el cursor.
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CORREO_CONTACTO, ECOSISTEMA, LOGO_ACADEMY } from '@/config/sitio';
import { createPageUrl } from '@/utils';
import { Iman, useBrilloCursor } from './Movimiento';

export const NAV = [
  { pagina: 'Cursos', texto: 'Cursos' },
  { pagina: 'Webinars', texto: 'Webinars y workshops' },
  { pagina: 'Nosotros', texto: 'Quiénes somos' },
  { pagina: 'Contacto', texto: 'Contacto' }
];

/** Enlace interno a una página de la Academy (respeta el /academy/ del router). */
export function A({ pagina, query = '', className, children, ...resto }) {
  return <Link to={`${pagina === 'Home' ? '/' : createPageUrl(pagina)}${query}`} className={className} {...resto}>{children}</Link>;
}

export function Logo({ claro = false, tam = 38 }) {
  return (
    <span className="flex items-center gap-3">
      <img src={LOGO_ACADEMY} alt="" width={tam} height={tam} className="rounded-[10px] object-cover" style={{ width: tam, height: tam }} />
      <span className={`text-[17px] font-bold ${claro ? 'text-white' : 'text-tinta'}`} translate="no">Delhos Academy</span>
    </span>
  );
}

function Encabezado() {
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef(null);
  const actual = NAV.find(n => pathname.toLowerCase().startsWith(createPageUrl(n.pagina).toLowerCase()))?.pagina
    ?? (pathname.toLowerCase().startsWith('/cursodetalle') || pathname.toLowerCase().startsWith('/inscripcion') ? 'Cursos' : null);
  useEffect(() => setAbierto(false), [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const esc = e => { if (e.key === 'Escape') { setAbierto(false); botonMenu.current?.focus(); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [abierto]);

  return (
    <header className="hdr sticky top-0 z-30 border-b border-linea bg-papel/90 backdrop-blur-md">
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <A pagina="Home" aria-label="Delhos Academy, inicio" className="!text-tinta no-underline"><Logo /></A>
        <nav className="hidden items-center gap-[30px] min-[901px]:flex" aria-label="Principal">
          {NAV.map(n => (
            <A key={n.pagina} pagina={n.pagina} className={`navl ${actual === n.pagina ? 'on' : ''}`} aria-current={actual === n.pagina ? 'page' : undefined}>{n.texto}</A>
          ))}
        </nav>
        <div className="hidden items-center gap-[18px] min-[901px]:flex">
          <A pagina="Acceso" className="navl">Iniciar sesión</A>
          <Iman><A pagina="Cursos" className="btn btn-p !min-h-[44px]">Ver cursos</A></Iman>
        </div>
        <button ref={botonMenu} type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-controls="menu-movil" aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          className="btn btn-s !min-h-[44px] !px-3 active:scale-[0.97] min-[901px]:hidden">
          {abierto ? <X className="size-5" strokeWidth={1.8} /> : <Menu className="size-5" strokeWidth={1.8} />}
        </button>
      </div>
      <AnimatePresence>
        {abierto && (
          <motion.nav id="menu-movil" aria-label="Menú" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}
            className="wrap flex flex-col gap-0.5 pb-5 min-[901px]:hidden">
            {NAV.map(n => <A key={n.pagina} pagina={n.pagina} className={`navl !py-3 !text-lg ${actual === n.pagina ? 'on' : ''}`} aria-current={actual === n.pagina ? 'page' : undefined}>{n.texto}</A>)}
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <A pagina="Acceso" className="btn btn-s">Iniciar sesión</A>
              <A pagina="Cursos" className="btn btn-p">Ver cursos</A>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="sprog" aria-hidden />
    </header>
  );
}

function Pie() {
  return (
    <footer className="bg-noche py-16 pb-8 text-white">
      <div className="wrap flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-3.5">
            <Logo claro />
            <p className="m-0 max-w-[32ch] text-[15px] leading-relaxed text-[#A9B6C4]">Formación práctica y rigurosa en ciencia de datos, IA y analítica. Clases en vivo, 100% online.</p>
          </div>
          <nav aria-label="Academia" className="flex flex-col gap-2.5">
            <span className="mb-1 font-semibold">Academia</span>
            {NAV.slice(0, 3).map(n => <A key={n.pagina} pagina={n.pagina} className="flink">{n.texto}</A>)}
            <A pagina="Acceso" className="flink">Iniciar sesión</A>
          </nav>
          <nav aria-label="Ecosistema Delhos" className="flex flex-col gap-2.5">
            <span className="mb-1 font-semibold">Ecosistema Delhos</span>
            <a className="flink" href={ECOSISTEMA.delhos}>Delhos</a>
            <a className="flink" href={ECOSISTEMA.dataventura}>Dataventura</a>
          </nav>
          <div className="flex flex-col gap-2.5">
            <span className="mb-1 font-semibold">Contacto</span>
            <a className="flink break-all" href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>
            <A pagina="Contacto" className="flink">Formulario de contacto</A>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#2C3846] pt-6 text-sm text-[#8D9AA9]">
          <span>© {new Date().getFullYear()} Delhos Academy. Todos los derechos reservados.</span>
          <a href={ECOSISTEMA.delhos} className="flink flex items-center gap-2.5">Parte de <img src={`${import.meta.env.BASE_URL}marca/delhos-icono-app.svg`} alt="Delhos" width={22} height={22} className="size-[22px] rounded-[5px]" /></a>
        </div>
      </div>
    </footer>
  );
}

/** Página pública completa. `pie` permite ocultar el pie (por ejemplo, en Acceso). */
export function Marco({ children, encabezado = true, pie = true }) {
  const raiz = useRef(null);
  useBrilloCursor(raiz);
  return (
    <div ref={raiz} className="da min-h-[100dvh]">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-tinta focus:px-4 focus:py-3 focus:font-semibold focus:!text-white">Saltar al contenido</a>
      {encabezado && <Encabezado />}
      <main id="contenido" tabIndex={-1}>{children}</main>
      {pie && <Pie />}
    </div>
  );
}
