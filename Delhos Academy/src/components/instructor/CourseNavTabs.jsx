// Pestañas de un curso en el panel de instructor. Se agregan Anuncios y Foro: antes los estudiantes tenían esas
// secciones pero ningún instructor podía publicar en ellas.
import { motion } from 'motion/react';
import { Award, BookOpen, CheckSquare, FileText, Megaphone, MessageSquare, Users } from 'lucide-react';

const TABS = [
  { key: 'content', label: 'Contenido', icon: BookOpen },
  { key: 'attendance', label: 'Asistencia', icon: CheckSquare },
  { key: 'assignments', label: 'Tareas', icon: FileText },
  { key: 'students', label: 'Estudiantes', icon: Users },
  { key: 'announcements', label: 'Anuncios', icon: Megaphone },
  { key: 'forum', label: 'Foro', icon: MessageSquare },
  { key: 'certificates', label: 'Certificados', icon: Award }
];

export default function CourseNavTabs({ courseId, activeSection, onNavigate, courseTitle }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1"><span className="text-sm text-gris">Curso</span><h1 className="h truncate text-[28px]">{courseTitle}</h1></div>
      <nav aria-label="Secciones del curso" className="-mx-1 flex gap-1 overflow-x-auto border-b border-linea px-1 [scrollbar-width:none]">
        {TABS.map(({ key, label, icon: Icon }) => {
          const on = activeSection === key;
          return (
            <button key={key} type="button" onClick={() => onNavigate(`course-${courseId}-${key}`)} aria-current={on ? 'page' : undefined}
              className={`relative flex min-h-11 items-center gap-2 whitespace-nowrap px-3.5 text-[15px] font-semibold transition-colors ${on ? 'text-tinta' : 'text-gris hover:text-tinta'}`}>
              <Icon className="size-4" strokeWidth={1.8} />{label}
              {on && <motion.span layoutId="pestana-curso" className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-marino" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
