import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Video, FileText, Clock, Calendar, Loader2, ChevronDown, ChevronUp, Link as LinkIcon, CalendarPlus, CheckCircle2, Upload, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/api/client';

export default function CourseContentManager({ courseId }) {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  const [moduleData, setModuleData] = useState({ title: '', order: 1 });
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    type: 'live',
    duration: '',
    meet_link: '',
    content_url: '',
    scheduled_date: '',
    order: 1
  });
  const [schedulingCalendar, setSchedulingCalendar] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [calendarResult, setCalendarResult] = useState(null); // { meetLink, eventId }
  const [recordingLesson, setRecordingLesson] = useState(null); // lesson being updated with recording
  const [recordingUrl, setRecordingUrl] = useState('');

  useEffect(() => {
    loadCourseAndContent();
  }, [courseId]);

  const loadCourseAndContent = async () => {
    try {
      const courseData = await api.entities.Course.get(courseId);
      setCourse(courseData);
      
      const [modulesData, lessonsData] = await Promise.all([
        api.entities.CourseModule.filter({ course_id: courseId }, 'order'),
        api.entities.CourseLesson.filter({ course_id: courseId }, 'order')
      ]);
      setModules(modulesData);
      setLessons(lessonsData);
      if (modulesData.length > 0) {
        setExpandedModule(modulesData[0].id);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
    setLoading(false);
  };

  const loadContent = async () => {
    try {
      const [modulesData, lessonsData] = await Promise.all([
        api.entities.CourseModule.filter({ course_id: courseId }, 'order'),
        api.entities.CourseLesson.filter({ course_id: courseId }, 'order')
      ]);
      setModules(modulesData);
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleSaveModule = async () => {
    try {
      if (editingModule) {
        await api.entities.CourseModule.update(editingModule.id, moduleData);
      } else {
        await api.entities.CourseModule.create({
          ...moduleData,
          course_id: courseId
        });
      }
      setShowModuleDialog(false);
      setModuleData({ title: '', order: modules.length + 1 });
      setEditingModule(null);
      await loadContent();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleSaveLesson = async () => {
    setSavingLesson(true);
    try {
      if (editingLesson) {
        // Update lesson fields
        await api.entities.CourseLesson.update(editingLesson.id, lessonData);

        // If live + has calendar event + date or title changed → sync Google Calendar
        if (
          lessonData.type === 'live' &&
          editingLesson.google_event_id &&
          lessonData.scheduled_date &&
          lessonData.duration
        ) {
          const startDT = new Date(lessonData.scheduled_date);
          const durationHours = parseFloat(lessonData.duration.replace(/[^\d.]/g, '') || '1.5');
          const endDT = new Date(startDT.getTime() + durationHours * 60 * 60 * 1000);
          await api.functions.invoke('updateGoogleCalendarEvent', {
            lessonId: editingLesson.id,
            lessonTitle: lessonData.title,
            description: lessonData.description,
            startDateTime: startDT.toISOString(),
            endDateTime: endDT.toISOString(),
            courseId,
          });
        }
      } else {
        // New lesson — always create in DB first
        await api.entities.CourseLesson.create({
          ...lessonData,
          course_id: courseId,
          module_id: selectedModule,
        });
      }
      setShowLessonDialog(false);
      setLessonData({ title: '', description: '', type: 'live', duration: '', meet_link: '', content_url: '', scheduled_date: '', order: 1 });
      setEditingLesson(null);
      setCalendarResult(null);
      await loadContent();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
    setSavingLesson(false);
  };



  const handleDeleteModule = async (moduleId) => {
    if (!confirm('¿Eliminar módulo y todas sus lecciones?')) return;
    try {
      const moduleLessons = lessons.filter(l => l.module_id === moduleId);
      await Promise.all(moduleLessons.map(l => api.entities.CourseLesson.delete(l.id)));
      await api.entities.CourseModule.delete(moduleId);
      await loadContent();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    try {
      await api.entities.CourseLesson.delete(lessonId);
      await loadContent();
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const openEditModule = (module) => {
    setEditingModule(module);
    setModuleData({ title: module.title, order: module.order });
    setShowModuleDialog(true);
  };

  const openEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonData({
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      duration: lesson.duration || '',
      meet_link: lesson.meet_link || '',
      content_url: lesson.content_url || '',
      scheduled_date: lesson.scheduled_date || '',
      google_event_id: lesson.google_event_id || '',
      order: lesson.order
    });
    setCalendarResult(null);
    setShowLessonDialog(true);
  };

  const handleSaveRecording = async () => {
    if (!recordingUrl.trim()) return;
    await api.entities.CourseLesson.update(recordingLesson.id, {
      content_url: recordingUrl,
      is_completed: true,
    });
    setRecordingLesson(null);
    setRecordingUrl('');
    await loadContent();
  };

  const openAddLesson = (moduleId) => {
    setSelectedModule(moduleId);
    const moduleLessons = lessons.filter(l => l.module_id === moduleId);
    setLessonData({
      title: '',
      description: '',
      type: 'live',
      duration: '',
      meet_link: '',
      content_url: '',
      scheduled_date: '',
      order: moduleLessons.length + 1
    });
    setCalendarResult(null);
    setShowLessonDialog(true);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'MODULE') {
      const reordered = Array.from(modules);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      const updated = reordered.map((m, i) => ({ ...m, order: i + 1 }));
      setModules(updated);
      await Promise.all(updated.map(m => api.entities.CourseModule.update(m.id, { order: m.order })));
    } else if (type === 'LESSON') {
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;
      const allLessons = Array.from(lessons);
      const sourceLessons = allLessons.filter(l => l.module_id === sourceModuleId);
      const [movedLesson] = sourceLessons.splice(source.index, 1);

      if (sourceModuleId === destModuleId) {
        sourceLessons.splice(destination.index, 0, movedLesson);
        const updatedSource = sourceLessons.map((l, i) => ({ ...l, order: i + 1 }));
        const others = allLessons.filter(l => l.module_id !== sourceModuleId);
        setLessons([...others, ...updatedSource]);
        await Promise.all(updatedSource.map(l => api.entities.CourseLesson.update(l.id, { order: l.order })));
      } else {
        const destLessons = allLessons.filter(l => l.module_id === destModuleId);
        const moved = { ...movedLesson, module_id: destModuleId };
        destLessons.splice(destination.index, 0, moved);
        const updatedSource = sourceLessons.map((l, i) => ({ ...l, order: i + 1 }));
        const updatedDest = destLessons.map((l, i) => ({ ...l, order: i + 1 }));
        const others = allLessons.filter(l => l.module_id !== sourceModuleId && l.module_id !== destModuleId);
        setLessons([...others, ...updatedSource, ...updatedDest]);
        await Promise.all([
          ...updatedSource.map(l => api.entities.CourseLesson.update(l.id, { order: l.order })),
          ...updatedDest.map(l => api.entities.CourseLesson.update(l.id, { order: l.order, module_id: destModuleId }))
        ]);
      }
    }
  };

  const handleScheduleOnCalendar = async () => {
    if (!lessonData.title || !lessonData.scheduled_date || !lessonData.duration) {
      alert('Completa el título, fecha/hora y duración antes de agendar en Google Calendar.');
      return;
    }
    setSchedulingCalendar(true);
    try {
      const startDT = new Date(lessonData.scheduled_date);
      const durationHours = parseFloat(lessonData.duration.replace(/[^\d.]/g, '') || '1.5');
      const endDT = new Date(startDT.getTime() + durationHours * 60 * 60 * 1000);

      const response = await api.functions.invoke('scheduleGoogleMeetClass', {
        courseId,
        lessonId: editingLesson?.id || null,
        lessonTitle: lessonData.title,
        startDateTime: startDT.toISOString(),
        endDateTime: endDT.toISOString(),
        description: lessonData.description,
        moduleId: selectedModule,
      });

      const data = response.data;
      if (data?.success) {
        setCalendarResult({ meetLink: data.meetLink, eventId: data.eventId, lessonId: data.lesson?.id, studentsNotified: data.studentsNotified });
        setLessonData(prev => ({ ...prev, meet_link: data.meetLink, google_event_id: data.eventId }));
        // If it was a new lesson created by the function, mark it so we don't double-create
        if (!editingLesson && data.lesson) {
          setEditingLesson(data.lesson);
        }
        await loadContent();
      } else {
        alert('Error al crear el evento: ' + (data?.error || 'Intenta de nuevo'));
      }
    } catch (error) {
      alert('Error al conectar con Google Calendar: ' + error.message);
    }
    setSchedulingCalendar(false);
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Contenido del curso</h1>
        <Button
          onClick={() => {
            setEditingModule(null);
            setModuleData({ title: '', order: modules.length + 1 });
            setShowModuleDialog(true);
          }}
          className="bg-[#2E6DB4] hover:bg-[#1E3A5F] rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Módulo
        </Button>
      </div>

      {/* Modules List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules" type="MODULE">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {modules.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <p className="text-slate-500">No hay módulos. Crea el primer módulo para comenzar.</p>
                </div>
              ) : (
                modules.map((module, moduleIndex) => {
                  const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a, b) => a.order - b.order);
                  const isExpanded = expandedModule === module.id;

                  return (
                    <Draggable key={module.id} draggableId={module.id} index={moduleIndex}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                        >
                          {/* Module Header */}
                          <div className="p-4 flex items-center justify-between bg-slate-50 border-b border-slate-200">
                            <div className="flex items-center gap-2 flex-1">
                              <div {...dragProvided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-200 transition-colors">
                                <GripVertical className="w-4 h-4 text-slate-400" />
                              </div>
                              <button
                                onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                                className="flex items-center gap-3 flex-1 text-left"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                                <div>
                                  <p className="font-semibold text-[#1E3A5F]">{module.title}</p>
                                  <p className="text-sm text-slate-500">{moduleLessons.length} lecciones</p>
                                </div>
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openEditModule(module)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteModule(module.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          {/* Lessons */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4">
                                  <Droppable droppableId={module.id} type="LESSON">
                                    {(lessonProvided) => (
                                      <div
                                        ref={lessonProvided.innerRef}
                                        {...lessonProvided.droppableProps}
                                        className="space-y-2 mb-4 min-h-[4px]"
                                      >
                                        {moduleLessons.length === 0 ? (
                                          <p className="text-slate-400 text-sm text-center py-4">No hay lecciones en este módulo</p>
                                        ) : (
                                          moduleLessons.map((lesson, lessonIndex) => (
                                            <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                              {(lp) => (
                                                <div
                                                  ref={lp.innerRef}
                                                  {...lp.draggableProps}
                                                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#2E6DB4]/30 transition-colors bg-white"
                                                >
                                                  <div className="flex items-center gap-3 flex-1">
                                                    <div {...lp.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-100 transition-colors">
                                                      <GripVertical className="w-4 h-4 text-slate-300" />
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                      lesson.type === 'live' ? 'bg-red-100' :
                                                      lesson.type === 'recording' ? 'bg-blue-100' : 'bg-green-100'
                                                    }`}>
                                                      {lesson.type === 'live' ? (
                                                        <Video className={`w-4 h-4 ${lesson.type === 'live' ? 'text-red-600' : 'text-blue-600'}`} />
                                                      ) : (
                                                        <FileText className="w-4 h-4 text-green-600" />
                                                      )}
                                                    </div>
                                                    <div className="flex-1">
                                                      <p className="font-medium text-slate-700">{lesson.title}</p>
                                                      {lesson.description && (
                                                        <p className="text-sm text-slate-400 line-clamp-1">{lesson.description}</p>
                                                      )}
                                                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                        {lesson.duration && (
                                                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lesson.duration}</span>
                                                        )}
                                                        {lesson.scheduled_date && (
                                                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(lesson.scheduled_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                        )}
                                                        {lesson.type === 'live' && lesson.scheduled_date && (() => {
                                                          const now = new Date();
                                                          const classStart = new Date(lesson.scheduled_date);
                                                          const durationHours = parseFloat(lesson.duration?.replace(/[^\d.]/g, '') || '1.5');
                                                          const classEnd = new Date(classStart.getTime() + durationHours * 60 * 60 * 1000);
                                                          if (now >= classEnd) {
                                                            return (
                                                              <>
                                                                <span className="text-red-500">• Finalizada</span>
                                                                {lesson.content_url && <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Grabación disponible</span>}
                                                              </>
                                                            );
                                                          }
                                                        })()}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    {lesson.type === 'live' && lesson.scheduled_date && (() => {
                                                      const now = new Date();
                                                      const classStart = new Date(lesson.scheduled_date);
                                                      const durationHours = parseFloat(lesson.duration?.replace(/[^\d.]/g, '') || '1.5');
                                                      const classEnd = new Date(classStart.getTime() + durationHours * 60 * 60 * 1000);
                                                      const oneHourBefore = new Date(classStart.getTime() - 60 * 60 * 1000);
                                                      const isLive = now >= oneHourBefore && now < classEnd;
                                                      const isFinished = now >= classEnd;
                                                      if (isLive && lesson.meet_link) {
                                                        return (
                                                          <a href={lesson.meet_link} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-3">
                                                              <Video className="w-3 h-3 mr-1" />Unirse
                                                            </Button>
                                                          </a>
                                                        );
                                                      }
                                                      if (isFinished) {
                                                        return (
                                                          <Button size="sm" variant="outline" className="text-xs px-3 border-orange-300 text-orange-600 hover:bg-orange-50" onClick={() => { setRecordingLesson(lesson); setRecordingUrl(lesson.content_url || ''); }}>
                                                            <Upload className="w-3 h-3 mr-1" />{lesson.content_url ? 'Actualizar grabación' : 'Subir grabación'}
                                                          </Button>
                                                        );
                                                      }
                                                      return null;
                                                    })()}
                                                    <Button size="sm" variant="ghost" onClick={() => openEditLesson(lesson)}>
                                                      <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => handleDeleteLesson(lesson.id)}>
                                                      <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </Draggable>
                                          ))
                                        )}
                                        {lessonProvided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                  <Button variant="outline" size="sm" onClick={() => openAddLesson(module.id)} className="w-full border-dashed">
                                    <Plus className="w-4 h-4 mr-2" />Agregar Lección
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Recording Dialog */}
      <Dialog open={!!recordingLesson} onOpenChange={(open) => { if (!open) { setRecordingLesson(null); setRecordingUrl(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir grabación de clase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Ingresa el enlace a la grabación de <span className="font-semibold text-slate-700">"{recordingLesson?.title}"</span>.
              Puede ser un link de Google Drive, YouTube, Dropbox u otro servicio.
            </p>
            <div>
              <Label>Enlace a la grabación</Label>
              <Input
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                placeholder="https://drive.google.com/... o YouTube..."
                className="mt-1.5"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setRecordingLesson(null); setRecordingUrl(''); }}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRecording} disabled={!recordingUrl.trim()} className="bg-[#2E6DB4] hover:bg-[#1E3A5F]">
                <Upload className="w-4 h-4 mr-2" />
                Guardar grabación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título del módulo</Label>
              <Input
                value={moduleData.title}
                onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                placeholder="Ej: Introducción a Python"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Orden</Label>
              <Input
                type="number"
                value={moduleData.order}
                onChange={(e) => setModuleData({ ...moduleData, order: parseInt(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModuleDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveModule} className="bg-[#2E6DB4] hover:bg-[#1E3A5F]">
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={(open) => { setShowLessonDialog(open); if (!open) setCalendarResult(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Editar Lección' : 'Nueva Lección'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título de la lección</Label>
              <Input
                value={lessonData.title}
                onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                placeholder="Ej: Variables y tipos de datos"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={lessonData.description}
                onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                placeholder="Describe brevemente el contenido de la lección..."
                className="mt-1.5 h-20"
              />
            </div>

            <div>
              <Label>Tipo de contenido</Label>
              <Select
                value={lessonData.type}
                onValueChange={(value) => setLessonData({ ...lessonData, type: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Clase en vivo</SelectItem>
                  <SelectItem value="recording">Grabación</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {lessonData.type === 'live' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha y hora de inicio</Label>
                    <Input
                      type="datetime-local"
                      value={lessonData.scheduled_date}
                      onChange={(e) => setLessonData({ ...lessonData, scheduled_date: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Duración (horas)</Label>
                    <Input
                      value={lessonData.duration}
                      onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                      placeholder="Ej: 1.5"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Bloque Google Calendar */}
                <div className={`rounded-xl border-2 p-4 space-y-3 ${(editingLesson?.google_event_id || lessonData.google_event_id) ? 'border-green-200 bg-green-50' : 'border-dashed border-blue-200 bg-blue-50'}`}>
                  <div className={`flex items-center gap-2 font-semibold text-sm ${(editingLesson?.google_event_id || lessonData.google_event_id) ? 'text-green-700' : 'text-blue-700'}`}>
                    <CalendarPlus className="w-4 h-4" />
                    {(editingLesson?.google_event_id || lessonData.google_event_id) ? 'Vinculado con Google Calendar' : 'Google Calendar & Google Meet'}
                  </div>

                  {(editingLesson?.google_event_id || lessonData.google_event_id) && !calendarResult ? (
                    <div className="space-y-2">
                      <p className="text-xs text-green-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        Esta lección tiene un evento en Google Calendar. Al guardar, la fecha y el título se sincronizarán automáticamente y los estudiantes recibirán una notificación.
                      </p>
                      <Button
                        type="button"
                        onClick={handleScheduleOnCalendar}
                        disabled={schedulingCalendar || !lessonData.title || !lessonData.scheduled_date || !lessonData.duration}
                        variant="outline"
                        className="w-full border-green-300 text-green-700 hover:bg-green-100 text-xs"
                      >
                        {schedulingCalendar ? (
                          <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" />Creando nuevo evento...</>
                        ) : (
                          <><CalendarPlus className="w-3 h-3 mr-1.5" />Reemplazar con nuevo evento de Calendar</>
                        )}
                      </Button>
                    </div>
                  ) : calendarResult ? (
                    <div className="bg-white border border-green-200 rounded-lg p-3 space-y-1">
                      <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        ¡Evento creado! {calendarResult.studentsNotified > 0 && <span className="font-normal text-green-600">({calendarResult.studentsNotified} estudiantes invitados)</span>}
                      </p>
                      {calendarResult.meetLink && (
                        <a href={calendarResult.meetLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline break-all">
                          {calendarResult.meetLink}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-blue-600">
                        Crea el evento en tu Google Calendar con enlace de Google Meet e invita automáticamente a todos los estudiantes activos del curso.
                      </p>
                      <Button
                        type="button"
                        onClick={handleScheduleOnCalendar}
                        disabled={schedulingCalendar || !lessonData.title || !lessonData.scheduled_date || !lessonData.duration}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {schedulingCalendar ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando evento y enviando invitaciones...</>
                        ) : (
                          <><CalendarPlus className="w-4 h-4 mr-2" />Crear evento en Google Calendar</>
                        )}
                      </Button>
                      {(!lessonData.title || !lessonData.scheduled_date || !lessonData.duration) && (
                        <p className="text-xs text-slate-400 text-center">Completa título, fecha y duración para habilitar</p>
                      )}
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-slate-500">O ingresa el link de Meet manualmente</Label>
                    <Input
                      value={lessonData.meet_link}
                      onChange={(e) => setLessonData({ ...lessonData, meet_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </>
            )}

            {(lessonData.type === 'recording' || lessonData.type === 'document') && (
              <div>
                <Label>
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Enlace al contenido
                </Label>
                <Input
                  value={lessonData.content_url}
                  onChange={(e) => setLessonData({ ...lessonData, content_url: e.target.value })}
                  placeholder="https://drive.google.com/... o cualquier enlace"
                  className="mt-1.5"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ingresa un enlace a Google Drive, Dropbox, YouTube u otro servicio
                </p>
              </div>
            )}

            <div>
              <Label>Orden</Label>
              <Input
                type="number"
                value={lessonData.order}
                onChange={(e) => setLessonData({ ...lessonData, order: parseInt(e.target.value) })}
                className="mt-1.5"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowLessonDialog(false)} disabled={savingLesson}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLesson} disabled={savingLesson} className="bg-[#2E6DB4] hover:bg-[#1E3A5F]">
                {savingLesson ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : 'Guardar lección'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}