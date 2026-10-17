import React, { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Video, Users, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ScheduleMeetClass({ courseId = null }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      setSelectedCourse(courseId);
    }
  }, [courseId]);

  const loadCourses = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('instructorSession'));
      if (!session) return;
      const allCourses = await api.entities.Course.list();
      const instructorCourses = allCourses.filter(c => c.instructor_email === session.email);
      setCourses(instructorCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleSchedule = async () => {
    if (!selectedCourse || !lessonTitle || !date || !startTime || !endTime) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

      const response = await api.functions.invoke('scheduleGoogleMeetClass', {
        courseId: selectedCourse,
        lessonTitle,
        startDateTime,
        endDateTime,
        description,
      });

      if (response.data.success) {
        toast.success(
          <div>
            <p className="font-semibold">¡Clase agendada exitosamente!</p>
            <p className="text-sm">Google Meet: {response.data.meetLink}</p>
            <p className="text-sm">{response.data.studentsNotified} estudiantes notificados</p>
          </div>
        );
        
        // Reset form
        setLessonTitle('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setDescription('');
        setOpen(false);
      } else {
        toast.error('Error al agendar la clase');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
    setLoading(false);
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2E6DB4] to-[#1E3A5F] rounded-xl flex items-center justify-center shadow-md">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Agendar Clase con Google Meet</h1>
            <p className="text-slate-500 text-sm">Las invitaciones se enviarán automáticamente a todos los estudiantes</p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Detalles de la clase</h3>
          
          <div className="space-y-4">
            {!courseId && (
              <div>
                <Label className="text-slate-700">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-slate-700">Título de la clase</Label>
              <Input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Ej: Introducción a Python"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-slate-700">Fecha</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-700">Hora inicio</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-slate-700">Hora fin</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-700">Descripción (opcional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles adicionales de la clase..."
                className="mt-1.5 h-20"
              />
            </div>

            <Button
              onClick={handleSchedule}
              disabled={loading || !selectedCourse}
              className="w-full bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F] hover:from-[#1E3A5F] hover:to-[#2E6DB4] text-white py-6 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar clase con Meet
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {selectedCourseData && (
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2E6DB4] text-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Curso seleccionado</h3>
              <p className="text-white/90 mb-2">{selectedCourseData.title}</p>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Users className="w-4 h-4" />
                <span>Estudiantes recibirán invitación automática</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-[#1E3A5F] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2E6DB4]" />
              ¿Qué sucederá?
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-[#2E6DB4]">•</span>
                <span>Se creará un evento de Google Meet automáticamente</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E6DB4]">•</span>
                <span>Todos los estudiantes recibirán invitación por email</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E6DB4]">•</span>
                <span>El evento se agregará a sus calendarios de Google</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E6DB4]">•</span>
                <span>Aparecerá en el calendario de la plataforma</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E6DB4]">•</span>
                <span>Los estudiantes recibirán recordatorio 30 min antes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-500" />
              Nota importante
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Las invitaciones se envían desde tu cuenta de Google Calendar. 
              Asegúrate de que los estudiantes tengan acceso a sus correos electrónicos registrados.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}