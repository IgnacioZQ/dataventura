// Basado en Fluid Tabs de Watermelon UI (https://ui.watermelon.sh, MIT): una píldora que se desliza con
// resorte hasta la pestaña activa y un leve desenfoque al cambiar. Adaptado a Dataventura: controlado desde
// afuera, con colores por pestaña y semántica de pestañas accesible (flechas del teclado). Estilo Delhos.
import { motion } from 'motion/react';
import { type KeyboardEvent, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Color de la píldora cuando la pestaña está activa. */
  color?: string;
}

interface FluidTabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  /** id del panel que controlan las pestañas. */
  panelId?: string;
  className?: string;
}

export function FluidTabs({ tabs, active, onChange, ariaLabel, panelId, className }: FluidTabsProps) {
  const grupo = useId();

  const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex(t => t.id === active);
    const salto = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!salto) return;
    e.preventDefault();
    const siguiente = tabs[(i + salto + tabs.length) % tabs.length];
    onChange(siguiente.id);
    document.getElementById(`${grupo}-${siguiente.id}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={teclado}
      className={cn('relative flex max-w-full items-center gap-1 overflow-x-auto rounded-full border-[1.5px] border-linea bg-superficie-alt p-1 sm:gap-1.5', className)}
    >
      {tabs.map(tab => {
        const activa = active === tab.id;
        return (
          <button
            key={tab.id}
            id={`${grupo}-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={activa}
            aria-controls={panelId}
            tabIndex={activa ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className="group relative shrink-0 rounded-full px-3.5 py-2.5 outline-none sm:px-5 sm:py-3"
          >
            {activa && (
              <motion.span
                layoutId={`pildora-${grupo}`}
                transition={{ type: 'spring', stiffness: 280, damping: 25, mass: 0.8 }}
                className="absolute inset-0 rounded-full shadow-[0_10px_24px_-12px_rgba(30,97,148,.9)]"
                style={{ background: tab.color ?? '#1E6194' }}
              />
            )}
            <motion.span
              animate={{ filter: activa ? ['blur(0px)', 'blur(4px)', 'blur(0px)'] : 'blur(0px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'relative z-10 flex items-center gap-2 font-sans text-sm font-bold whitespace-nowrap transition-colors duration-200 sm:text-[15px]',
                activa ? 'text-white' : 'text-texto-suave group-hover:text-tinta'
              )}
            >
              {tab.icon && <motion.span animate={{ scale: activa ? 1.08 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="flex shrink-0">{tab.icon}</motion.span>}
              {tab.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
