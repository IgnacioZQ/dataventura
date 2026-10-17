// Capa de datos de Delhos Academy, sin servidor.
//
// El sitio nació en Base44, que ya no se usa. Esta capa conserva la misma forma de uso que tenía su SDK
// (api.entities.Curso.list(), api.functions.invoke(...), api.integrations.Core.UploadFile(...)), así las
// pantallas no cambian y, el día que exista un backend propio, basta con reemplazar este archivo.
//
// De dónde salen los datos:
// - src/data/datos-iniciales.json: el contenido publicado (cursos, webinars, instructores...). Es lo que ve
//   cualquier visitante.
// - El navegador (localStorage): lo que se crea, edita o borra desde el sitio queda guardado solo en ese
//   navegador, encima del contenido publicado. Sirve para trabajar y probar en local; para que estudiantes
//   e instructores compartan datos entre equipos hace falta un backend.
import datosIniciales from '@/data/datos-iniciales.json';

const CLAVE = 'delhos_academy_datos_v1';
const PESO_MAXIMO_ARCHIVO = 2 * 1024 * 1024;

/** Valores por defecto de cada entidad (los mismos que definía su esquema en Base44). */
const POR_DEFECTO = {
  Announcement: { read_by: [] },
  Assignment: { max_grade: 100, status: 'active' },
  Attendance: { attended: false },
  Congratulation: { points: 0 },
  Course: { level: 'Principiante', discount: 0, status: 'open_for_registration' },
  CourseLesson: { is_completed: false },
  CourseModule: { is_locked: false },
  ForumPost: { likes: [] },
  ForumThread: { is_pinned: false },
  Grade: { max_grade: 100 },
  Inscription: {},
  Instructor: { status: 'active' },
  Message: { is_read: false },
  Student: {
    progress: 0, points: 0, streak: 0, badges: [], status: 'active', has_logged_in: false,
    certificate_enabled: false, certificate_hours: 40
  },
  Submission: { status: 'submitted' },
  Webinar: { type: 'webinar', price: 0, status: 'upcoming' }
};

// ---------------------------------------------------------------- almacenamiento

/** Cambios hechos en este navegador: { Entidad: { id: registro | null } } (null = borrado). */
let cambios = leerCambios();
const oyentes = new Map();

function leerCambios() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado && typeof guardado === 'object') return guardado;
  } catch { /* sin almacenamiento o dato corrupto: se parte de cero */ }
  return {};
}

function guardarCambios() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(cambios));
  } catch (error) {
    throw new Error(error?.name === 'QuotaExceededError'
      ? 'El navegador no tiene más espacio para guardar datos de la Academy.'
      : 'No se pudieron guardar los datos en este navegador.');
  }
}

// Si otra pestaña cambia los datos, esta se entera.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) cambios = leerCambios();
  });
}

function registros(entidad) {
  const porId = new Map((datosIniciales[entidad] || []).map(r => [r.id, r]));
  for (const [id, registro] of Object.entries(cambios[entidad] || {})) {
    if (registro === null) porId.delete(id);
    else porId.set(id, registro);
  }
  return [...porId.values()].map(copiar);
}

function escribir(entidad, id, registro) {
  const previo = cambios[entidad]?.[id];
  cambios[entidad] = { ...cambios[entidad], [id]: registro };
  try {
    guardarCambios();
  } catch (error) {
    if (previo === undefined) delete cambios[entidad][id];
    else cambios[entidad][id] = previo;
    throw error;
  }
}

function avisar(entidad, evento) {
  for (const oyente of oyentes.get(entidad) || []) {
    try { oyente(evento); } catch (error) { console.error(error); }
  }
}

// ---------------------------------------------------------------- utilidades

const copiar = (valor) => (valor == null ? valor : JSON.parse(JSON.stringify(valor)));

function nuevoId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

function comparar(campo) {
  const desc = campo.startsWith('-');
  const clave = desc ? campo.slice(1) : campo;
  return (a, b) => {
    const x = a[clave], y = b[clave];
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'es');
    return desc ? -r : r;
  };
}

function ordenarYLimitar(lista, orden, limite, salto = 0) {
  const ordenada = orden ? [...lista].sort(comparar(orden)) : lista;
  return limite ? ordenada.slice(salto, salto + limite) : ordenada.slice(salto);
}

function cumple(registro, consulta = {}) {
  return Object.entries(consulta).every(([campo, esperado]) => {
    const valor = registro[campo];
    if (esperado && typeof esperado === 'object' && !Array.isArray(esperado)) {
      return Object.entries(esperado).every(([op, v]) => {
        switch (op) {
          case '$in': return v.includes(valor);
          case '$nin': return !v.includes(valor);
          case '$ne': return valor !== v;
          case '$gt': return valor > v;
          case '$gte': return valor >= v;
          case '$lt': return valor < v;
          case '$lte': return valor <= v;
          default: return false;
        }
      });
    }
    return Array.isArray(valor) && !Array.isArray(esperado) ? valor.includes(esperado) : valor === esperado;
  });
}

function noEncontrado(entidad, id) {
  const error = new Error(`No existe ${entidad} ${id}`);
  error.status = 404;
  return error;
}

// ---------------------------------------------------------------- entidades

function entidad(nombre) {
  return {
    async list(orden, limite, salto) {
      return ordenarYLimitar(registros(nombre), orden, limite, salto);
    },
    async filter(consulta, orden, limite, salto) {
      return ordenarYLimitar(registros(nombre).filter(r => cumple(r, consulta)), orden, limite, salto);
    },
    async get(id) {
      const registro = registros(nombre).find(r => r.id === id);
      if (!registro) throw noEncontrado(nombre, id);
      return registro;
    },
    async create(datos) {
      const ahora = new Date().toISOString();
      const registro = {
        ...copiar(POR_DEFECTO[nombre] || {}), ...copiar(datos),
        id: nuevoId(), created_date: ahora, updated_date: ahora
      };
      escribir(nombre, registro.id, registro);
      avisar(nombre, { type: 'create', id: registro.id, data: copiar(registro) });
      return registro;
    },
    async bulkCreate(lista) {
      const creados = [];
      for (const datos of lista) creados.push(await this.create(datos));
      return creados;
    },
    async update(id, datos) {
      const actual = registros(nombre).find(r => r.id === id);
      if (!actual) throw noEncontrado(nombre, id);
      const registro = { ...actual, ...copiar(datos), id, updated_date: new Date().toISOString() };
      escribir(nombre, id, registro);
      avisar(nombre, { type: 'update', id, data: copiar(registro) });
      return registro;
    },
    async delete(id) {
      const actual = registros(nombre).find(r => r.id === id);
      if (!actual) throw noEncontrado(nombre, id);
      escribir(nombre, id, null);
      avisar(nombre, { type: 'delete', id, data: actual });
      return { success: true };
    },
    subscribe(oyente) {
      if (!oyentes.has(nombre)) oyentes.set(nombre, new Set());
      oyentes.get(nombre).add(oyente);
      return () => oyentes.get(nombre)?.delete(oyente);
    }
  };
}

const entities = new Proxy({}, {
  get: (cache, nombre) => {
    if (typeof nombre !== 'string') return undefined;
    if (!cache[nombre]) cache[nombre] = entidad(nombre);
    return cache[nombre];
  }
});

// ---------------------------------------------------------------- funciones
// Lo que en Base44 corría en el servidor (base44/functions, respaldado en docs/base44-original).

const SIN_GOOGLE = 'Agendar en Google Calendar necesita un servidor conectado a Google, que este sitio aún no tiene. '
  + 'Crea la reunión en Google Meet y pega su enlace en la clase.';

const funciones = {
  async authenticateStudent({ email, password }) {
    if (!email || !password) return { error: 'Email y contraseña requeridos' };
    const correo = email.toLowerCase().trim();
    const student = (await entities.Student.list()).find(s => s.email?.toLowerCase().trim() === correo);
    if (!student) return { error: 'No se encontró un estudiante con ese correo' };
    if (student.password !== password) return { error: 'Contraseña incorrecta' };
    if (!student.has_logged_in) return { student: await entities.Student.update(student.id, { has_logged_in: true }) };
    return { student };
  },

  async authenticateInstructor({ email, password }) {
    if (!email || !password) return { error: 'Email y contraseña requeridos' };
    const correo = email.toLowerCase().trim();
    const instructor = (await entities.Instructor.list()).find(i => i.email?.toLowerCase().trim() === correo);
    if (!instructor) return { error: 'No se encontró un instructor con ese correo' };
    if (instructor.password !== password) return { error: 'Contraseña incorrecta' };
    return { instructor };
  },

  async getInstructorDashboard({ instructorEmail }) {
    if (!instructorEmail) return { error: 'instructorEmail requerido' };
    const [allStudents, allCourses, lessons] = await Promise.all([
      entities.Student.list(), entities.Course.list(), entities.CourseLesson.list()
    ]);
    const courses = allCourses.filter(c => c.instructor_email === instructorEmail);
    const ids = new Set(courses.map(c => c.id));
    const students = allStudents.filter(s => s.instructor_email === instructorEmail && ids.has(s.course_id));
    return { students, courses: courses.filter(c => c.status === 'active'), lessons, allCourses: courses };
  },

  async getStudentDashboard({ courseId }) {
    if (!courseId) return { error: 'courseId requerido' };
    const [courses, modules, lessons] = await Promise.all([
      entities.Course.filter({ id: courseId }),
      entities.CourseModule.filter({ course_id: courseId }),
      entities.CourseLesson.filter({ course_id: courseId })
    ]);
    return { course: courses[0] || null, modules, lessons };
  },

  /** Próximas clases en vivo (30 días) del instructor con sesión, con la forma de un evento de Google Calendar. */
  async getUpcomingClasses() {
    let correo = null;
    try { correo = JSON.parse(localStorage.getItem('instructorSession'))?.email; } catch { /* sin sesión */ }
    const cursos = await entities.Course.list();
    const propios = new Map(cursos.filter(c => !correo || c.instructor_email === correo).map(c => [c.id, c]));
    const ahora = Date.now();
    const limite = ahora + 30 * 24 * 60 * 60 * 1000;
    const events = (await entities.CourseLesson.filter({ type: 'live' }))
      .filter(l => propios.has(l.course_id) && l.scheduled_date)
      .filter(l => { const t = new Date(l.scheduled_date).getTime(); return t >= ahora && t <= limite; })
      .sort(comparar('scheduled_date'))
      .slice(0, 20)
      .map(l => ({
        id: l.id,
        summary: `${propios.get(l.course_id)?.title || 'Clase'}: ${l.title || ''}`.trim(),
        description: l.description || '',
        start: { dateTime: new Date(l.scheduled_date).toISOString() },
        hangoutLink: l.meet_link || undefined
      }));
    return { events, success: true };
  },

  async manageStudent({ action, ...datos }) {
    if (action === 'create') return { student: await entities.Student.create(datos) };
    if (action === 'update') {
      const { id, ...cambiosAlumno } = datos;
      if (!id) return { error: 'id requerido' };
      return { student: await entities.Student.update(id, cambiosAlumno) };
    }
    if (action === 'delete') {
      if (!datos.id) return { error: 'id requerido' };
      await entities.Student.delete(datos.id);
      return { success: true };
    }
    if (action === 'complete_course') {
      const { courseId, certificate_hours } = datos;
      if (!courseId) return { error: 'courseId requerido' };
      const horas = parseInt(certificate_hours) || 40;
      await entities.Course.update(courseId, { status: 'finished' });
      const alumnos = await entities.Student.filter({ course_id: courseId });
      for (const s of alumnos) {
        await entities.Student.update(s.id, { certificate_enabled: true, certificate_hours: horas });
      }
      return { success: true, studentsUpdated: alumnos.length };
    }
    return { error: action ? 'Acción no válida' : 'action requerido (create, update, delete)' };
  },

  async scheduleGoogleMeetClass() {
    return { success: false, error: SIN_GOOGLE };
  },

  async updateGoogleCalendarEvent() {
    return { success: true, skipped: true };
  }
};

const functions = {
  async invoke(nombre, datos = {}) {
    const funcion = funciones[nombre];
    if (!funcion) throw new Error(`La función ${nombre} no existe en esta versión del sitio`);
    return { data: await funcion(datos) };
  }
};

// ---------------------------------------------------------------- integraciones

const integrations = {
  Core: {
    /** Sin servidor no hay almacenamiento de archivos: se guardan dentro de los datos, como data URL. */
    async UploadFile({ file }) {
      if (!file) throw new Error('No se recibió ningún archivo');
      if (file.size > PESO_MAXIMO_ARCHIVO) {
        throw new Error('El archivo pesa más de 2 MB. Sin servidor, los archivos se guardan en este navegador y solo caben archivos livianos.');
      }
      const file_url = await new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => resolve(lector.result);
        lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
        lector.readAsDataURL(file);
      });
      return { file_url };
    },

    /**
     * Sin servidor no se pueden enviar correos. Los avisos internos (mensajes a estudiantes, etc.) quedan
     * registrados en la consola; los formularios públicos abren el correo de la persona (ver lib/correo.js).
     */
    async SendEmail({ to, subject }) {
      console.info(`[Delhos Academy] Correo no enviado (el sitio no tiene servidor de correo): «${subject}» para ${to}`);
      return { sent: false };
    }
  }
};

export const api = { entities, functions, integrations };
