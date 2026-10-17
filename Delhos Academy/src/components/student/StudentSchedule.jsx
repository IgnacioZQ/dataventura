import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';

export default function StudentSchedule({ studentData, onNavigateToCourse }) {
  const [lessons, setLessons] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadSchedule();
  }, [studentData]);

  const loadSchedule = async () => {
    if (!studentData?.course_id) {
      setLoading(false);
      return;
    }

    try {
      const [courseLessons, course] = await Promise.all([
        api.entities.CourseLesson.filter({ course_id: studentData.course_id, type: 'live' }),
        api.entities.Course.filter({ id: studentData.course_id })
      ]);

      const lessonsWithCourse = courseLessons.map(lesson => ({
        ...lesson,
        courseName: course[0]?.title || 'Curso'
      }));

      setLessons(lessonsWithCourse);

      if (course[0]) {
        const instructorData = await api.entities.Instructor.filter({ 
          email: course[0].instructor_email 
        });
        if (instructorData.length > 0) {
          setInstructor(instructorData[0]);
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
    setLoading(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getLessonsForDay = (day) => {
    return lessons.filter(lesson => {
      if (!lesson.scheduled_date) return false;
      const lessonDate = new Date(lesson.scheduled_date);
      return (
        lessonDate.getDate() === day &&
        lessonDate.getMonth() === currentDate.getMonth() &&
        lessonDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = 
    today.getMonth() === currentDate.getMonth() && 
    today.getFullYear() === currentDate.getFullYear();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1e3a5f] mb-6">Mi Calendario</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1e3a5f]">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={previousMonth} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Mes siguiente" onClick={nextMonth} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayLessons = getLessonsForDay(day);
            const isToday = isCurrentMonth && day === today.getDate();
            
            return (
              <button
                key={day}
                onClick={() => {
                  if (dayLessons.length > 0 && onNavigateToCourse) {
                    onNavigateToCourse();
                  }
                }}
                className={`aspect-square border rounded-lg p-2 transition-colors ${
                  isToday 
                    ? 'bg-[#2E6DB4]/10 border-[#2E6DB4]' 
                    : dayLessons.length > 0 
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-[#2E6DB4]' : 'text-slate-600'}`}>
                  {day}
                </div>
                {dayLessons.length > 0 && (
                  <div className="space-y-1">
                    {dayLessons.slice(0, 1).map((lesson, idx) => {
                      const lessonDate = new Date(lesson.scheduled_date);
                      return (
                        <div key={idx} className="text-xs bg-[#1e3a5f] text-white rounded px-1 py-0.5">
                          <div className="font-medium truncate">{lesson.title}</div>
                          <div className="text-[10px] opacity-80">
                            {lessonDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {instructor && (
                            <div className="text-[10px] opacity-80 truncate">{instructor.name}</div>
                          )}
                        </div>
                      );
                    })}
                    {dayLessons.length > 1 && (
                      <div className="text-xs text-slate-500">+{dayLessons.length - 1}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Today's classes */}
        {isCurrentMonth && lessons.some(l => {
          const ld = new Date(l.scheduled_date);
          return ld.getDate() === today.getDate();
        }) && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Clases de hoy
            </h3>
            <div className="space-y-2">
              {lessons
                .filter(l => {
                  const ld = new Date(l.scheduled_date);
                  return ld.getDate() === today.getDate();
                })
                .map((lesson, lessonIdx) => {
                  const now = new Date();
                  const classStart = new Date(lesson.scheduled_date);
                  const durationHours = parseFloat(lesson.duration?.replace(/[^\d.]/g, '') || '1.5');
                  const classEnd = new Date(classStart.getTime() + durationHours * 60 * 60 * 1000);
                  const beforeWindow = new Date(classStart.getTime() - 15 * 60 * 1000);
                  
                  let status = 'upcoming';
                  let statusLabel = 'Clase por comenzar';
                  let statusColor = 'blue';
                  let canJoin = false;
                  
                  if (now >= beforeWindow && now < classEnd) {
                    status = 'in_progress';
                    statusLabel = 'Clase en progreso';
                    statusColor = 'green';
                    canJoin = true;
                  } else if (now >= classEnd) {
                    status = 'ended';
                    statusLabel = 'Clase terminada';
                    statusColor = 'gray';
                    canJoin = false;
                  }
                  
                  return (
                    <motion.div 
                      key={lesson.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lessonIdx * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      onClick={() => {
                        if (canJoin && lesson.meet_link) {
                          window.open(lesson.meet_link, '_blank');
                        }
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-700 text-sm">{lesson.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            statusColor === 'green' ? 'bg-green-100 text-green-700' :
                            statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {classStart.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {classEnd.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {lesson.courseName && <span>• {lesson.courseName}</span>}
                          {instructor && <span>• {instructor.name}</span>}
                        </div>
                      </div>
                      {lesson.meet_link && canJoin && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(lesson.meet_link, '_blank');
                            }}
                          >
                            Unirse
                          </Button>
                        </motion.div>
                      )}
                      {lesson.meet_link && !canJoin && (
                        <Button size="sm" variant="outline" disabled className="rounded-full">
                          {status === 'ended' ? 'Terminada' : 'No disponible'}
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}