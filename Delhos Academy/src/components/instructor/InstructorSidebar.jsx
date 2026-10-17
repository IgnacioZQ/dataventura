import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Settings, Mail, Radio, GraduationCap } from 'lucide-react';
import { NavPanel } from '@/components/rediseno/Panel';
import { pageHref } from '@/utils';
import { api } from '@/api/client';

export default function InstructorSidebar({ currentView, setCurrentView }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    loadUnreadMessages();
    loadCourses();
    const interval = setInterval(() => {
      loadUnreadMessages();
      loadCourses();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadMessages = async () => {
    try {
      const session = localStorage.getItem('instructorSession');
      if (!session) return;
      const instructor = JSON.parse(session);
      const messages = await api.entities.Message.filter({ 
        recipient_email: instructor.email,
        is_read: false
      });
      setUnreadCount(messages.length);
    } catch (error) {
      console.error('Error loading unread messages:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const session = localStorage.getItem('instructorSession');
      if (!session) return;
      const instructor = JSON.parse(session);
      const coursesData = await api.entities.Course.filter({ 
        instructor_email: instructor.email 
      });
      // Solo cursos activos (en progreso), no finalizados ni por comenzar
      const activeCourses = coursesData.filter(c => c.status === 'active');
      setCourses(activeCourses);
      
      // Auto-expand first course if any
      if (activeCourses.length > 0 && Object.keys(expandedCourses).length === 0) {
        setExpandedCourses({ [activeCourses[0].id]: true });
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const selectCourse = (courseId) => {
    // Si ya está activo, colapsar; si no, expandir y navegar al schedule por defecto
    if (isAnyCourseViewActive(courseId)) {
      setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
    } else {
      setExpandedCourses(prev => ({ ...prev, [courseId]: true }));
      setCurrentView(`course-${courseId}-students`);
    }
  };

  const isCourseViewActive = (courseId, section) => {
    return currentView === `course-${courseId}-${section}`;
  };

  const isAnyCourseViewActive = (courseId) => {
    return currentView.startsWith(`course-${courseId}-`);
  };

  const salir = () => {
    localStorage.removeItem('instructorSession');
    window.location.href = pageHref('Acceso');
  };

  const items = [
    { id: 'home', texto: 'Inicio', icono: Home },
    { id: 'courses', texto: 'Mis cursos', icono: BookOpen },
    ...courses.map(c => ({ id: `course-${c.id}-students`, texto: c.title.length > 26 ? `${c.title.slice(0, 25)}…` : c.title, titulo: c.title.length > 26 ? c.title : undefined, icono: GraduationCap, activo: v => v.startsWith(`course-${c.id}-`) })),
    { id: 'webinars', texto: 'Webinars', icono: Radio },
    { id: 'messages', texto: 'Mensajería', icono: Mail, insignia: unreadCount },
    { id: 'settings', texto: 'Configuración', icono: Settings }
  ];

  return (
    <NavPanel
      items={items}
      actual={currentView}
      onCambiar={id => (id.startsWith('course-') ? selectCourse(id.slice(7, id.lastIndexOf('-students'))) : setCurrentView(id))}
      onSalir={salir}
      pie={courses.length
        ? <><span className="font-semibold">Cursos activos</span><span className="leading-normal text-texto">{courses.length === 1 ? 'Tienes 1 curso en curso.' : `Tienes ${courses.length} cursos en curso.`} Ábrelos desde aquí para ver contenido, tareas y estudiantes.</span></>
        : <><span className="font-semibold">Sin cursos activos</span><span className="leading-normal text-texto">Crea un curso en «Mis cursos» y márcalo como activo cuando empiece.</span></>}
    />
  );
}
