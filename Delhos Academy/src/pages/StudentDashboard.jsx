import React, { useState, useEffect } from 'react';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentHome from '@/components/student/StudentHome';
import StudentCourseView from '@/components/student/StudentCourseView';
import StudentAssignments from '@/components/student/StudentAssignments';
import StudentSchedule from '@/components/student/StudentSchedule';
import StudentSettings from '@/components/student/StudentSettings';
import StudentMessaging from '@/components/messaging/StudentMessaging';
import ClassNotifications from '@/components/student/ClassNotifications';
import CourseForum from '@/components/forum/CourseForum';
import StudentAnnouncements from '@/components/student/StudentAnnouncements';
import StudentOnboarding from '@/components/student/StudentOnboarding';
import { EncabezadoPanel, Vista } from '@/components/rediseno/Panel';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/api/client';

export default function StudentDashboard() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [fallbackCourseId, setFallbackCourseId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    const session = localStorage.getItem('studentSession');
    if (session) {
      setStudentData(JSON.parse(session));
      if (!localStorage.getItem('studentOnboardingDone')) setShowOnboarding(true);
      return;
    }

    if (isLoadingAuth) return;

    if (user) {
      // Usuario Base44 autenticado — buscar su registro de estudiante
      api.entities.Student.filter({ email: user.email }).then(async results => {
        let data;
        if (results && results.length > 0) {
          data = results[0];
        } else {
          data = {
            id: user.id,
            name: user.full_name || user.email,
            email: user.email,
            course_id: null,
            progress: 0,
            points: 0,
            streak: 0,
            badges: []
          };
        }
        setStudentData(data);
        // Mostrar onboarding si es la primera vez
        if (!localStorage.getItem('studentOnboardingDone')) {
          setShowOnboarding(true);
        }
        // Si no tiene course_id, buscar el primer curso disponible como fallback para foro/vistas
        if (!data.course_id) {
          const courses = await api.entities.Course.list('created_date', 1);
          if (courses && courses.length > 0) {
            setFallbackCourseId(courses[0].id);
          }
        }
      });
    }
  }, [user, isLoadingAuth]);

  // El courseId efectivo: el del estudiante o el fallback para usuarios Base44
  const effectiveCourseId = studentData?.course_id || fallbackCourseId;

  const handleSetCurrentView = (view) => {
    setCurrentView(view);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCurrentView('course');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedCourse(null);
  };

  const handleStudentUpdate = (updatedStudent) => {
    setStudentData(updatedStudent);
  };

  if (!studentData) {
    if (isLoadingAuth) {
      return <div className="da flex min-h-[100dvh] items-center justify-center" role="status" aria-label="Cargando…"><div aria-hidden="true" className="size-8 animate-spin rounded-full border-4 border-linea border-t-azul" /></div>;
    }
    return (
      <div className="da flex min-h-[100dvh] items-center justify-center p-6">
        <div className="card flex max-w-md flex-col items-start gap-3 p-8">
          <span className="eyebrow">Panel de estudiante</span>
          <h1 className="h text-3xl">Inicia sesión para continuar</h1>
          <p className="m-0 text-texto">Tus clases, tareas y avances están en tu panel. Entra con el correo y la contraseña que te entregó tu instructor.</p>
          <Link to={createPageUrl('Acceso')} className="btn btn-p mt-2">Ir a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  const cambiarVista = vista => {
    handleSetCurrentView(vista);
    if (vista === 'announcements') {
      localStorage.setItem('lastCheckedAnnouncements', new Date().toISOString());
    }
  };

  return (
    <div className="da panel-da min-h-[100dvh]">
      {showOnboarding && (
        <StudentOnboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <ClassNotifications studentData={studentData} />

      <EncabezadoPanel
        nombre={studentData.name}
        foto={studentData.profile_image}
        avisos={unreadCounts.announcements || 0}
        onAvisos={() => cambiarVista('announcements')}
        onPerfil={() => cambiarVista('settings')}
      />

      <div className="mx-auto flex max-w-[1440px] flex-col gap-7 p-4 sm:p-6 min-[861px]:flex-row">
        <StudentSidebar
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          setSelectedCourse={setSelectedCourse}
          onUnreadCountsChange={setUnreadCounts}
        />

        <main id="contenido" className="min-w-0 flex-1">
          <Vista id={currentView}>
            {currentView === 'home' && (
              <StudentHome
                onCourseSelect={handleCourseSelect}
                onNavigate={cambiarVista}
                studentData={studentData}
              />
            )}
            {currentView === 'course' && effectiveCourseId && (
              <StudentCourseView
                courseId={effectiveCourseId}
                onBack={handleBack}
                studentData={studentData}
              />
            )}
            {currentView === 'course' && !effectiveCourseId && (
              <div className="card p-8"><h1 className="h text-2xl">Aún no tienes un curso asignado</h1><p className="m-0 mt-2 text-texto">Cuando tu instructor confirme tu inscripción, aquí verás el contenido.</p></div>
            )}
            {currentView === 'schedule' && (
              <StudentSchedule
                studentData={studentData}
                onNavigateToCourse={() => setCurrentView('course')}
              />
            )}
            {currentView === 'forum' && effectiveCourseId && (
              <CourseForum
                courseId={effectiveCourseId}
                userEmail={studentData.email}
                userName={studentData.name}
                userType="student"
              />
            )}
            {currentView === 'assignments' && (
              <StudentAssignments studentData={studentData} />
            )}
            {currentView === 'announcements' && (
              <StudentAnnouncements studentData={studentData} />
            )}
            {currentView === 'messages' && (
              <StudentMessaging studentData={studentData} />
            )}
            {currentView === 'settings' && (
              <StudentSettings
                studentData={studentData}
                onUpdate={handleStudentUpdate}
              />
            )}
          </Vista>
        </main>
      </div>
    </div>
  );
}
