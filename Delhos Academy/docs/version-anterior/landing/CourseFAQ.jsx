import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'Fechas e inicio',
    items: [
      {
        q: '¿Cuándo comienza el curso?',
        a: (course) => course.start_date
          ? `El curso inicia el ${course.start_date}. Una vez inscrito, recibirás toda la información de acceso con anticipación.`
          : 'La fecha de inicio se confirmará próximamente. Al inscribirte te notificaremos con anticipación para que puedas prepararte.'
      },
      {
        q: '¿Cuánto dura el curso?',
        a: (course) => course.duration
          ? `El curso tiene una duración de ${course.duration}${course.total_lessons ? `, distribuidas en ${course.total_lessons} clases en vivo` : ''}.`
          : 'La duración se define según el ritmo del grupo. Consulta el horario en la ficha del curso.'
      },
      {
        q: '¿En qué horario son las clases?',
        a: (course) => course.schedule
          ? `Las clases se realizan en el siguiente horario: ${course.schedule}. Todas las sesiones quedan grabadas en caso de que no puedas asistir en tiempo real.`
          : 'El horario se coordinará con el grupo una vez confirmada la inscripción. Las clases son en vivo y quedan grabadas.'
      },
    ]
  },
  {
    category: 'Acceso a materiales',
    items: [
      {
        q: '¿Cómo accedo a las clases y materiales?',
        a: () => 'Una vez confirmada tu inscripción, recibirás tus credenciales de acceso a la plataforma Delhos Academy, donde encontrarás el calendario de clases, grabaciones, materiales de apoyo y tus tareas.'
      },
      {
        q: '¿Puedo ver las grabaciones si falto a una clase?',
        a: () => 'Sí. Todas las clases en vivo quedan grabadas y disponibles en tu panel de estudiante dentro de las 24 horas siguientes a la sesión, para que puedas revisarlas cuando quieras.'
      },
      {
        q: '¿Por cuánto tiempo tengo acceso a los materiales?',
        a: () => 'Tienes acceso a los materiales y grabaciones durante toda la duración del curso. Consulta con tu instructor si necesitas acceso extendido después de que el curso finalice.'
      },
    ]
  },
  {
    category: 'Metodología',
    items: [
      {
        q: '¿Cómo es la dinámica de las clases?',
        a: (course) => course.methodology
          ? course.methodology
          : 'Las clases son en vivo con el instructor, combinando teoría y práctica. Se realizan ejercicios, proyectos reales y sesiones de preguntas y respuestas para asegurar la comprensión de cada tema.'
      },
      {
        q: '¿Necesito experiencia previa?',
        a: (course) => course.requirements && course.requirements.length > 0
          ? `Para este curso recomendamos: ${course.requirements.join(', ')}. Si tienes dudas sobre si cumples los requisitos, contáctanos antes de inscribirte.`
          : 'No se requiere experiencia previa. El curso está diseñado para guiarte desde los fundamentos hasta un nivel aplicado, con apoyo continuo del instructor.'
      },
      {
        q: '¿Hay certificado al finalizar?',
        a: () => 'Sí. Al completar el curso satisfactoriamente, recibirás un certificado de participación emitido por Delhos Academy que podrás compartir en LinkedIn u otras plataformas profesionales.'
      },
    ]
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className={`text-sm font-medium leading-snug transition-colors ${open ? 'text-[#2B7CB3]' : 'text-slate-700 group-hover:text-[#2B7CB3]'}`}>
          {question}
        </span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform text-slate-400 ${open ? 'rotate-180 text-[#2B7CB3]' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-500 leading-relaxed pb-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CourseFAQ({ course }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-6 pb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#2B7CB3]/10 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-[#2B7CB3]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1E3D59]">Preguntas frecuentes</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {faqs.map((section) => (
          <div key={section.category} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-xs font-semibold text-[#2B7CB3] uppercase tracking-wider mb-3">{section.category}</p>
            {section.items.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={typeof faq.a === 'function' ? faq.a(course) : faq.a}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.section>
  );
}