// Detalle de curso del rediseño. Todo sale de la ficha del curso (entidad Course) y de su instructor.
// El video de presentación es una composición de Remotion armada con los datos del curso; si el instructor
// cargó un video propio (YouTube o Vimeo), se puede ver también.
import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Globe, Linkedin, Play } from 'lucide-react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Iman, Revelar } from '@/components/rediseno/Movimiento';
import { Preguntas } from '@/components/rediseno/Secciones';
import { useCurso } from '@/lib/catalogo';
import { INCLUYE_BASE, preguntasCurso } from '@/lib/contenido-academy';
import { pageHref } from '@/utils';

const PromoCurso = lazy(() => import('@/components/rediseno/VideosRemotion').then(m => ({ default: m.PromoCurso })));

const Visto = ({ tam = 20 }) => <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="#2E6DB4" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>;

function urlEmbebida(url) {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return '';
}

function estaInscrito(id) {
  try { return JSON.parse(localStorage.getItem('studentSession') || 'null')?.course_id === id; } catch { return false; }
}

function Video({ curso }) {
  const embebida = urlEmbebida(curso.video);
  const [propio, setPropio] = useState(false);
  return (
    <figure className="vidzoom m-0 flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-[#EAF2FB]">
        {propio && embebida ? (
          <iframe src={`${embebida}?autoplay=1`} title={`Video de presentación: ${curso.titulo}`} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <Suspense fallback={<div className="aspect-video w-full animate-pulse bg-[#EAF2FB]" />}><PromoCurso curso={curso} /></Suspense>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-marino-700">
        <span>{propio ? 'Video del instructor' : 'Presentación del curso'}</span>
        {embebida && (
          <button type="button" className="btn btn-s !min-h-10 !px-4 !text-sm active:scale-[0.98]" onClick={() => setPropio(!propio)}>
            {propio ? 'Ver la presentación animada' : <><Play className="size-4" strokeWidth={2} />Ver el video del instructor</>}
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function Temario({ modulos }) {
  const [abierto, setAbierto] = useState(0);
  return (
    <Revelar as="section" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4"><h2 className="h text-[28px]">Temario</h2><span className="text-[15px] text-gris">{modulos.length === 1 ? '1 módulo' : `${modulos.length} módulos`}</span></div>
      <div className="border-t border-tinta">
        {modulos.map((m, i) => {
          const esta = abierto === i;
          return (
            <div key={i} className={i === modulos.length - 1 ? '' : 'border-b border-linea-suave'}>
              <h3 className="m-0">
                <button type="button" className={`modb ${m.d ? '' : '!cursor-default hover:!pl-0'}`} onClick={() => m.d && setAbierto(esta ? -1 : i)} aria-expanded={m.d ? esta : undefined} aria-disabled={!m.d || undefined}>
                  <span className="flex size-8 items-center justify-center font-serif text-[22px] font-medium text-azul">{i + 1}</span>
                  <span className="modt text-[17px] font-semibold">{m.t}</span>
                  {m.d && <motion.svg animate={{ rotate: esta ? 180 : 0 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={esta ? '#2E6DB4' : '#6B7685'} strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></motion.svg>}
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {esta && m.d && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="m-0 overflow-hidden pb-5 pl-[54px] pr-8 leading-[1.65] text-texto">{m.d}</motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Revelar>
  );
}

function Instructor({ curso, instructor }) {
  const nombre = instructor?.name || curso.instructorNombre;
  if (!nombre) return null;
  const cargo = instructor?.experience?.[0] ? [instructor.experience[0].position, instructor.experience[0].company].filter(Boolean).join(' · ') : (instructor?.specialties || []).slice(0, 3).join(' · ');
  return (
    <Revelar as="section" className="flex flex-col gap-5">
      <h2 className="h text-[28px]">Tu instructor</h2>
      <div className="flex flex-wrap items-center gap-6 border-t border-linea-fuerte pt-6">
        {instructor?.profile_image
          ? <img src={instructor.profile_image} alt="" className="size-24 flex-none rounded-full object-cover" />
          : <span className="flex size-24 flex-none items-center justify-center rounded-full bg-azul-suave font-serif text-3xl font-semibold text-marino">{nombre.split(' ').map(p => p[0]).slice(0, 2).join('')}</span>}
        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-1.5">
          <span className="text-[19px] font-bold">{nombre}</span>
          {cargo && <span className="text-gris">{cargo}</span>}
          {instructor?.bio && <p className="m-0 mt-1.5 leading-relaxed text-texto">{instructor.bio}</p>}
          <div className="mt-1 flex flex-wrap gap-4">
            {instructor?.linkedin && <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold"><Linkedin className="size-4" />LinkedIn<span className="sr-only"> (se abre en otra pestaña)</span></a>}
            {instructor?.website && <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold"><Globe className="size-4" />Sitio web<span className="sr-only"> (se abre en otra pestaña)</span></a>}
          </div>
        </div>
      </div>
    </Revelar>
  );
}

function Llamada({ curso, inscrito, compacto = false }) {
  if (inscrito) return <a href={pageHref('StudentDashboard')} className={`btn btn-p w-full ${compacto ? '' : '!min-h-[52px]'}`}>Ir a mis clases</a>;
  if (curso.finalizado) return <span className="btn btn-s w-full cursor-default">Este curso ha finalizado</span>;
  return <Iman className="w-full"><A pagina="Inscripcion" query={`?curso=${curso.id}`} className={`btn btn-p w-full active:scale-[0.98] ${compacto ? '' : '!min-h-[52px]'}`}>{compacto ? 'Postular' : 'Postular a este curso'}</A></Iman>;
}

export default function CursoDetalle() {
  const id = new URLSearchParams(window.location.search).get('id');
  const { datos, cargando } = useCurso(id);
  const tituloCurso = datos?.curso.titulo;
  useEffect(() => { if (tituloCurso) document.title = `${tituloCurso} · Delhos Academy`; }, [tituloCurso]);

  if (cargando) {
    return (
      <Marco>
        <div className="wrap flex flex-col gap-5 py-12" aria-busy="true">
          <div className="h-4 w-40 animate-pulse rounded bg-linea" />
          <div className="h-14 w-2/3 animate-pulse rounded-lg bg-linea" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-linea" />
          <div className="mt-6 aspect-video w-full max-w-3xl animate-pulse rounded-2xl bg-linea-suave" />
        </div>
      </Marco>
    );
  }

  if (!datos) {
    return (
      <Marco>
        <div className="wrap flex flex-col items-start gap-4 py-24">
          <span className="eyebrow">Cursos</span>
          <h1 className="h text-4xl">No encontramos este curso</h1>
          <p className="lead">Puede que ya no esté publicado o que el enlace esté incompleto.</p>
          <A pagina="Cursos" className="btn btn-p mt-2">Ver todos los cursos</A>
        </div>
      </Marco>
    );
  }

  const { curso, instructor } = datos;
  const inscrito = estaInscrito(curso.id);
  const ficha = [['Inicio', curso.inicio], ['Término', curso.termino], ['Duración', curso.duracion], ['Clases', curso.clases && `${curso.clases} en vivo`], ['Horario', curso.horario], ['Idioma', curso.idioma]].filter(([, v]) => v);
  const incluye = curso.incluye.length ? curso.incluye : INCLUYE_BASE;

  return (
    <Marco>
      <section className="border-b border-linea bg-white pb-14 pt-12">
        <div className="wrap flex flex-col gap-5">
          <nav aria-label="Ruta" className="flex gap-2 text-sm text-gris"><A pagina="Cursos" className="-my-3 py-3 no-underline">Cursos</A><span aria-hidden>/</span><span className="truncate">{curso.titulo}</span></nav>
          <div className="flex flex-wrap gap-2">
            <span className={`pill ${curso.abierto ? '!bg-verde-suave !text-verde' : curso.finalizado ? '!bg-linea-suave !text-texto' : ''}`}>{curso.abierto && <span className="dot live" />}{curso.estadoTexto}</span>
            <span className="pill">{curso.nivel}</span>
            <span className="pill !bg-[#F1F3F6] !text-[#2C3846]">En vivo · online</span>
            {curso.categoria && <span className="pill !bg-[#F1F3F6] !text-[#2C3846]">{curso.categoria}</span>}
          </div>
          <h1 className="h rise max-w-[16em]" style={{ fontSize: 'clamp(36px, 4.6vw, 54px)' }}>{curso.titulo}</h1>
          {curso.resumen && <p className="rise m-0 max-w-[38em] text-[19px] leading-relaxed text-texto" style={{ animationDelay: '.12s' }}>{curso.resumen}</p>}
          {curso.instructorNombre && <span className="text-gris">Con {curso.instructorNombre}</span>}
          {ficha.length > 0 && (
            <dl className="m-0 mt-3 grid max-w-[860px] grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
              {ficha.map(([k, v]) => <div key={k}><dt className="text-sm text-gris">{k}</dt><dd className="m-0 mt-1 font-semibold">{v}</dd></div>)}
            </dl>
          )}
        </div>
      </section>

      <div className="wrap flex flex-wrap items-start gap-12 pb-[104px] pt-12">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-14">
          <Video curso={curso} />

          {curso.descripcion && curso.descripcion !== curso.resumen && (
            <Revelar as="section" className="flex flex-col gap-4"><h2 className="h text-[28px]">Sobre este curso</h2><p className="m-0 whitespace-pre-line text-[17px] leading-[1.7] text-texto">{curso.descripcion}</p></Revelar>
          )}

          {curso.aprenderas.length > 0 && (
            <Revelar as="section" className="flex flex-col gap-[22px]">
              <h2 className="h text-[28px]">Lo que vas a aprender</h2>
              <ul className="m-0 grid list-none gap-x-8 gap-y-4 p-0 md:grid-cols-2">{curso.aprenderas.map(x => <li key={x} className="tick"><Visto /><span>{x}</span></li>)}</ul>
            </Revelar>
          )}

          {curso.modulos.length > 0 && <Temario modulos={curso.modulos} />}

          {(curso.metodologia || curso.publico.length > 0) && (
            <Revelar as="section" className="grid gap-8 md:grid-cols-2">
              {curso.metodologia && <div className="flex flex-col gap-3"><h2 className="h text-[22px]">Metodología</h2><p className="m-0 whitespace-pre-line leading-[1.7] text-texto">{curso.metodologia}</p></div>}
              {curso.publico.length > 0 && <div className="flex flex-col gap-3"><h2 className="h text-[22px]">A quién está dirigido</h2><ul className="m-0 pl-5 leading-[1.7] text-texto">{curso.publico.map(x => <li key={x}>{x}</li>)}</ul></div>}
            </Revelar>
          )}

          {(curso.requisitos.length > 0 || curso.herramientas.length > 0) && (
            <Revelar as="section" className="grid gap-7 border-t border-linea-fuerte pt-7 md:grid-cols-2">
              {curso.requisitos.length > 0 && <div className="flex flex-col gap-2.5"><span className="font-semibold">Requisitos previos</span><ul className="m-0 pl-5 leading-relaxed text-texto">{curso.requisitos.map(x => <li key={x}>{x}</li>)}</ul></div>}
              {curso.herramientas.length > 0 && <div className="flex flex-col gap-2.5"><span className="font-semibold">Herramientas</span><div className="flex flex-wrap gap-2">{curso.herramientas.map(x => <span key={x} className="tag">{x}</span>)}</div></div>}
            </Revelar>
          )}

          <Instructor curso={curso} instructor={instructor} />
        </div>

        <aside className="flex flex-[1_1_320px] flex-col gap-3 lg:sticky lg:top-24">
          <div className="card flex flex-col gap-[18px] p-7 shadow-[0_12px_32px_rgba(22,32,44,0.06)]">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gris">Valor del curso</span>
              <span className="h text-4xl">{curso.precio.gratis ? 'Gratuito' : curso.precio.texto.replace(' CLP', '')}{!curso.precio.gratis && <span className="ml-1.5 font-sans text-base font-medium text-gris">CLP</span>}</span>
              {curso.precio.original && <span className="text-sm text-gris"><span className="sr-only">Precio anterior: </span><del>{curso.precio.original}</del> · {curso.precio.descuento}% de descuento</span>}
            </div>
            {curso.cupos !== null && !curso.finalizado && <span className={`text-[15px] font-semibold ${curso.cupos > 0 ? 'text-verde' : 'text-naranja'}`}>{curso.cupos > 0 ? (curso.cupos === 1 ? 'Queda 1 cupo' : `Quedan ${curso.cupos} cupos`) : 'Sin cupos por ahora: postula a la lista de espera'}</span>}
            <Llamada curso={curso} inscrito={inscrito} />
            {inscrito
              ? <p className="m-0 text-sm font-semibold text-verde">Ya estás inscrito en este curso.</p>
              : !curso.finalizado && <p className="m-0 text-sm leading-normal text-gris">Postular no te compromete a pagar. Te contactamos para confirmar tu cupo.</p>}
            <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-linea-suave p-0 pt-[18px] text-[15px]">
              {incluye.map(x => <li key={x} className="tick"><Visto tam={18} /><span>{x}</span></li>)}
            </ul>
          </div>
          <A pagina="Contacto" className="flex min-h-11 items-center justify-center text-center font-semibold no-underline">¿Tienes dudas? Escríbenos</A>
        </aside>
      </div>

      {!curso.finalizado && (
        <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t border-linea bg-white px-5 py-3 shadow-[0_-6px_20px_rgba(22,32,44,0.06)] lg:hidden">
          <div className="flex flex-col"><span className="font-bold">{curso.precio.texto}</span>{curso.cupos > 0 && <span className="text-[13px] text-verde">{curso.cupos === 1 ? 'Queda 1 cupo' : `Quedan ${curso.cupos} cupos`}</span>}</div>
          <div className="w-40"><Llamada curso={curso} inscrito={inscrito} compacto /></div>
        </div>
      )}

      <Preguntas titulo="Preguntas sobre este curso" lista={preguntasCurso(curso)} />
    </Marco>
  );
}
