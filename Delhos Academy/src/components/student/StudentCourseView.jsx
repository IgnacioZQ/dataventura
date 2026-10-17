import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, Clock, Video, ExternalLink, ArrowLeft, FileText, Loader2, ChevronDown, Calendar, Link as LinkIcon, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { api } from '@/api/client';

export default function StudentCourseView({ courseId, onBack, studentData }) {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    loadContent();
  }, [courseId]);

  const loadContent = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const response = await api.functions.invoke('getStudentDashboard', { courseId });
      const { course: courseData, modules: modulesData, lessons: lessonsData } = response.data;
      
      if (courseData) {
        setCourse(courseData);
      }
      setModules(modulesData || []);
      setLessons(lessonsData || []);
      if (modulesData && modulesData.length > 0) {
        setExpandedModule(modulesData[0].id);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
    setLoading(false);
  };

  const getModuleLessons = (moduleId) => {
    return lessons.filter(l => l.module_id === moduleId);
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4 text-slate-500 hover:text-[#1e3a5f] -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src={course.image_url || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=180&fit=crop'} 
            alt={course.title}
            className="w-full md:w-40 h-28 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{course.title}</h1>
            <p className="text-slate-500 mt-1">Instructor: {course.instructor_name}</p>
            {course.schedule && (
              <p className="text-slate-600 mt-2 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                Horario: {course.schedule}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modules */}
      <div>
        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4">Contenido del Curso</h2>
        
        {modules.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
            El contenido del curso estará disponible pronto
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module, moduleIndex) => {
                  const moduleLessons = getModuleLessons(module.id);
                  const isLocked = module.is_locked;
                  const isExpanded = expandedModule === module.id;
                  
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                    >
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Module Header */}
                        <button
                          onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                          className={cn(
                            "w-full p-5 flex items-center justify-between text-left transition-all",
                            isExpanded ? "bg-gradient-to-r from-[#2E6DB4]/10 to-[#2E6DB4]/10" : "bg-white hover:bg-slate-50",
                            isLocked && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-sm",
                              isLocked ? "bg-slate-200 text-slate-500" : "bg-gradient-to-br from-[#2E6DB4] to-[#2E6DB4] text-white"
                            )}>
                              {moduleIndex + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#1e3a5f]">{module.title}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">{moduleLessons.length} {moduleLessons.length === 1 ? 'lección' : 'lecciones'}</p>
                            </div>
                          </div>
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-slate-400" />
                          ) : (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-5 h-5 text-[#2E6DB4]" />
                            </motion.div>
                          )}
                        </button>

                        {/* Module Lessons */}
                        <AnimatePresence>
                          {isExpanded && !isLocked && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden border-t border-slate-200"
                            >
                              <div className="divide-y divide-slate-100 bg-slate-50/50">
                                {moduleLessons.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-400">
                                    Las lecciones se agregarán pronto
                                  </div>
                                ) : (
                                  moduleLessons.map((lesson) => {
                                   const now = new Date();
                                   const isLive = lesson.type === 'live';
                                   const isRecording = lesson.type === 'recording';
                                   const isDocument = lesson.type === 'document';

                                   // Para clases en vivo, calcular estado
                                   let liveStatus = null;
                                   if (isLive && lesson.scheduled_date) {
                                     const classStart = new Date(lesson.scheduled_date);
                                     const durationHours = parseFloat(lesson.duration?.replace(/[^\d.]/g, '') || '1.5');
                                     const classEnd = new Date(classStart.getTime() + durationHours * 60 * 60 * 1000);
                                     const beforeWindow = new Date(classStart.getTime() - 15 * 60 * 1000);
                                     if (now >= beforeWindow && now < classEnd) liveStatus = 'active';
                                     else if (now >= classEnd) liveStatus = 'finished';
                                     else liveStatus = 'upcoming';
                                   }

                                   return (
                                   <div 
                                     key={lesson.id}
                                     className="p-4 hover:bg-white transition-all"
                                   >
                                     <div className="flex items-start gap-3">
                                       {/* Icon */}
                                       <div className={cn(
                                         "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                                         isLive && liveStatus === 'active' ? "bg-green-100" :
                                         isLive ? "bg-red-100" :
                                         isRecording ? "bg-blue-100" : "bg-slate-100"
                                       )}>
                                         {isLive ? (
                                           <Video className={cn("w-4 h-4", liveStatus === 'active' ? "text-green-600" : "text-red-500")} />
                                         ) : isRecording ? (
                                           <PlayCircle className="w-4 h-4 text-[#2E6DB4]" />
                                         ) : (
                                           <FileText className="w-4 h-4 text-slate-500" />
                                         )}
                                       </div>

                                       <div className="flex-1 min-w-0">
                                         {/* Title + type badge */}
                                         <div className="flex items-center gap-2 flex-wrap mb-1">
                                           <p className="text-sm text-slate-800 font-semibold leading-tight">{lesson.title}</p>
                                           {isLive && liveStatus === 'active' && (
                                             <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium animate-pulse">En curso</span>
                                           )}
                                           {isLive && liveStatus === 'upcoming' && (
                                             <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Clase en vivo</span>
                                           )}
                                           {isLive && liveStatus === 'finished' && !lesson.content_url && (
                                             <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Finalizada</span>
                                           )}
                                           {isLive && lesson.content_url && (
                                             <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Grabación disponible</span>
                                           )}
                                           {isRecording && (
                                             <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Grabación</span>
                                           )}
                                           {isDocument && (
                                             <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Material</span>
                                           )}
                                         </div>

                                         {/* Description */}
                                         {lesson.description && (
                                           <p className="text-xs text-slate-500 mb-2 line-clamp-2">{lesson.description}</p>
                                         )}

                                         {/* Meta info */}
                                         <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                           {lesson.duration && (
                                             <span className="flex items-center gap-1">
                                               <Clock className="w-3 h-3" />
                                               {lesson.duration}
                                             </span>
                                           )}
                                           {isLive && lesson.scheduled_date && (
                                             <span className="flex items-center gap-1 text-[#2E6DB4] font-medium">
                                               <Calendar className="w-3 h-3" />
                                               {new Date(lesson.scheduled_date).toLocaleString('es-ES', {
                                                 weekday: 'short', day: 'numeric', month: 'short',
                                                 hour: '2-digit', minute: '2-digit'
                                               })}
                                             </span>
                                           )}
                                           {(isDocument || isRecording) && lesson.content_url && (
                                             <span className="flex items-center gap-1 text-green-600">
                                               <LinkIcon className="w-3 h-3" />
                                               Contenido disponible
                                             </span>
                                           )}
                                         </div>

                                         {/* Action button */}
                                         <div className="mt-3">
                                           {isLive && liveStatus === 'active' && lesson.meet_link && (
                                             <a href={lesson.meet_link} target="_blank" rel="noopener noreferrer">
                                               <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-full text-xs h-8 px-4">
                                                 <ExternalLink className="w-3 h-3 mr-1.5" />
                                                 Unirse ahora
                                               </Button>
                                             </a>
                                           )}
                                           {isLive && liveStatus === 'upcoming' && lesson.meet_link && (
                                             <span className="text-xs text-blue-700 px-3 py-1.5 rounded-full bg-blue-50 font-medium">
                                               El enlace estará activo 15 min antes
                                             </span>
                                           )}
                                           {isLive && lesson.content_url && (
                                             <a href={lesson.content_url} target="_blank" rel="noopener noreferrer">
                                               <Button size="sm" variant="outline" className="rounded-full text-xs h-8 px-4 border-[#2E6DB4] text-[#2E6DB4]">
                                                 <Play className="w-3 h-3 mr-1.5" />
                                                 Ver grabación
                                               </Button>
                                             </a>
                                           )}
                                           {(isRecording || isDocument) && lesson.content_url && (
                                             <a href={lesson.content_url} target="_blank" rel="noopener noreferrer">
                                               <Button size="sm" className="bg-[#2E6DB4] hover:bg-[#2E6DB4] text-white rounded-full text-xs h-8 px-4">
                                                 {isRecording ? <Play className="w-3 h-3 mr-1.5" /> : <FileText className="w-3 h-3 mr-1.5" />}
                                                 {isRecording ? 'Ver grabación' : 'Ver material'}
                                               </Button>
                                             </a>
                                           )}
                                           {!lesson.content_url && !lesson.meet_link && (
                                             <span className="text-xs text-slate-400 italic">Contenido próximamente</span>
                                           )}
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                   );
                                   })
                                   )}
                                   </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        )}
      </div>
    </div>
  );
}