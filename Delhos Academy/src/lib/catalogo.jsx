// Catálogo público: cursos y eventos (webinars y workshops) leídos de la capa de datos local
// (src/api/client.js), normalizados para las páginas del rediseño. Las fechas las escribe el instructor como
// texto libre («Marzo 2026», «15 de Abril 2026»), así que se muestran tal cual y solo se interpretan para ordenar.
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/api/client';
import { A } from '@/components/rediseno/Marco';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Interpreta «15 de abril 2026», «Abril 2026», «2026-04-15» o «15/04/2026». Devuelve null si no se puede. */
export function leerFecha(texto) {
  if (!texto) return null;
  const t = String(texto).toLowerCase().trim();
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return { fecha: new Date(+m[1], +m[2] - 1, +m[3]), dia: +m[3], mes: +m[2] - 1 };
  m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (m) return { fecha: new Date(+m[3], +m[2] - 1, +m[1]), dia: +m[1], mes: +m[2] - 1 };
  const mes = MESES.findIndex(n => t.includes(n) || t.includes(n.slice(0, 3) + ' ') || t.includes(n.slice(0, 3) + '.'));
  if (mes < 0) return null;
  const anio = +(t.match(/\b(20\d{2})\b/)?.[1] ?? new Date().getFullYear());
  const dia = +(t.match(/^(\d{1,2})\b/)?.[1] ?? 0);
  return { fecha: new Date(anio, mes, dia || 1), dia: dia || null, mes };
}

export const mesCorto = i => MESES[i]?.slice(0, 3).toUpperCase() ?? '';

/** «comienza el 15 de abril» o «comienza en marzo de 2026», según cómo esté escrita la fecha. */
export const cuando = texto => (/^\d/.test(String(texto).trim()) ? `el ${texto}` : `en ${texto}`);

const clp = n => `$${Math.round(n).toLocaleString('es-CL')}`;

/** Precio con descuento ya aplicado, en pesos chilenos. */
export function precio(valor, descuento = 0) {
  if (!valor) return { gratis: true, texto: 'Gratuito', final: 0 };
  const final = descuento > 0 ? valor * (1 - descuento / 100) : valor;
  return { gratis: false, final, texto: `${clp(final)} CLP`, original: descuento > 0 ? `${clp(valor)} CLP` : null, descuento: descuento > 0 ? descuento : 0 };
}

const lista = v => (Array.isArray(v) ? v.filter(Boolean) : typeof v === 'string' && v.trim() ? v.split(/[,\n]/).map(s => s.trim()).filter(Boolean) : []);

export function normalizarCurso(c) {
  const f = leerFecha(c.start_date);
  return {
    id: c.id,
    crudo: c,
    titulo: c.title || 'Curso sin título',
    resumen: c.short_description || c.description || '',
    descripcion: c.description || '',
    nivel: c.level || 'Principiante',
    estado: c.status,
    abierto: c.status === 'open_for_registration',
    enCurso: c.status === 'active',
    finalizado: c.status === 'finished',
    estadoTexto: c.status === 'active' ? 'En curso' : c.status === 'finished' ? 'Finalizado' : 'Postulaciones abiertas',
    inicio: c.start_date || '',
    inicioLargo: c.start_date || '',
    inicioFecha: f?.fecha?.getTime() ?? Number.MAX_SAFE_INTEGER,
    termino: c.end_date || '',
    duracion: c.duration || '',
    clases: c.total_lessons || null,
    horario: c.schedule || '',
    idioma: c.language || 'Español',
    cupos: typeof c.available_spots === 'number' ? c.available_spots : null,
    precio: precio(c.price, c.discount),
    categoria: c.category || '',
    imagen: c.image_url || '',
    video: c.promo_video_url || '',
    instructorCorreo: c.instructor_email || '',
    instructorNombre: c.instructor_name || '',
    aprenderas: lista(c.learning_outcomes),
    modulos: (Array.isArray(c.curriculum) ? c.curriculum : []).map(m => (typeof m === 'object' ? { t: m.title || '', d: m.description || '' } : { t: String(m), d: '' })).filter(m => m.t),
    requisitos: lista(c.requirements),
    metodologia: c.methodology || '',
    publico: lista(c.target_audience),
    herramientas: lista(c.tools_used),
    incluye: lista(c.includes),
    etiquetas: lista(c.tags)
  };
}

export function normalizarEvento(w) {
  const f = leerFecha(w.date);
  return {
    id: w.id,
    tipo: w.type === 'workshop' ? 'Workshop' : 'Webinar',
    titulo: w.title || 'Evento sin título',
    descripcion: w.description || '',
    fecha: w.date || '',
    dia: f?.dia ?? null,
    mes: f ? mesCorto(f.mes) : '',
    orden: f?.fecha?.getTime() ?? Number.MAX_SAFE_INTEGER,
    hora: w.time || '',
    duracion: w.duration || '',
    precio: precio(w.price),
    cupos: typeof w.available_spots === 'number' ? w.available_spots : null,
    enVivo: w.status === 'live',
    finalizado: w.status === 'finished',
    enlace: w.meet_link || '',
    temas: lista(w.topics),
    requisitos: lista(w.requirements),
    instructorCorreo: w.instructor_email || '',
    instructorNombre: w.instructor_name || '',
    imagen: w.image_url || ''
  };
}

/** Se suscribe a los cambios de una entidad para refrescar la consulta (por ejemplo, si un instructor edita). */
function useRefrescar(entidad, clave) {
  const cliente = useQueryClient();
  useEffect(() => api.entities[entidad].subscribe(() => cliente.invalidateQueries({ queryKey: [clave] })), [cliente, entidad, clave]);
}

/** Cursos visibles al público (postulaciones abiertas o en curso), los abiertos primero y luego por fecha de inicio. */
export function useCursos() {
  useRefrescar('Course', 'cursos-publicos');
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['cursos-publicos'],
    queryFn: async () => (await api.entities.Course.list('-created_date'))
      .filter(c => c.status === 'open_for_registration' || c.status === 'active')
      .map(normalizarCurso)
      .sort((a, b) => Number(b.abierto) - Number(a.abierto) || a.inicioFecha - b.inicioFecha)
  });
  return { cursos: data, cargando: isLoading, error };
}

export function useCurso(id) {
  useRefrescar('Course', `curso-${id}`);
  const { data, isLoading, error } = useQuery({
    queryKey: [`curso-${id}`],
    enabled: !!id,
    queryFn: async () => {
      const c = (await api.entities.Course.filter({ id }))[0];
      if (!c) return null;
      const curso = normalizarCurso(c);
      const instructor = curso.instructorCorreo ? (await api.entities.Instructor.filter({ email: curso.instructorCorreo }))[0] ?? null : null;
      return { curso, instructor };
    }
  });
  return { datos: data ?? null, cargando: !!id && isLoading, error };
}

/** Eventos que no han terminado, del más próximo al más lejano. */
export function useEventos() {
  useRefrescar('Webinar', 'eventos-publicos');
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['eventos-publicos'],
    queryFn: async () => (await api.entities.Webinar.list('-created_date'))
      .filter(w => w.status !== 'finished')
      .map(normalizarEvento)
      .sort((a, b) => Number(b.enVivo) - Number(a.enVivo) || a.orden - b.orden)
  });
  return { eventos: data, cargando: isLoading, error };
}

export function useInstructores() {
  const { data = [] } = useQuery({
    queryKey: ['instructores-publicos'],
    queryFn: async () => api.entities.Instructor.filter({ status: 'active' })
  });
  return data;
}

/** Fila de curso del diseño: número, título, resumen, nivel, inicio, valor y flecha. */
export function FilaCurso({ curso, numero, conDuracion = false }) {
  const meta = [curso.nivel, curso.inicio && `Inicio ${curso.inicio}`, curso.precio.texto].filter(Boolean).join(' · ');
  return (
    <A pagina="CursoDetalle" query={`?id=${curso.id}`} className={`crow spot ${numero ? '' : 'sin-numero'}`}>
      {numero ? <span className="cn h text-xl text-gris">{String(numero).padStart(2, '0')}</span> : null}
      <span className="flex min-w-0 flex-col gap-1.5">
        {!numero && <span className={`text-[13px] font-semibold ${curso.abierto ? 'text-verde' : 'text-gris'}`}>{curso.estadoTexto}</span>}
        <span className="h ct" style={{ fontSize: 'clamp(22px, 2.2vw, 28px)' }}>{curso.titulo}</span>
        {curso.resumen && <span className="line-clamp-2 text-texto">{curso.resumen}</span>}
        <span className="cmob">{meta}</span>
      </span>
      <span className="cm text-texto">{curso.nivel}</span>
      <span className="cm text-texto">{curso.inicio ? `${numero ? 'Inicio ' : ''}${curso.inicio}` : 'Por confirmar'}</span>
      {conDuracion && <span className="cm text-texto">{curso.duracion || '—'}</span>}
      <span className="cm font-bold">
        {curso.precio.texto}
        {curso.precio.original && <span className="block text-[13px] font-medium text-gris"><span className="sr-only">Precio anterior: </span><del>{curso.precio.original}</del></span>}
      </span>
      <span className="arr" aria-hidden>→</span>
    </A>
  );
}
