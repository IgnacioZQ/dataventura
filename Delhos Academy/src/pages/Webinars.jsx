// Webinars y workshops del rediseño: el próximo evento destacado, el calendario con filtro y el aviso por correo.
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarPlus } from 'lucide-react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Iman, Revelar } from '@/components/rediseno/Movimiento';
import { leerFecha, useEventos } from '@/lib/catalogo';
import { abrirCorreo } from '@/lib/correo';

const FILTROS = ['Todos', 'Webinars', 'Workshops'];

/** Archivo .ics para agregar el evento al calendario (solo si la fecha y la hora se pueden interpretar). */
export function enlaceCalendario(e) {
  const f = leerFecha(e.fecha);
  const hm = String(e.hora).match(/(\d{1,2})[:.h](\d{2})/);
  if (!f?.dia || !hm) return null;
  const inicio = new Date(f.fecha);
  inicio.setHours(+hm[1], +hm[2], 0, 0);
  const minutos = +(String(e.duracion).match(/\d+/)?.[0] ?? 60) * (/h/i.test(e.duracion) && !/min/i.test(e.duracion) ? 60 : 1);
  const fin = new Date(inicio.getTime() + minutos * 60000);
  const fmt = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const limpiar = s => String(s).replace(/[,;\\]/g, m => `\\${m}`).replace(/\n/g, '\\n');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Delhos Academy//ES', 'BEGIN:VEVENT', `UID:${e.id}@delhosacademy`, `DTSTART;TZID=America/Santiago:${fmt(inicio)}`, `DTEND;TZID=America/Santiago:${fmt(fin)}`,
    `SUMMARY:${limpiar(`${e.tipo}: ${e.titulo}`)}`, `DESCRIPTION:${limpiar(e.descripcion)}`, e.enlace ? `URL:${e.enlace}` : '', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function Fecha({ e, grande = false }) {
  return (
    <div className="datebox">
      <span className="text-[13px] font-semibold text-azul">{e.mes || (e.enVivo ? 'HOY' : 'FECHA')}</span>
      <span className={`h text-marino ${grande ? 'text-[40px]' : 'text-[32px]'}`}>{e.dia ?? '—'}</span>
    </div>
  );
}

function Destacado({ e }) {
  const ics = enlaceCalendario(e);
  return (
    <article className="rise grid items-center gap-10 border-t border-tinta pt-10 md:grid-cols-2" style={{ animationDelay: '.3s' }}>
      <div className="flex flex-col gap-4">
        <span className="eyebrow">{e.enVivo ? 'En vivo ahora' : `Próximo ${e.tipo.toLowerCase()}`} · <span className={e.precio.gratis ? 'text-verde' : ''}>{e.precio.gratis ? 'Gratuito' : e.precio.texto}</span></span>
        <h2 className="h" style={{ fontSize: 'clamp(28px, 3vw, 38px)' }}>{e.titulo}</h2>
        {e.descripcion && <p className="m-0 line-clamp-4 text-[17px] leading-[1.65] text-texto">{e.descripcion}</p>}
        <div className="mt-1.5 flex flex-wrap gap-2.5">
          {e.enVivo && e.enlace
            ? <a className="btn btn-p" href={e.enlace} target="_blank" rel="noopener noreferrer"><span className="dot live" />Unirme ahora<span className="sr-only"> (se abre en otra pestaña)</span></a>
            : <Iman><A pagina="Inscripcion" query={`?webinar=${e.id}`} className="btn btn-p active:scale-[0.98]">Reservar mi lugar</A></Iman>}
          <A pagina="WebinarDetalle" query={`?id=${e.id}`} className="btn btn-s">Ver detalles</A>
          {ics && <a className="btn btn-s" href={ics} download={`${e.titulo}.ics`}><CalendarPlus className="size-4" strokeWidth={2} />Agregar al calendario</a>}
        </div>
      </div>
      <div className="flex flex-col gap-3.5 border-l border-linea-fuerte py-1 pl-8">
        <div className="flex items-center gap-4">
          <Fecha e={e} grande />
          <div className="flex flex-col gap-1">
            <span className="font-bold">{[e.fecha, e.hora && `${e.hora} hrs`].filter(Boolean).join(', ') || 'Fecha por confirmar'}</span>
            <span className="text-gris">Hora de Chile{e.duracion ? ` · ${e.duracion}` : ''}</span>
          </div>
        </div>
        {e.temas.length > 0 && <ul className="m-0 pl-5 leading-[1.75] text-texto">{e.temas.slice(0, 4).map(t => <li key={t}>{t}</li>)}</ul>}
        <span className="text-sm text-gris">{[e.instructorNombre && `Con ${e.instructorNombre}`, e.cupos !== null && (e.cupos > 0 ? `Quedan ${e.cupos} lugares` : 'Sin lugares disponibles')].filter(Boolean).join(' · ')}</span>
      </div>
    </article>
  );
}

function Aviso() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-linea-fuerte pt-8">
      <div className="flex flex-col gap-1.5"><span className="h text-[22px]">Avísame del próximo evento</span><span className="text-[#2C3846]">Te escribimos cuando abramos inscripciones.</span></div>
      {listo ? (
        <p className="m-0 font-semibold text-verde" role="status">Listo: envía el correo que se abrió y te avisaremos.</p>
      ) : (
        <form noValidate className="flex max-w-[480px] flex-[1_1_340px] flex-col gap-1.5" onSubmit={ev => {
          ev.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim())) { setError('Revisa tu correo: debe tener la forma nombre@dominio.cl'); document.getElementById('aviso')?.focus(); return; }
          abrirCorreo('Quiero que me avisen del próximo evento', [['Correo', correo]]);
          setListo(true);
        }}>
          <div className="flex flex-wrap gap-2.5">
            <label htmlFor="aviso" className="sr-only">Tu correo</label>
            <input id="aviso" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} autoCapitalize="none" aria-describedby={error ? 'aviso-error' : undefined} placeholder="tu@correo.com" value={correo} onChange={e => { setCorreo(e.target.value); setError(''); }} aria-invalid={!!error} className="inp flex-[1_1_200px]" />
            <Iman><button className="btn btn-p active:scale-[0.98]" type="submit">Avisarme</button></Iman>
          </div>
          {error && <span id="aviso-error" role="alert" className="error">{error}</span>}
        </form>
      )}
    </div>
  );
}

export default function Webinars() {
  const { eventos, cargando } = useEventos();
  const [params, setParams] = useSearchParams();
  const filtro = { webinars: 'Webinars', workshops: 'Workshops' }[params.get('tipo')] ?? 'Todos';
  const setFiltro = f => setParams(f === 'Todos' ? {} : { tipo: f.toLowerCase() }, { replace: true });
  const destacado = eventos[0];
  const lista = useMemo(() => eventos.filter(e => filtro === 'Todos' || (filtro === 'Webinars' ? e.tipo === 'Webinar' : e.tipo === 'Workshop')), [eventos, filtro]);

  return (
    <Marco>
      <section className="relative overflow-hidden pb-12 pt-[72px]">
        <div className="wrap flex flex-col gap-4">
          <span className="eyebrow rise">Abiertos a todos</span>
          <h1 className="h rise" style={{ fontSize: 'clamp(38px, 4.6vw, 56px)', animationDelay: '.1s' }}>Webinars y workshops</h1>
          <p className="lead rise max-w-[36em]" style={{ animationDelay: '.2s' }}>Sesiones breves en vivo para aprender algo concreto. En los webinars escuchas y preguntas; en los workshops trabajas con tus propias manos.</p>
        </div>
      </section>

      <section className="pb-14">
        <div className="wrap">
          {cargando && <div className="h-64 animate-pulse rounded-2xl bg-linea-suave" />}
          {!cargando && destacado && <Destacado e={destacado} />}
          {!cargando && !destacado && (
            <div className="flex flex-col gap-3 border-t border-tinta pt-10">
              <h2 className="h text-[30px]">No hay eventos programados en este momento</h2>
              <p className="m-0 max-w-[40em] text-texto">Publicamos webinars y workshops durante el año. Déjanos tu correo abajo y te avisamos cuando abramos el próximo.</p>
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap flex flex-col gap-6">
          {eventos.length > 1 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="h text-[30px]">Calendario</h2>
                <div role="group" aria-label="Filtrar eventos" className="flex flex-wrap gap-x-6 gap-y-1">
                  {FILTROS.map(f => <button key={f} type="button" className={`fbtn ${filtro === f ? 'on' : ''}`} aria-pressed={filtro === f} onClick={() => setFiltro(f)}>{f}</button>)}
                </div>
              </div>
              <div className="flex flex-col border-t border-tinta">
                <AnimatePresence initial={false}>
                  {lista.map((e, i) => (
                    <motion.article key={e.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }} exit={{ opacity: 0 }} className="evrow spot">
                      <Fecha e={e} />
                      <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5 text-sm">
                          <span className={`font-semibold ${e.tipo === 'Webinar' ? 'text-marino-700' : 'text-[#2C3846]'}`}>{e.tipo}</span>
                          {e.enVivo && <span className="inline-flex items-center gap-1.5 font-semibold text-verde"><span className="dot live" />En vivo</span>}
                          <span className="text-gris">{[e.hora && `${e.hora} hrs`, e.precio.texto].filter(Boolean).join(' · ')}</span>
                        </div>
                        <A pagina="WebinarDetalle" query={`?id=${e.id}`} className="no-underline"><h3 className="h text-2xl hover:!text-marino">{e.titulo}</h3></A>
                        {e.descripcion && <p className="m-0 line-clamp-2 leading-[1.55] text-texto">{e.descripcion}</p>}
                      </div>
                      {e.enVivo && e.enlace
                        ? <a className="btn btn-p" href={e.enlace} target="_blank" rel="noopener noreferrer">Unirme<span className="sr-only"> (se abre en otra pestaña)</span></a>
                        : <A pagina="Inscripcion" query={`?webinar=${e.id}`} className="btn btn-s active:scale-[0.98]">{e.precio.gratis ? 'Reservar lugar' : 'Inscribirme'}</A>}
                    </motion.article>
                  ))}
                </AnimatePresence>
                {!lista.length && <p className="border-b border-linea py-10 text-texto">No hay {filtro.toLowerCase()} programados por ahora.</p>}
              </div>
            </>
          )}
          <Revelar><Aviso /></Revelar>
        </div>
      </section>
    </Marco>
  );
}
