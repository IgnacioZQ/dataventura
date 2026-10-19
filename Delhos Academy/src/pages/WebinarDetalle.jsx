// Detalle de un webinar o workshop, con el lenguaje visual del rediseño.
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarPlus, Linkedin } from 'lucide-react';
import { api } from '@/api/client';
import { A, Marco } from '@/components/rediseno/Marco';
import { Iman, Revelar } from '@/components/rediseno/Movimiento';
import { normalizarEvento } from '@/lib/catalogo';
import { enlaceCalendario } from './Webinars';

const Visto = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E6DB4" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>;

export default function WebinarDetalle() {
  const id = new URLSearchParams(window.location.search).get('id');
  const { data, isLoading } = useQuery({
    queryKey: [`evento-${id}`],
    enabled: !!id,
    queryFn: async () => {
      const w = (await api.entities.Webinar.filter({ id }))[0];
      if (!w) return null;
      const instructor = w.instructor_email ? (await api.entities.Instructor.filter({ email: w.instructor_email }))[0] ?? null : null;
      return { e: normalizarEvento(w), instructor };
    }
  });

  const tituloEvento = data?.e.titulo;
  useEffect(() => { if (tituloEvento) document.title = `${tituloEvento} · Delhos Academy`; }, [tituloEvento]);

  if (id && isLoading) return <Marco><div className="wrap py-16"><div className="h-72 animate-pulse rounded-2xl bg-linea-suave" /></div></Marco>;
  if (!data) {
    return (
      <Marco>
        <div className="wrap flex flex-col items-start gap-4 py-24">
          <span className="eyebrow">Webinars y workshops</span>
          <h1 className="h text-4xl">No encontramos este evento</h1>
          <p className="lead">Puede que ya haya terminado o que el enlace esté incompleto.</p>
          <A pagina="Webinars" className="btn btn-p mt-2">Ver eventos</A>
        </div>
      </Marco>
    );
  }

  const { e, instructor } = data;
  const ics = enlaceCalendario(e);
  const nombreInstructor = instructor?.name || e.instructorNombre;

  return (
    <Marco>
      <section className="border-b border-linea bg-white pb-14 pt-12">
        <div className="wrap flex flex-col gap-5">
          <nav aria-label="Ruta" className="flex gap-2 text-sm text-gris"><A pagina="Webinars" className="-my-3 py-3 no-underline">Webinars y workshops</A><span aria-hidden>/</span><span className="truncate">{e.titulo}</span></nav>
          <div className="flex flex-wrap gap-2">
            <span className="pill">{e.tipo}</span>
            {e.enVivo && <span className="pill !bg-verde-suave !text-verde"><span className="dot live" />En vivo ahora</span>}
            {e.finalizado && <span className="pill !bg-linea-suave !text-texto">Finalizado</span>}
            <span className={`pill ${e.precio.gratis ? '!bg-verde-suave !text-verde' : '!bg-[#F1F3F6] !text-[#2C3846]'}`}>{e.precio.texto}</span>
          </div>
          <h1 className="h rise max-w-[18em]" style={{ fontSize: 'clamp(34px, 4.4vw, 52px)' }}>{e.titulo}</h1>
          {e.descripcion && <p className="rise m-0 max-w-[40em] whitespace-pre-line text-[19px] leading-relaxed text-texto" style={{ animationDelay: '.12s' }}>{e.descripcion}</p>}
          <dl className="m-0 mt-3 grid max-w-[760px] grid-cols-2 gap-4 sm:grid-cols-4">
            {[['Fecha', e.fecha || 'Por confirmar'], ['Hora', e.hora ? `${e.hora} hrs (Chile)` : 'Por confirmar'], ['Duración', e.duracion], ['Lugares', e.cupos !== null ? String(e.cupos) : '']].filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt className="text-sm text-gris">{k}</dt><dd className="m-0 mt-1 font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {e.finalizado
              ? <span className="btn btn-s cursor-default">Este evento ha finalizado</span>
              : e.enVivo && e.enlace
                ? <a className="btn btn-p" href={e.enlace} target="_blank" rel="noopener noreferrer"><span className="dot live" />Unirme ahora<span className="sr-only"> (se abre en otra pestaña)</span></a>
                : <Iman><A pagina="Inscripcion" query={`?webinar=${e.id}`} className="btn btn-p active:scale-[0.98]">Inscribirme al {e.tipo.toLowerCase()}</A></Iman>}
            {ics && !e.finalizado && <a className="btn btn-s" href={ics} download={`${e.titulo}.ics`}><CalendarPlus className="size-4" strokeWidth={2} />Agregar al calendario</a>}
          </div>
        </div>
      </section>

      <div className="wrap grid items-start gap-12 pb-24 pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-12">
          {e.temas.length > 0 && (
            <Revelar as="section" className="flex flex-col gap-5">
              <h2 className="h text-[28px]">Qué vas a aprender</h2>
              <ul className="m-0 grid list-none gap-x-8 gap-y-4 p-0 md:grid-cols-2">{e.temas.map(t => <li key={t} className="tick"><Visto /><span>{t}</span></li>)}</ul>
            </Revelar>
          )}
          {e.requisitos.length > 0 && (
            <Revelar as="section" className="flex flex-col gap-3 border-t border-linea-fuerte pt-7">
              <h2 className="h text-[22px]">Requisitos previos</h2>
              <ul className="m-0 pl-5 leading-[1.7] text-texto">{e.requisitos.map(t => <li key={t}>{t}</li>)}</ul>
            </Revelar>
          )}
          {!e.temas.length && !e.requisitos.length && <p className="m-0 text-texto">El instructor publicará pronto los temas de este {e.tipo.toLowerCase()}.</p>}
        </div>
        {nombreInstructor && (
          <Revelar as="aside" className="card flex flex-col gap-4 p-7">
            <span className="eyebrow">Con</span>
            <div className="flex items-center gap-4">
              {instructor?.profile_image
                ? <img src={instructor.profile_image} alt="" className="size-16 rounded-full object-cover" />
                : <span className="flex size-16 items-center justify-center rounded-full bg-azul-suave font-serif text-2xl font-semibold text-marino">{nombreInstructor.split(' ').map(p => p[0]).slice(0, 2).join('')}</span>}
              <span className="text-lg font-bold">{nombreInstructor}</span>
            </div>
            {instructor?.bio && <p className="m-0 leading-relaxed text-texto">{instructor.bio}</p>}
            {instructor?.linkedin && <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold"><Linkedin className="size-4" />LinkedIn<span className="sr-only"> (se abre en otra pestaña)</span></a>}
          </Revelar>
        )}
      </div>
    </Marco>
  );
}
