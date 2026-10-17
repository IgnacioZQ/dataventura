import React, { useState, useEffect } from 'react';
import InstructorSidebar from '@/components/instructor/InstructorSidebar';
import AnnouncementsManager from '@/components/instructor/AnnouncementsManager';
import CourseForum from '@/components/forum/CourseForum';
import { EncabezadoPanel, Vista } from '@/components/rediseno/Panel';
import InstructorHome from '@/components/instructor/InstructorHome';
import InstructorCourses from '@/components/instructor/InstructorCourses';
import InstructorStudents from '@/components/instructor/InstructorStudents';
import AttendanceManager from '@/components/instructor/AttendanceManager';
import AssignmentsManager from '@/components/instructor/AssignmentsManager';
import InstructorSettings from '@/components/instructor/InstructorSettings';
import InstructorMessaging from '@/components/messaging/InstructorMessaging';
import InstructorWebinars from '@/components/instructor/InstructorWebinars';
import CertificateGenerator from '@/components/instructor/CertificateGenerator';
import ScheduleMeetClass from '@/components/instructor/ScheduleMeetClass';
import CourseContentManager from '@/components/instructor/CourseContentManager';
import CourseNavTabs from '@/components/instructor/CourseNavTabs';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { pageHref } from '@/utils';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';

export default function InstructorDashboard() {
  const [currentView, setCurrentView] = useState('home');
  const [instructorData, setInstructorData] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    const session = localStorage.getItem('instructorSession');
    if (session) {
      // Sesión propia de instructor (localStorage)
      const data = JSON.parse(session);
      setInstructorData(data);
      loadInstructorCourses(data.email);
      return;
    }

    // Esperar a que termine la carga de auth de Base44
    if (isLoadingAuth) return;

    if (user) {
      // Cualquier usuario Base44 autenticado puede acceder al dashboard de instructor
      const data = {
        id: user.id,
        name: user.full_name || user.email,
        email: user.email,
        role: user.role
      };
      setInstructorData(data);
      loadInstructorCourses(user.email);
    } else {
      // Sin sesión → redirigir al login
      window.location.href = pageHref('Acceso');
    }
  }, [user, isLoadingAuth]);

  useEffect(() => {
    const handler = (e) => {
      setCurrentView(`course-${e.detail}-students`);
    };
    window.addEventListener('navigateToCourse', handler);
    return () => window.removeEventListener('navigateToCourse', handler);
  }, []);

  const loadInstructorCourses = async (email) => {
    try {
      const courses = await api.entities.Course.filter({ instructor_email: email });
      setInstructorCourses(courses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  if (!instructorData) return (
    <div className="da flex min-h-[100dvh] items-center justify-center" role="status" aria-label="Cargando…">
      <div aria-hidden="true" className="size-8 animate-spin rounded-full border-4 border-linea border-t-azul" />
    </div>
  );

  // Extract course-specific views
  const getCourseViewData = () => {
    const match = currentView.match(/^course-(.+?)-(.+)$/);
    if (match) {
      return { courseId: match[1], section: match[2] };
    }
    return null;
  };

  const courseViewData = getCourseViewData();

  return (
    <div className="da panel-da min-h-[100dvh]">
      <EncabezadoPanel
        nombre={instructorData.name}
        foto={instructorData.profile_image}
        etiqueta="Instructor"
        onPerfil={() => setCurrentView('settings')}
      />

      <div className="mx-auto flex max-w-[1440px] flex-col gap-7 p-4 sm:p-6 min-[861px]:flex-row">
        <InstructorSidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        <main id="contenido" className="flex min-w-0 flex-1 flex-col gap-6">
          <ErrorBoundary>
            {courseViewData && (
              <CourseNavTabs
                courseId={courseViewData.courseId}
                activeSection={courseViewData.section}
                onNavigate={setCurrentView}
                courseTitle={instructorCourses.find(c => c.id === courseViewData.courseId)?.title || 'Curso'}
              />
            )}

            <Vista id={currentView}>
              {currentView === 'home' && <InstructorHome onNavigate={setCurrentView} />}
              {currentView === 'courses' && <InstructorCourses />}

              {courseViewData && courseViewData.section === 'schedule' && <ScheduleMeetClass courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'students' && <InstructorStudents courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'attendance' && <AttendanceManager courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'assignments' && <AssignmentsManager instructorData={instructorData} courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'certificates' && <CertificateGenerator courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'content' && <CourseContentManager courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'announcements' && <AnnouncementsManager instructorData={instructorData} courseId={courseViewData.courseId} />}
              {courseViewData && courseViewData.section === 'forum' && (
                <CourseForum courseId={courseViewData.courseId} userEmail={instructorData.email} userName={instructorData.name} userType="instructor" />
              )}

              {currentView === 'messages' && <InstructorMessaging />}
              {currentView === 'webinars' && <InstructorWebinars />}
              {currentView === 'settings' && <InstructorSettings instructorData={instructorData} onUpdate={setInstructorData} />}
            </Vista>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
