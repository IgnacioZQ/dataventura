import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function AttendanceManager({ courseId = null }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      setSelectedCourse(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (selectedCourse) {
      loadLessonsAndStudents();
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedLesson) {
      loadAttendance();
    }
  }, [selectedLesson]);

  const loadCourses = async () => {
    try {
      const session = localStorage.getItem('instructorSession');
      if (!session) return;
      const instructor = JSON.parse(session);
      const coursesData = await api.entities.Course.filter({ instructor_email: instructor.email });
      // Solo mostrar cursos activos
      setCourses(coursesData.filter(c => c.status === 'active'));
    } catch (error) {
      console.error('Error loading courses:', error);
    }
    setLoading(false);
  };

  const loadLessonsAndStudents = async () => {
    try {
      const [lessonsData, studentsData] = await Promise.all([
        api.entities.CourseLesson.filter({ course_id: selectedCourse }),
        api.entities.Student.filter({ course_id: selectedCourse })
      ]);
      setLessons(lessonsData.filter(l => l.type === 'live'));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const attendanceData = await api.entities.Attendance.filter({ lesson_id: selectedLesson });
      const attendanceMap = {};
      attendanceData.forEach(record => {
        attendanceMap[record.student_id] = record.attended;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const lesson = lessons.find(l => l.id === selectedLesson);
      
      for (const student of students) {
        const attended = !!attendance[student.id];
        const existingRecords = await api.entities.Attendance.filter({
          student_id: student.id,
          lesson_id: selectedLesson
        });

        const hadAttendance = existingRecords.length > 0 && existingRecords[0].attended;

        if (existingRecords.length > 0) {
          await api.entities.Attendance.update(existingRecords[0].id, { attended });
        } else {
          await api.entities.Attendance.create({
            student_id: student.id,
            student_email: student.email,
            lesson_id: selectedLesson,
            course_id: selectedCourse,
            attended,
            date: lesson.scheduled_date || new Date().toISOString()
          });
        }

        // Si se quita asistencia, revisar insignias relacionadas con asistencia
        if (!attended && hadAttendance) {
          const badges = student.badges || [];
          const updatedBadges = badges.filter(badge => {
            // Mantener insignias que no dependen de asistencia
            return !['streak_3', 'streak_5', 'streak_10', 'first_class', 'classes_5', 'classes_10', 'classes_20'].includes(badge);
          });
          
          await api.entities.Student.update(student.id, {
            badges: updatedBadges
          });
        }
      }

      // Actualizar rachas
      await updateStreaks();

      toast.success('Asistencia guardada correctamente');
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Error al guardar asistencia');
    }
    setSaving(false);
  };

  const updateStreaks = async () => {
    for (const student of students) {
      try {
        const allAttendance = await api.entities.Attendance.filter({
          student_id: student.id,
          course_id: selectedCourse
        }, '-date');

        let currentStreak = 0;
        let lastDate = null;

        for (const record of allAttendance) {
          if (!record.attended) {
            break;
          }
          if (lastDate) {
            const diff = Math.abs(new Date(lastDate) - new Date(record.date)) / (1000 * 60 * 60 * 24);
            if (diff > 7) break;
          }
          currentStreak++;
          lastDate = record.date;
        }

        const updates = { streak: currentStreak };
        const badges = student.badges || [];

        if (currentStreak >= 3 && !badges.includes('streak_3')) {
          badges.push('streak_3');
          updates.badges = badges;
        }
        if (currentStreak >= 5 && !badges.includes('streak_5')) {
          badges.push('streak_5');
          updates.badges = badges;
        }
        if (currentStreak >= 10 && !badges.includes('streak_10')) {
          badges.push('streak_10');
          updates.badges = badges;
        }

        // Insignia por cantidad de clases
        const totalAttended = allAttendance.filter(a => a.attended).length;
        if (totalAttended === 1 && !badges.includes('first_class')) {
          badges.push('first_class');
          updates.badges = badges;
        }
        if (totalAttended >= 5 && !badges.includes('classes_5')) {
          badges.push('classes_5');
          updates.badges = badges;
        }
        if (totalAttended >= 10 && !badges.includes('classes_10')) {
          badges.push('classes_10');
          updates.badges = badges;
        }
        if (totalAttended >= 20 && !badges.includes('classes_20')) {
          badges.push('classes_20');
          updates.badges = badges;
        }

        await api.entities.Student.update(student.id, updates);
      } catch (error) {
        console.error('Error updating streak for student:', student.id, error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  const selectedLessonData = lessons.find(l => l.id === selectedLesson);
  const presentCount = students.filter(s => attendance[s.id]).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">Asistencia</h1>

      {/* Selección de curso y clase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        {!courseId && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Curso</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCourse && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Clase en vivo</label>
            {lessons.length === 0 ? (
              <p className="text-sm text-slate-400 py-2">No hay clases en vivo registradas para este curso.</p>
            ) : (
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Selecciona una clase" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map(lesson => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                      {lesson.scheduled_date && ` — ${new Date(lesson.scheduled_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Lista de estudiantes */}
      {selectedLesson && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header con stats */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <p className="font-semibold text-[#1e3a5f]">{selectedLessonData?.title}</p>
              {selectedLessonData?.scheduled_date && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(selectedLessonData.scheduled_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">{presentCount}/{students.length}</span>
            </div>
          </div>

          {students.length === 0 ? (
            <p className="text-center text-slate-400 py-10 text-sm">No hay estudiantes en este curso.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors ${
                    attendance[student.id] ? 'bg-green-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      attendance[student.id] ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {student.name?.charAt(0) || 'E'}
                    </div>
                    <span className={`font-medium ${attendance[student.id] ? 'text-green-800' : 'text-slate-700'}`}>
                      {student.name}
                    </span>
                  </div>
                  {attendance[student.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-slate-100">
            <Button
              onClick={saveAttendance}
              disabled={saving}
              className="w-full bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-xl"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" />Guardar asistencia</>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}