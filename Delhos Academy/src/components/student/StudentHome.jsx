// Inicio del panel de estudiante (Claude Design, artboard Panel estudiante), con los datos reales del curso:
// próxima clase en vivo, avance, tareas pendientes, anuncios y la semana.
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { api } from '@/api/client';
import { diasHasta, Esqueleto, estadoClase, fechaCorta, horaCorta } from '@/components/rediseno/Panel';
import InstructorContact from './InstructorContact';
import StudentCertificateDownload from './StudentCertificateDownload';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function Anillo({ pct }) {
  const r = 42, c = 2 * Math.PI * r;
  return (
    <svg width="104" height="104" viewBox="0 0 100 100" role="img" aria-label={`Avance del curso: ${pct} por ciento`} className="flex-none">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#EEF1F4" strokeWidth="9" />
      <motion.circle cx="50" cy="50" r={r} fill="none" stroke="#2E6DB4" strokeWidth="9" strokeLinecap="round" transform="rotate(-90 50 50)" strokeDasharray={c}
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - pct / 100) }} transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1], delay: 0.3 }} />
      <text x="50" y="56" textAnchor="middle" fill="#16202C" style={{ font: '700 20px "Figtree Variable", sans-serif' }}>{pct}%</text>
    </svg>
  );
}

export default function StudentHome({ onCourseSelect, studentData, onNavigate }) {
  const { data: estudiante = studentData } = useQuery({
    queryKey: ['student', studentData?.id],
    queryFn: async () => (await api.entities.Student.filter({ id: studentData.id }))[0] || studentData,
    enabled: !!studentData?.id,
    refetchInterval: 15000,
    initialData: studentData
  });
  const cursoId = estudiante?.course_id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inicio-estudiante', cursoId, estudiante?.id],
    enabled: !!cursoId,
    refetchInterval: 30000,
    queryFn: async () => {
      const [{ data: panel }, tareas, entregas, anuncios] = await Promise.all([
        api.functions.invoke('getStudentDashboard', { courseId: cursoId }),
        api.entities.Assignment.filter({ course_id: cursoId, status: 'active' }),
        api.entities.Submission.filter({ student_id: estudiante.id }),
        api.entities.Announcement.filter({ course_id: cursoId }, '-created_date', 3)
      ]);
      return { ...panel, tareas, entregas, anuncios };
    }
  });

  const r = useMemo(() => {
    if (!data) return null;
    const ahora = new Date();
    const vivas = (data.lessons || []).filter(l => l.type === 'live' && l.scheduled_date).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    const terminadas = vivas.filter(l => estadoClase(l, ahora) === 'terminada' || l.is_completed);
    const proxima = vivas.find(l => estadoClase(l, ahora) !== 'terminada');
    const entregadas = new Set(data.entregas.map(s => s.assignment_id));
    const pendientes = data.tareas.filter(t => !entregadas.has(t.id)).sort((a, b) => new Date(a.due_date || 8.64e15) - new Date(b.due_date || 8.64e15));
    const lunes = new Date(ahora); lunes.setHours(0, 0, 0, 0); lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
    const semana = DIAS.map((nombre, i) => {
      const dia = new Date(lunes); dia.setDate(lunes.getDate() + i);
      const mismo = f => { const d = new Date(f); return d.getFullYear() === dia.getFullYear() && d.getMonth() === dia.getMonth() && d.getDate() === dia.getDate(); };
      const clase = vivas.find(l => mismo(l.scheduled_date));
      const entrega = data.tareas.find(t => t.due_date && mismo(t.due_date));
      return { nombre, hoy: dia.toDateString() === ahora.toDateString(), clase, entrega };
    });
    const total = vivas.length;
    const pct = estudiante?.progress > 0 ? Math.round(estudiante.progress) : total ? Math.round((terminadas.length / total) * 100) : 0;
    return { proxima, estado: proxima ? estadoClase(proxima, ahora) : null, terminadas: terminadas.length, total, pendientes, entregadasN: data.tareas.filter(t => entregadas.has(t.id)).length, semana, pct };
  }, [data, estudiante?.progress]);

  const nombre = (estudiante?.name || '').split(' ')[0];

  if (!cursoId) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="h text-[30px]">Hola{nombre ? `, ${nombre}` : ''}</h1>
        <div className="card flex flex-col items-start gap-3 p-8">
          <h2 className="h text-2xl">Aún no tienes un curso asignado</h2>
          <p className="m-0 max-w-[40em] text-texto">Cuando tu instructor confirme tu inscripción, aquí verás tus clases en vivo, tareas y anuncios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {estudiante?.certificate_enabled && <StudentCertificateDownload studentData={estudiante} />}
      <div className="flex flex-col gap-1">
        <h1 className="h text-[30px]">Hola{nombre ? `, ${nombre}` : ''}</h1>
        <span className="text-gris">{[estudiante?.course_name || data?.course?.title, r?.total ? `${r.terminadas} de ${r.total} clases` : null].filter(Boolean).join(' · ')}</span>
      </div>

      {isError ? (
        <div className="card flex flex-col items-start gap-3 p-6" role="alert">
          <h2 className="h text-xl">No pudimos cargar tu panel</h2>
          <p className="m-0 text-texto">Revisa tu conexión e inténtalo de nuevo.</p>
          <button type="button" className="btn btn-s" onClick={() => refetch()}>Reintentar</button>
        </div>
      ) : isLoading || !r ? (
        <div className="grid gap-5 md:grid-cols-2" aria-busy="true"><Esqueleto alto={150} className="md:col-span-2" /><Esqueleto alto={150} /><Esqueleto alto={150} /></div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <section className="card flex flex-wrap items-center justify-between gap-5 !border-marino !bg-marino p-6 text-white md:col-span-2">
            {r.proxima ? (
              <>
                <div className="flex flex-col gap-2">
                  <span className="pill w-fit !bg-white/[.12] !text-white">{r.estado === 'activa' && <span className="dot live" />}{r.estado === 'activa' ? 'En vivo ahora' : `${fechaCorta(r.proxima.scheduled_date)} · ${horaCorta(r.proxima.scheduled_date)} hrs`}</span>
                  <h2 className="h text-[26px] !text-white">{r.proxima.title}</h2>
                  <span className="text-[#C7D2DE]">{data.course?.instructor_name ? `Con ${data.course.instructor_name} · ` : ''}El enlace se activa 15 minutos antes</span>
                </div>
                {r.estado === 'activa' && r.proxima.meet_link
                  ? <a className="btn btn-w active:scale-[0.98]" href={r.proxima.meet_link} target="_blank" rel="noopener noreferrer"><Video className="size-[18px]" strokeWidth={2} />Entrar a la clase<span className="sr-only"> (se abre en otra pestaña)</span></a>
                  : <button type="button" className="btn btn-w active:scale-[0.98]" onClick={() => onCourseSelect({ id: cursoId })}>Ver el curso</button>}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2"><span className="text-[#C7D2DE]">Tu curso</span><h2 className="h text-[26px] !text-white">{estudiante?.course_name || data.course?.title}</h2><span className="text-[#C7D2DE]">No hay clases en vivo agendadas por ahora.</span></div>
                <button type="button" className="btn btn-w active:scale-[0.98]" onClick={() => onCourseSelect({ id: cursoId })}>Acceder al contenido</button>
              </>
            )}
          </section>

          <section className="card flex items-center gap-5 p-6">
            <Anillo pct={r.pct} />
            <div className="flex flex-col gap-1">
              <span className="text-[17px] font-bold">Tu avance</span>
              <span className="text-texto">{r.total ? `${r.terminadas} de ${r.total} clases` : 'Sin clases agendadas aún'}</span>
              <span className="text-texto">{data.tareas.length ? `${r.entregadasN} de ${data.tareas.length} tareas entregadas` : 'Sin tareas publicadas'}</span>
            </div>
          </section>

          <section className="card flex flex-col gap-1.5 p-6">
            <div className="flex items-center justify-between"><h2 className="m-0 text-[17px] font-semibold">Tareas pendientes</h2><button type="button" className="btn btn-s !min-h-9 !px-3 !text-sm" onClick={() => onNavigate?.('assignments')}>Ver todas</button></div>
            {r.pendientes.length ? r.pendientes.slice(0, 3).map(t => {
              const d = t.due_date ? diasHasta(t.due_date) : null;
              const urgente = d !== null && d <= 3;
              return (
                <div key={t.id} className="fila">
                  <span className={`size-2.5 flex-none rounded-full ${urgente ? 'bg-naranja-vivo' : 'bg-linea-fuerte'}`} />
                  <div className="min-w-0 flex-1"><div className="truncate font-semibold">{t.title}</div><div className="text-sm text-gris">{t.due_date ? `Vence el ${new Date(t.due_date).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })}` : 'Sin fecha de entrega'}</div></div>
                  {d !== null && <span className={`pill ${urgente ? '!bg-naranja-suave !text-naranja' : '!bg-[#F1F3F6] !text-[#2C3846]'}`}>{d < 0 ? 'Atrasada' : d === 0 ? 'Hoy' : d === 1 ? 'Mañana' : `${d} días`}</span>}
                </div>
              );
            }) : <p className="m-0 py-3 text-texto">No tienes tareas pendientes. Buen trabajo.</p>}
          </section>

          <section className="card flex flex-col gap-1.5 p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between"><h2 className="m-0 text-[17px] font-semibold">Anuncios</h2>{data.anuncios.length > 0 && <button type="button" className="btn btn-s !min-h-9 !px-3 !text-sm" onClick={() => onNavigate?.('announcements')}>Ver todos</button>}</div>
            {data.anuncios.length ? data.anuncios.slice(0, 2).map(a => (
              <div key={a.id} className="fila !items-start">
                <span className={`pill ${a.read_by?.includes(estudiante.id) ? '!bg-[#F1F3F6] !text-[#2C3846]' : ''}`}>{a.read_by?.includes(estudiante.id) ? 'Aviso' : 'Nuevo'}</span>
                <div className="min-w-0"><div className="font-semibold">{a.title}</div><div className="line-clamp-2 text-sm leading-normal text-gris">{a.content}</div></div>
              </div>
            )) : <p className="m-0 py-3 text-texto">Tu instructor todavía no publica anuncios.</p>}
          </section>

          <section className="card flex flex-col gap-4 p-6 md:col-span-2 lg:col-span-1">
            <h2 className="m-0 text-[17px] font-semibold">Esta semana</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {r.semana.filter((d, i) => i < 5 || d.clase || d.entrega).map(d => (
                <div key={d.nombre} className={`rounded-xl p-3.5 ${d.hoy ? 'bg-azul-suave outline outline-2 outline-azul' : d.entrega ? 'bg-[#FFF6F0]' : 'bg-papel'}`}>
                  <div className={`text-[13px] ${d.hoy ? 'font-semibold text-marino-700' : d.entrega ? 'text-naranja' : 'text-gris'}`}>{d.nombre}{d.hoy ? ' · hoy' : ''}</div>
                  <div className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">{d.clase ? `${d.clase.title} · ${horaCorta(d.clase.scheduled_date)}` : d.entrega ? 'Entrega de tarea' : 'Sin clases'}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <InstructorContact studentData={estudiante} />
    </div>
  );
}
