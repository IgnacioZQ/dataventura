// Textos fijos del rediseño (Claude Design «Delhos Academy — Rediseño web»).

export const PREGUNTAS = [
  { q: '¿Los cursos son en vivo o grabados?', a: 'Todos nuestros cursos son 100% en vivo: clases sincrónicas donde interactúas con el instructor y tus compañeros en tiempo real. Además, cada sesión queda grabada para que la revises cuando quieras.' },
  { q: '¿Necesito conocimientos previos?', a: 'Depende del curso. Hay programas desde nivel inicial hasta cursos avanzados. En cada curso indicamos los requisitos recomendados y el temario completo.' },
  { q: '¿Cómo son las clases online?', a: 'Por videoconferencia, con herramientas interactivas. Cada sesión combina teoría, ejercicios prácticos en vivo y tiempo para preguntas. Tienes acceso a materiales, código y bases de datos para practicar.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Tarjetas de crédito y débito, transferencias bancarias y diversos medios de pago electrónico.' },
  { q: '¿Entregan certificado al finalizar?', a: 'Sí. Al completar el curso recibes un certificado digital de Delhos Academy con las horas de formación y las competencias adquiridas.' },
  { q: '¿Qué horarios tienen las clases?', a: 'Programamos las clases para estudiantes de distintos países de habla hispana, generalmente en la tarde y noche. Cada curso publica su calendario.' }
];

/** Países del formulario y su prefijo telefónico. */
export const PAISES = [
  ['Chile', '+56'], ['Argentina', '+54'], ['Bolivia', '+591'], ['Colombia', '+57'], ['Costa Rica', '+506'], ['Ecuador', '+593'],
  ['España', '+34'], ['México', '+52'], ['Paraguay', '+595'], ['Perú', '+51'], ['Uruguay', '+598'], ['Venezuela', '+58'], ['Otro', '+']
];

/** Preguntas frecuentes de un curso, con las respuestas armadas desde su ficha (antes en CourseFAQ). */
export function preguntasCurso(c) {
  return [
    { q: '¿Cuándo comienza el curso?', a: c.inicio ? `El curso inicia ${/^\d/.test(c.inicio) ? 'el' : 'en'} ${c.inicio}. Una vez inscrito, recibirás toda la información de acceso con anticipación.` : 'La fecha de inicio se confirmará próximamente. Al inscribirte te notificaremos con anticipación para que puedas prepararte.' },
    { q: '¿Cuánto dura y en qué horario son las clases?', a: [c.duracion ? `El curso dura ${c.duracion}${c.clases ? `, en ${c.clases} clases en vivo` : ''}.` : 'La duración se define según el ritmo del grupo.', c.horario ? `Horario de clases: ${c.horario}.` : 'El horario se coordina con el grupo una vez confirmada la inscripción.', 'Todas las sesiones quedan grabadas.'].join(' ') },
    { q: '¿Cómo accedo a las clases y materiales?', a: 'Una vez confirmada tu inscripción, recibirás tus credenciales de acceso a la plataforma Delhos Academy, donde encontrarás el calendario de clases, grabaciones, materiales de apoyo y tus tareas.' },
    { q: '¿Puedo ver las grabaciones si falto a una clase?', a: 'Sí. Todas las clases en vivo quedan grabadas y disponibles en tu panel de estudiante dentro de las 24 horas siguientes a la sesión.' },
    { q: '¿Necesito experiencia previa?', a: c.requisitos.length ? `Para este curso recomendamos: ${c.requisitos.join(', ')}. Si tienes dudas sobre si cumples los requisitos, escríbenos antes de postular.` : 'No se requiere experiencia previa. El curso te guía desde los fundamentos hasta un nivel aplicado, con apoyo continuo del instructor.' },
    { q: '¿Hay certificado al finalizar?', a: 'Sí. Al completar el curso recibes un certificado de Delhos Academy que puedes compartir en LinkedIn u otras plataformas profesionales.' }
  ];
}

/** Lo que incluye todo curso, cuando la ficha no lo detalla. */
export const INCLUYE_BASE = ['Clases en vivo y grabadas', 'Material, código y bases de datos', 'Tareas con retroalimentación', 'Certificado digital'];
