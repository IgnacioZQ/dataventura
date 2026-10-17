// Inicio del panel de instructor (Claude Design, artboard Panel instructor), con datos reales: cifras de la
// semana, próximas clases en vivo, entregas por revisar, acciones rápidas y exportación de estudiantes.
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Award, CheckSquare, Megaphone, Plus, Upload, Video } from 'lucide-react';
import { api } from '@/api/client';
import { Esqueleto, estadoClase, horaCorta, iniciales } from '@/components/rediseno/Panel';
import ExportStudentsData from './ExportStudentsData';

const DIA = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function hace(fecha) {
  const min = Math.round((Date.now() - new Date(fecha)) / 60000);
  if (min < 60) return `hace ${Math.max(1, min)} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}

function Cifra({ titulo, valor, retraso, alerta }) {
  return (
    <div className={`card flex flex-col gap-1.5 p-5 ${alerta ? '!border-[#F6DCCB] !bg-[#FFF6F0]' : ''}`}>
      <span className={alerta ? 'text-naranja' : 'text-gris'}>{titulo}</span>
      <motion.span className={`stat-num ${alerta ? 'text-naranja' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: retraso, ease: [0.2, 0.7, 0.2, 1] }}>{valor}</motion.span>
    </div>
  );
}

export default function InstructorHome({ onNavigate }) {
  const instructor = useMemo(() => { try { return JSON.parse(localStorage.getItem('instructorSession') || 'null'); } catch { return null; } }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inicio-instructor', instructor?.email],
    enabled: !!instructor?.email,
    refetchInterval: 30000,
    queryFn: async () => {
      const { data: panel } = await api.functions.invoke('getInstructorDashboard', { instructorEmail: instructor.email });
      const tareas = await api.entities.Assignment.filter({ instructor_email: instructor.email });
      const entregas = tareas.length ? await api.entities.Submission.filter({ assignment_id: { $in: tareas.map(t => t.id) }, status: 'submitted' }, '-created_date') : [];
      return { ...panel, tareas, entregas };
    }
  });

  const r = useMemo(() => {
    if (!data) return null;
    const activos = data.courses || [];
    const ids = new Set(activos.map(c => c.id));
    const ahora = new Date();
    const vivas = (data.lessons || []).filter(l => ids.has(l.course_id) && l.type === 'live' && l.scheduled_date).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    const lunes = new Date(ahora); lunes.setHours(0, 0, 0, 0); lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
    const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 7);
    const semana = vivas.filter(l => { const d = new Date(l.scheduled_date); return d >= lunes && d < domingo; }).length;
    const proximas = vivas.filter(l => estadoClase(l, ahora) !== 'terminada').slice(0, 3);
    const tareaPorId = Object.fromEntries(data.tareas.map(t => [t.id, t]));
    const curso = id => activos.find(c => c.id === id) || (data.allCourses || []).find(c => c.id === id);
    return { activos, semana, proximas, curso, tareaPorId, porCurso: id => (data.students || []).filter(s => s.course_id === id).length };
  }, [data]);

  const primero = r?.activos[0]?.id;
  const ir = (seccion, cursoId = primero) => cursoId && onNavigate?.(`course-${cursoId}-${seccion}`);

  if (isError) {
    return (
      <div className="card flex flex-col items-start gap-3 p-6" role="alert">
        <h1 className="h text-2xl">No pudimos cargar tu panel</h1>
        <p className="m-0 text-texto">Revisa tu conexión e inténtalo de nuevo.</p>
        <button type="button" className="btn btn-s" onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  if (isLoading || !r) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <Esqueleto alto={60} className="max-w-md" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <Esqueleto key={i} alto={104} />)}</div>
        <div className="grid gap-5 lg:grid-cols-2"><Esqueleto alto={240} /><Esqueleto alto={240} /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1"><h1 className="h text-[30px]">Panel de instructor</h1><span className="text-gris">Gestiona tus cursos y estudiantes desde aquí</span></div>
        <button type="button" className="btn btn-p active:scale-[0.98]" onClick={() => (primero ? ir('content') : onNavigate?.('courses'))}><Plus className="size-[18px]" strokeWidth={2} />{primero ? 'Agendar clase' : 'Crear un curso'}</button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Cifra titulo="Cursos activos" valor={r.activos.length} retraso={0} />
        <Cifra titulo="Estudiantes activos" valor={(data.students || []).length} retraso={0.08} />
        <Cifra titulo="Clases esta semana" valor={r.semana} retraso={0.16} />
        <Cifra titulo="Tareas por revisar" valor={data.entregas.length} retraso={0.24} alerta={data.entregas.length > 0} />
      </div>

      {!r.activos.length && (
        <div className="card flex flex-col items-start gap-2.5 p-6">
          <h2 className="h text-2xl">Todavía no tienes cursos activos</h2>
          <p className="m-0 max-w-[48em] text-texto">Crea un curso en «Mis cursos» y cámbialo a «Activo» cuando empiece: así aparecerá aquí, en la barra lateral, en asistencia, mensajería y en la lista para agregar estudiantes.</p>
          <button type="button" className="btn btn-s mt-1" onClick={() => onNavigate?.('courses')}>Ir a mis cursos</button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card px-6 pb-3 pt-2">
          <div className="flex items-center justify-between pb-1.5 pt-3.5"><h2 className="m-0 text-[17px] font-semibold">Próximas clases</h2><span className="text-sm text-gris">En vivo</span></div>
          {r.proximas.length ? r.proximas.map(l => {
            const d = new Date(l.scheduled_date);
            const activa = estadoClase(l) === 'activa';
            return (
              <div key={l.id} className="fila">
                <div className="w-[52px] flex-none text-center"><div className="text-xs font-semibold text-gris">{DIA[d.getDay()]}</div><div className="h text-[22px]">{d.getDate()}</div></div>
                <div className="min-w-0 flex-1"><div className="truncate font-semibold">{l.title}</div><div className="truncate text-sm text-gris">{r.curso(l.course_id)?.title} · {horaCorta(d)}</div></div>
                {l.meet_link
                  ? <a className={`btn ${activa ? 'btn-p' : 'btn-s'} !min-h-[38px] !text-sm`} href={l.meet_link} target="_blank" rel="noopener noreferrer">{activa ? <><Video className="size-4" />Iniciar</> : 'Enlace'}<span className="sr-only"> (se abre en otra pestaña)</span></a>
                  : <button type="button" className="btn btn-s !min-h-[38px] !text-sm" onClick={() => ir('content', l.course_id)}>Editar</button>}
              </div>
            );
          }) : <p className="m-0 py-4 text-texto">No hay clases en vivo agendadas. Agrégalas desde el contenido de cada curso.</p>}
        </section>

        <section className="card px-6 pb-3 pt-2">
          <div className="flex items-center justify-between pb-1.5 pt-3.5"><h2 className="m-0 text-[17px] font-semibold">Entregas por revisar</h2>{data.entregas.length > 0 && <span className="pill !bg-naranja-suave !text-naranja">{data.entregas.length === 1 ? '1 pendiente' : `${data.entregas.length} pendientes`}</span>}</div>
          {data.entregas.length ? data.entregas.slice(0, 3).map(s => {
            const tarea = r.tareaPorId[s.assignment_id];
            return (
              <div key={s.id} className="fila">
                <span className="flex size-[34px] flex-none items-center justify-center rounded-full bg-azul-suave text-[13px] font-bold text-marino">{iniciales(s.student_name)}</span>
                <div className="min-w-0 flex-1"><div className="truncate font-semibold">{s.student_name || s.student_email}</div><div className="truncate text-sm text-gris">{tarea?.title || 'Tarea'} · {hace(s.created_date)}</div></div>
                <button type="button" className="btn btn-s !min-h-[38px] !text-sm" onClick={() => ir('assignments', tarea?.course_id)}>Revisar</button>
              </div>
            );
          }) : <p className="m-0 py-4 text-texto">No hay entregas esperando revisión.</p>}
        </section>
      </div>

      {r.activos.length > 0 && (
        <section className="card flex flex-col gap-3.5 p-6">
          <h2 className="m-0 text-[17px] font-semibold">Acciones rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[['Publicar anuncio', Megaphone, 'announcements'], ['Subir material', Upload, 'content'], ['Tomar asistencia', CheckSquare, 'attendance'], ['Generar certificados', Award, 'certificates']].map(([t, Icono, s]) => (
              <button key={s} type="button" className="act active:scale-[0.98]" onClick={() => ir(s)}><span className="ico !size-9 !rounded-[10px]"><Icono className="size-[18px]" strokeWidth={1.8} /></span>{t}</button>
            ))}
          </div>
          {r.activos.length > 1 && <p className="m-0 text-sm text-gris">Las acciones abren «{r.activos[0].title}». Para otro curso, elígelo en la barra lateral.</p>}
        </section>
      )}

      {r.activos.length > 0 && (
        <section className="card px-6 pb-3 pt-2">
          <h2 className="m-0 pb-1.5 pt-3.5 text-[17px] font-semibold">Tus cursos activos</h2>
          {r.activos.map(c => (
            <div key={c.id} className="fila">
              <div className="min-w-0 flex-1"><div className="truncate font-semibold">{c.title}</div><div className="text-sm text-gris">{r.porCurso(c.id)} estudiantes{c.schedule ? ` · ${c.schedule}` : ''}</div></div>
              <button type="button" className="btn btn-s !min-h-[38px] !text-sm" onClick={() => ir('students', c.id)}>Abrir</button>
            </div>
          ))}
        </section>
      )}

      {instructor?.email && <ExportStudentsData instructorEmail={instructor.email} />}
    </div>
  );
}
