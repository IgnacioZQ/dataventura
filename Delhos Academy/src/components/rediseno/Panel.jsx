// Piezas de los paneles de estudiante e instructor (Claude Design, artboards Panel estudiante y Panel instructor):
// encabezado blanco, navegación lateral que en celular pasa a ser una fila deslizable, y tarjetas.
import { motion } from 'motion/react';
import { Bell, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOGO_ACADEMY } from '@/config/sitio';

export const iniciales = nombre => (nombre || '?').trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();

export function EncabezadoPanel({ nombre, foto, etiqueta, avisos = 0, onAvisos, onPerfil }) {
  return (
    <>
    <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-tinta focus:px-4 focus:py-3 focus:font-semibold focus:!text-white">Saltar al contenido</a>
    <header className="sticky top-0 z-30 border-b border-linea bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 !text-tinta no-underline" aria-label="Delhos Academy, inicio">
          <img src={LOGO_ACADEMY} alt="" width={34} height={34} className="size-[34px] rounded-[9px]" />
          <span className="hidden font-bold min-[420px]:inline">Delhos Academy</span>
          {etiqueta && <span className="pill !bg-[#F1F3F6] !text-[#2C3846]">{etiqueta}</span>}
        </Link>
        <div className="flex items-center gap-2">
          {onAvisos && (
            <button type="button" onClick={onAvisos} aria-label={avisos ? `Anuncios, ${avisos} sin leer` : 'Anuncios'} className="relative flex size-11 items-center justify-center rounded-[10px] text-texto transition-colors hover:bg-linea-suave hover:text-tinta">
              <Bell className="size-5" strokeWidth={1.8} />
              {avisos > 0 && <span className="absolute right-[11px] top-2.5 size-2 rounded-full border-2 border-white bg-azul" />}
            </button>
          )}
          <button type="button" onClick={onPerfil} className="flex items-center gap-2.5 rounded-[10px] py-1 pl-2 pr-1 transition-colors hover:bg-linea-suave" aria-label={`${nombre}: perfil y configuración`}>
            {foto
              ? <img src={foto} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
              : <span className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${etiqueta ? 'bg-marino text-white' : 'bg-azul-suave text-marino'}`}>{iniciales(nombre)}</span>}
            <span className="hidden max-w-[180px] truncate font-semibold sm:inline">{nombre}</span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
}

/**
 * Navegación del panel. items: [{ id, texto, icono, insignia }]. En pantallas angostas se muestra como fila
 * deslizable (todas las secciones quedan al alcance, también Foro y Mensajería).
 */
export function NavPanel({ items, actual, onCambiar, pie, onSalir }) {
  return (
    <aside className="flex w-full flex-col gap-5 min-[861px]:w-[248px] min-[861px]:flex-none">
      <nav aria-label="Panel" className="-mx-4 flex gap-1 overflow-x-auto overscroll-x-contain px-4 pb-1 [mask-image:linear-gradient(90deg,#000_88%,transparent)] [scrollbar-width:none] min-[861px]:mx-0 min-[861px]:[mask-image:none] min-[861px]:flex-col min-[861px]:overflow-visible min-[861px]:px-0">
        {items.map(it => {
          const on = actual === it.id || (it.activo && it.activo(actual));
          return (
            <button key={it.id} type="button" onClick={() => onCambiar(it.id)} aria-current={on ? 'page' : undefined} className={`navi relative !w-auto flex-none min-[861px]:!w-full ${on ? 'on' : ''}`}>
              {on && <motion.span layoutId="navi-activo" className="absolute inset-0 rounded-[10px] bg-azul-suave" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              {it.icono && <it.icono className="relative size-[18px] flex-none" strokeWidth={1.8} aria-hidden="true" />}
              <span className="relative" title={it.titulo}>{it.texto}</span>{it.titulo && <span className="sr-only">: {it.titulo}</span>}
              {it.insignia > 0 && <span className="badge-n relative">{it.insignia > 9 ? '9+' : it.insignia}</span>}
            </button>
          );
        })}
        {onSalir && (
          <button type="button" onClick={onSalir} className="navi !w-auto flex-none min-[861px]:hidden"><LogOut className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />Cerrar sesión</button>
        )}
      </nav>
      <div className="card hidden flex-col gap-2.5 !bg-papel p-4 min-[861px]:flex">
        {pie}
        {onSalir && <button type="button" onClick={onSalir} className="inline-flex min-h-8 w-fit items-center gap-2 font-semibold text-azul hover:text-marino"><LogOut className="size-4" strokeWidth={2} aria-hidden="true" />Cerrar sesión</button>}
      </div>
    </aside>
  );
}

/** Contenedor de la vista activa con una entrada suave. */
export function Vista({ id, children, className = '' }) {
  return (
    <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/** Esqueleto de carga con la forma de las tarjetas. */
export function Esqueleto({ alto = 120, className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-2xl bg-[linear-gradient(90deg,#EEF1F4,#F7F8FA,#EEF1F4)] ${className}`} style={{ height: alto }} />;
}

/** Diferencia en días desde hoy (a medianoche). */
export function diasHasta(fecha) {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return null;
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const dia = new Date(d); dia.setHours(0, 0, 0, 0);
  return Math.round((dia - hoy) / 86400000);
}

/** Duración de una clase en minutos («1.5 horas», «90 min», «2h»). Por defecto, 90 minutos. */
export function minutosDeClase(duracion) {
  const s = String(duracion || '').toLowerCase();
  const n = parseFloat(s.replace(',', '.').replace(/[^\d.]/g, ''));
  if (!n) return 90;
  return /min/.test(s) ? n : n * 60;
}

/** Estado de una clase en vivo: 'activa' desde 15 minutos antes hasta su término, 'proxima' o 'terminada'. */
export function estadoClase(leccion, ahora = new Date()) {
  if (!leccion?.scheduled_date) return null;
  const inicio = new Date(leccion.scheduled_date);
  if (Number.isNaN(inicio.getTime())) return null;
  const fin = new Date(inicio.getTime() + minutosDeClase(leccion.duration) * 60000);
  if (ahora >= new Date(inicio.getTime() - 15 * 60000) && ahora < fin) return 'activa';
  return ahora >= fin ? 'terminada' : 'proxima';
}

export const horaCorta = fecha => new Date(fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
export const fechaCorta = fecha => new Date(fecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
