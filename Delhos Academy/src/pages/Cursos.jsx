// Catálogo de cursos del rediseño: filtro por nivel, búsqueda y filas con brillo bajo el cursor.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';
import { A, Marco } from '@/components/rediseno/Marco';
import { Iman, Revelar } from '@/components/rediseno/Movimiento';
import { FilaCurso, useCursos } from '@/lib/catalogo';

const NIVELES = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];
const ESTADOS = [['todos', 'Todos'], ['abiertos', 'Postulaciones abiertas'], ['curso', 'En curso']];

export default function Cursos() {
  const { cursos, cargando } = useCursos();
  const [params, setParams] = useSearchParams();
  const nivel = params.get('nivel') ?? 'Todos';
  const estado = params.get('estado') ?? 'todos';
  const busqueda = params.get('q') ?? '';
  const fijar = (clave, valor, porDefecto) => setParams(p => {
    const n = new URLSearchParams(p);
    if (!valor || valor === porDefecto) n.delete(clave); else n.set(clave, valor);
    return n;
  }, { replace: true });
  const setNivel = v => fijar('nivel', v, 'Todos');
  const setEstado = v => fijar('estado', v, 'todos');
  const setBusqueda = v => fijar('q', v, '');

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return cursos
      .filter(c => nivel === 'Todos' || c.nivel === nivel)
      .filter(c => estado === 'todos' || (estado === 'abiertos' ? c.abierto : c.enCurso))
      .filter(c => !q || `${c.titulo} ${c.descripcion} ${c.herramientas.join(' ')} ${c.categoria}`.toLowerCase().includes(q));
  }, [cursos, nivel, estado, busqueda]);

  const hayFiltros = nivel !== 'Todos' || estado !== 'todos' || busqueda;

  return (
    <Marco>
      <section className="pb-12 pt-20">
        <div className="wrap grid items-end gap-x-16 gap-y-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="eyebrow rise">Catálogo</span>
            <h1 className="h rise" style={{ fontSize: 'clamp(44px, 5.4vw, 68px)', animationDelay: '.1s' }}>Cursos</h1>
          </div>
          <p className="lead rise" style={{ animationDelay: '.2s' }}>Todos los cursos son en vivo, quedan grabados e incluyen certificado. Filtra por nivel o busca un tema.</p>
        </div>
      </section>

      <section className="pb-[104px]">
        <div className="wrap flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="flex flex-col gap-1">
              <div role="group" aria-label="Filtrar por nivel" className="flex flex-wrap gap-x-7 gap-y-1">
                {NIVELES.map(l => <button key={l} type="button" className={`fbtn ${nivel === l ? 'on' : ''}`} aria-pressed={nivel === l} onClick={() => setNivel(l)}>{l}</button>)}
              </div>
              <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2 pt-2">
                {ESTADOS.map(([id, t]) => <button key={id} type="button" className={`opt !min-h-9 !text-sm active:scale-[0.97] ${estado === id ? 'on' : ''}`} aria-pressed={estado === id} onClick={() => setEstado(id)}>{t}</button>)}
              </div>
            </div>
            <div className="relative min-w-[240px] flex-[0_1_340px]">
              <label htmlFor="buscar" className="sr-only">Buscar cursos</label>
              <Search className="absolute left-1 top-[15px] size-[18px] text-gris" strokeWidth={2} aria-hidden />
              <input id="buscar" name="q" autoComplete="off" enterKeyHint="search" className="inp-linea" type="search" placeholder="Buscar por tema o herramienta…" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="thead" aria-hidden><span>Curso · {cargando ? 'cargando…' : visibles.length === 1 ? '1 resultado' : `${visibles.length} resultados`}</span><span>Nivel</span><span>Inicio</span><span>Duración</span><span>Valor</span><span /></div>
            <p className="sr-only" aria-live="polite">{cargando ? '' : `${visibles.length} cursos`}</p>
            <div className="border-t border-tinta">
              {cargando && [0, 1, 2, 3].map(i => <div key={i} className="h-[118px] animate-pulse border-b border-linea bg-[linear-gradient(90deg,#F7F8FA,#EEF1F4,#F7F8FA)]" />)}
              <AnimatePresence initial={false}>
                {!cargando && visibles.map((c, i) => (
                  <motion.div key={c.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                    <FilaCurso curso={c} conDuracion />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {!cargando && !visibles.length && (
              <div className="flex flex-col gap-3 border-b border-linea py-14">
                {cursos.length ? (
                  <>
                    <h2 className="h text-[26px]">No encontramos cursos con ese filtro</h2>
                    <p className="m-0 text-texto">Prueba con otro nivel o tema, <button type="button" className="font-semibold text-azul underline-offset-4 hover:underline" onClick={() => setParams({}, { replace: true })}>quita los filtros</button> o <A pagina="Contacto" className="font-semibold">cuéntanos qué te gustaría aprender</A>.</p>
                  </>
                ) : (
                  <>
                    <h2 className="h text-[26px]">Estamos preparando la próxima cohorte</h2>
                    <p className="m-0 max-w-[40em] text-texto">Todavía no hay cursos con postulaciones abiertas. <A pagina="Contacto" className="font-semibold">Escríbenos</A> y te avisamos apenas se publiquen, o revisa los <A pagina="Webinars" className="font-semibold">webinars y workshops</A>.</p>
                  </>
                )}
              </div>
            )}
            {hayFiltros && !cargando && visibles.length > 0 && <p className="mt-4 text-sm text-gris">Mostrando {visibles.length} de {cursos.length} cursos.</p>}
          </div>

          <Revelar className="mt-12 grid items-center gap-x-16 gap-y-6 border-t border-linea-fuerte pt-10 lg:grid-cols-2">
            <div className="flex flex-col gap-2.5">
              <h2 className="h" style={{ fontSize: 'clamp(26px, 2.6vw, 34px)' }}>¿No sabes por dónde empezar?</h2>
              <p className="m-0 leading-[1.65] text-texto">Cuéntanos qué haces hoy y qué quieres lograr, y te recomendamos una ruta. También puedes partir por uno de nuestros webinars.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Iman><A pagina="Contacto" className="btn btn-p active:scale-[0.98]">Pedir una recomendación</A></Iman>
              <A pagina="Webinars" className="navl fuerte">Ver webinars <span aria-hidden>→</span></A>
            </div>
          </Revelar>
        </div>
      </section>
    </Marco>
  );
}
