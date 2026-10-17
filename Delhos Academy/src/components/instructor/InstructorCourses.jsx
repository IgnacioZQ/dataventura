import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Video, Plus, Loader2, Trash2, Eye, Edit, Upload, CheckCircle, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';
import CourseContentManager from './CourseContentManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const instructorSession = JSON.parse(localStorage.getItem('instructorSession'));
      const [allCourses, studentsData] = await Promise.all([
        api.entities.Course.list('-created_date'),
        api.entities.Student.list()
      ]);
      const instructorCourses = allCourses.filter(c => c.instructor_email === instructorSession.email);
      setCourses(instructorCourses);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getStudentCount = (courseId) => {
    return students.filter(s => s.course_id === courseId).length;
  };

  const handleCreateCourse = () => {
    try {
      const instructorSession = JSON.parse(localStorage.getItem('instructorSession'));
      if (!instructorSession) return;
      setEditingCourse({
      title: '',
      description: '',
      short_description: '',
      duration: '',
      schedule: '',
      start_date: '',
      end_date: '',
      language: '',
      total_lessons: 0,
      level: 'Principiante',
      category: '',
      price: 0,
      discount: 0,
      available_spots: 0,
      promo_video_url: '',
      curriculum: [{ title: '', description: '' }],
      requirements: [''],
      methodology: '',
      tools_used: [''],
      learning_outcomes: [''],
      target_audience: [''],
      includes: [''],
      tags: [''],
      image_url: '',
      instructor_email: instructorSession.email,
      instructor_name: instructorSession.name,
      status: 'open_for_registration'
    });
    setShowEditDialog(true);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse({
      ...course,
      curriculum: course.curriculum?.length > 0
        ? course.curriculum.map(item => typeof item === 'string' ? { title: item, description: '' } : item)
        : [{ title: '', description: '' }],
      requirements: course.requirements?.length > 0 ? course.requirements : [''],
      tools_used: course.tools_used?.length > 0 ? course.tools_used : [''],
      learning_outcomes: course.learning_outcomes?.length > 0 ? course.learning_outcomes : [''],
      target_audience: course.target_audience?.length > 0 ? course.target_audience : [''],
      includes: course.includes?.length > 0 ? course.includes : [''],
      tags: course.tags?.length > 0 ? course.tags : [''],
      methodology: course.methodology || '',
      short_description: course.short_description || '',
      end_date: course.end_date || '',
      language: course.language || '',
      total_lessons: course.total_lessons || 0,
      promo_video_url: course.promo_video_url || '',
      discount: course.discount || 0,
      available_spots: course.available_spots || 0
    });
    setShowEditDialog(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await api.integrations.Core.UploadFile({ file });
      setEditingCourse({ ...editingCourse, image_url: file_url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUploading(false);
  };

  const handleSaveCourse = async () => {
    if (!editingCourse.title.trim()) return;
    
    setSaving(true);
    try {
      const courseData = {
        ...editingCourse,
        curriculum: editingCourse.curriculum.filter(item => item.title?.trim()),
        requirements: editingCourse.requirements.filter(req => req.trim()),
        tools_used: editingCourse.tools_used.filter(t => t.trim()),
        learning_outcomes: (editingCourse.learning_outcomes || []).filter(item => item.trim()),
        target_audience: (editingCourse.target_audience || []).filter(item => item.trim()),
        includes: (editingCourse.includes || []).filter(item => item.trim()),
        tags: (editingCourse.tags || []).filter(item => item.trim())
      };

      if (editingCourse.id) {
        await api.entities.Course.update(editingCourse.id, courseData);
      } else {
        await api.entities.Course.create(courseData);
      }
      
      setShowEditDialog(false);
      setEditingCourse(null);
      loadData();
    } catch (error) {
      console.error('Error saving course:', error);
    }
    setSaving(false);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await api.entities.Course.delete(courseToDelete.id);
      setCourseToDelete(null);
      loadData();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const addCurriculumItem = () => {
    setEditingCourse({ ...editingCourse, curriculum: [...editingCourse.curriculum, { title: '', description: '' }] });
  };

  const removeCurriculumItem = (index) => {
    setEditingCourse({ ...editingCourse, curriculum: editingCourse.curriculum.filter((_, i) => i !== index) });
  };

  const updateCurriculumItem = (index, field, value) => {
    const newCurriculum = [...editingCourse.curriculum];
    newCurriculum[index] = { ...newCurriculum[index], [field]: value };
    setEditingCourse({ ...editingCourse, curriculum: newCurriculum });
  };

  const addTool = () => {
    setEditingCourse({ ...editingCourse, tools_used: [...(editingCourse.tools_used || []), ''] });
  };

  const removeTool = (index) => {
    setEditingCourse({ ...editingCourse, tools_used: editingCourse.tools_used.filter((_, i) => i !== index) });
  };

  const updateTool = (index, value) => {
    const newTools = [...editingCourse.tools_used];
    newTools[index] = value;
    setEditingCourse({ ...editingCourse, tools_used: newTools });
  };

  const addRequirement = () => {
    setEditingCourse({
      ...editingCourse,
      requirements: [...editingCourse.requirements, '']
    });
  };

  const removeRequirement = (index) => {
    setEditingCourse({
      ...editingCourse,
      requirements: editingCourse.requirements.filter((_, i) => i !== index)
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...editingCourse.requirements];
    newRequirements[index] = value;
    setEditingCourse({ ...editingCourse, requirements: newRequirements });
  };

  const addLearningOutcome = () => {
    setEditingCourse({ ...editingCourse, learning_outcomes: [...(editingCourse.learning_outcomes || []), ''] });
  };
  const removeLearningOutcome = (index) => {
    setEditingCourse({ ...editingCourse, learning_outcomes: editingCourse.learning_outcomes.filter((_, i) => i !== index) });
  };
  const updateLearningOutcome = (index, value) => {
    const newItems = [...editingCourse.learning_outcomes];
    newItems[index] = value;
    setEditingCourse({ ...editingCourse, learning_outcomes: newItems });
  };

  const addTargetAudience = () => {
    setEditingCourse({ ...editingCourse, target_audience: [...(editingCourse.target_audience || []), ''] });
  };
  const removeTargetAudience = (index) => {
    setEditingCourse({ ...editingCourse, target_audience: editingCourse.target_audience.filter((_, i) => i !== index) });
  };
  const updateTargetAudience = (index, value) => {
    const newItems = [...editingCourse.target_audience];
    newItems[index] = value;
    setEditingCourse({ ...editingCourse, target_audience: newItems });
  };

  const addInclude = () => {
    setEditingCourse({ ...editingCourse, includes: [...(editingCourse.includes || []), ''] });
  };
  const removeInclude = (index) => {
    setEditingCourse({ ...editingCourse, includes: editingCourse.includes.filter((_, i) => i !== index) });
  };
  const updateInclude = (index, value) => {
    const newItems = [...editingCourse.includes];
    newItems[index] = value;
    setEditingCourse({ ...editingCourse, includes: newItems });
  };

  const addTag = () => {
    setEditingCourse({ ...editingCourse, tags: [...(editingCourse.tags || []), ''] });
  };
  const removeTag = (index) => {
    setEditingCourse({ ...editingCourse, tags: editingCourse.tags.filter((_, i) => i !== index) });
  };
  const updateTag = (index, value) => {
    const newItems = [...editingCourse.tags];
    newItems[index] = value;
    setEditingCourse({ ...editingCourse, tags: newItems });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="flex flex-col gap-5">
        {/* Antes se pasaba course= y el gestor esperaba courseId: se quedaba cargando sin forma de volver. */}
        <button type="button" onClick={() => setSelectedCourse(null)} className="btn btn-s w-fit">← Volver a mis cursos</button>
        <h2 className="h text-2xl">{selectedCourse.title}</h2>
        <CourseContentManager courseId={selectedCourse.id} />
      </div>
    );
  }

  const statusLabels = {
    all: 'Todos',
    active: 'Activos',
    open_for_registration: 'Por comenzar',
    finished: 'Finalizados'
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Gestión de Cursos</h1>
        <Button 
          className="bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F] hover:from-[#1E3A5F] hover:to-[#2E6DB4] rounded-full shadow-lg"
          onClick={handleCreateCourse}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Curso
        </Button>
      </div>

      {courses.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar curso por nombre..."
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  statusFilter === value
                    ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#2E6DB4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <div className="w-20 h-20 bg-[#2E6DB4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-[#2E6DB4]" />
          </div>
          <p className="text-slate-500 mb-4">No tienes cursos creados</p>
          <Button onClick={handleCreateCourse} className="bg-[#2E6DB4] hover:bg-[#1E3A5F] rounded-full">
            Crear tu primer curso
          </Button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500">No se encontraron cursos con esos filtros.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all group"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={course.image_url || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop'} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' ? 'bg-green-500 text-white' : 
                    course.status === 'open_for_registration' ? 'bg-blue-500 text-white' : 
                    'bg-slate-500 text-white'
                  }`}>
                    {course.status === 'active' ? 'Activo' : course.status === 'open_for_registration' ? 'Postulaciones Abiertas' : 'Finalizado'}
                  </span>
                </div>
                {course.level && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1E3A5F] text-white">
                      {course.level}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-[#1E3A5F] mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{course.description}</p>

                <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {getStudentCount(course.id)}
                  </span>
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  )}
                  {course.price && (
                    <span className="font-semibold text-[#2E6DB4]">
                      ${course.price}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Contenido
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      setEditingCourse(course);
                      setShowPreviewDialog(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Vista previa
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setCourseToDelete(course)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Course Dialog */}
      <Dialog key={showEditDialog ? 'edit-open' : 'edit-closed'} open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1E3A5F]">
              {editingCourse?.id ? 'Editar Curso' : 'Crear Nuevo Curso'}
            </DialogTitle>
          </DialogHeader>
          
          {editingCourse && (
            <div className="space-y-6 mt-4">
              {/* Image Upload */}
              <div>
                <Label className="text-base font-semibold">Imagen del curso</Label>
                <div className="mt-2">
                  {editingCourse.image_url ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={editingCourse.image_url} alt="Course" className="w-full h-48 object-cover" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setEditingCourse({ ...editingCourse, image_url: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#2E6DB4] transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">Subir imagen del curso</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  )}
                  {uploading && <p className="text-sm text-[#2E6DB4] mt-2">Subiendo imagen...</p>}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Título del curso *</Label>
                  <Input
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    placeholder="Ej: Python y Data Science"
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Descripción *</Label>
                  <Textarea
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    placeholder="Describe el contenido y beneficios del curso..."
                    className="mt-1.5 h-28"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Resumen corto</Label>
                  <Input
                    value={editingCourse.short_description || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, short_description: e.target.value })}
                    placeholder="Resumen de 1-2 líneas para destacar en la vista previa..."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Nivel</Label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>

                <div>
                  <Label>Categoría</Label>
                  <Input
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    placeholder="Ej: Data Science"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Duración</Label>
                  <Input
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="Ej: 8 semanas"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Precio ($)</Label>
                  <Input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Descuento (%)</Label>
                  <Input
                    type="number"
                    value={editingCourse.discount}
                    onChange={(e) => setEditingCourse({ ...editingCourse, discount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Cupos disponibles</Label>
                  <Input
                    type="number"
                    value={editingCourse.available_spots}
                    onChange={(e) => setEditingCourse({ ...editingCourse, available_spots: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Fecha de inicio</Label>
                  <Input
                    value={editingCourse.start_date}
                    onChange={(e) => setEditingCourse({ ...editingCourse, start_date: e.target.value })}
                    placeholder="Ej: Marzo 2026"
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Horario de clases</Label>
                  <Input
                    value={editingCourse.schedule}
                    onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                    placeholder="Ej: Martes y Jueves 19:00 - 21:00"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Fecha de término</Label>
                  <Input
                    value={editingCourse.end_date || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, end_date: e.target.value })}
                    placeholder="Ej: Junio 2026"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Idioma</Label>
                  <Input
                    value={editingCourse.language || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, language: e.target.value })}
                    placeholder="Ej: Español"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Total de clases en vivo</Label>
                  <Input
                    type="number"
                    value={editingCourse.total_lessons || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, total_lessons: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Video promocional (URL)</Label>
                  <Input
                    value={editingCourse.promo_video_url || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, promo_video_url: e.target.value })}
                    placeholder="Ej: https://www.youtube.com/watch?v=..."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Estado</Label>
                  <select
                    value={editingCourse.status}
                    onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="active">Activo</option>
                    <option value="open_for_registration">Postulaciones Abiertas</option>
                    <option value="finished">Finalizado</option>
                  </select>
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">Temario del curso</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Agrega cada tema con su título y una breve descripción</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addCurriculumItem}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editingCourse.curriculum || []).map((item, index) => (
                    <div key={index} className="flex gap-2 items-start bg-slate-50 rounded-xl p-3">
                      <div className="w-6 h-6 rounded-full bg-[#2E6DB4]/15 flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold text-[#2E6DB4]">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <Input
                          value={item.title || ''}
                          onChange={(e) => updateCurriculumItem(index, 'title', e.target.value)}
                          placeholder="Título del tema (Ej: Introducción a Python)"
                          className="bg-white"
                        />
                        <Textarea
                          value={item.description || ''}
                          onChange={(e) => updateCurriculumItem(index, 'description', e.target.value)}
                          placeholder="Descripción breve de lo que se verá en este tema (opcional)"
                          className="bg-white h-16 text-sm resize-none"
                        />
                      </div>
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeCurriculumItem(index)} className="flex-shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">Requisitos previos</Label>
                    <p className="text-xs text-slate-400 mt-0.5">¿Qué debe saber el estudiante antes de tomar este curso?</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addRequirement}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingCourse.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Ej: Conocimientos básicos de matemáticas"
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeRequirement(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodology */}
              <div>
                <Label className="text-base font-semibold">Metodología de aprendizaje</Label>
                <p className="text-xs text-slate-400 mt-0.5 mb-2">Describe cómo se desarrollarán las clases: clases en vivo, proyectos, ejercicios prácticos, etc.</p>
                <Textarea
                  value={editingCourse.methodology || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, methodology: e.target.value })}
                  placeholder="Ej: El curso combina clases teóricas en vivo con ejercicios prácticos semanales. Cada sesión incluye ejemplos reales y tiempo para preguntas. Los estudiantes desarrollarán un proyecto final aplicado..."
                  className="h-28"
                />
              </div>

              {/* Tools Used */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">Herramientas tecnológicas</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Software, lenguajes o plataformas que se utilizarán</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addTool}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {(editingCourse.tools_used || []).map((tool, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tool}
                        onChange={(e) => updateTool(index, e.target.value)}
                        placeholder="Ej: Python, Pandas, Tableau, SQL..."
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeTool(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">¿Qué aprenderán?</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Logros concretos que obtendrán los estudiantes</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addLearningOutcome}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {(editingCourse.learning_outcomes || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateLearningOutcome(index, e.target.value)}
                        placeholder="Ej: Aprenderás a construir modelos de Machine Learning"
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeLearningOutcome(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">¿A quién está dirigido?</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Perfil de los estudiantes ideales para este curso</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addTargetAudience}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {(editingCourse.target_audience || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateTargetAudience(index, e.target.value)}
                        placeholder="Ej: Profesionales del área de datos sin experiencia previa"
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeTargetAudience(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Includes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">¿Qué incluye el curso?</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Beneficios que reciben los estudiantes</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addInclude}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {(editingCourse.includes || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateInclude(index, e.target.value)}
                        placeholder="Ej: Acceso a grabaciones, Material de apoyo, Certificado"
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeInclude(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label className="text-base font-semibold">Etiquetas</Label>
                    <p className="text-xs text-slate-400 mt-0.5">Palabras clave para facilitar la búsqueda</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addTag}>
                    <Plus className="w-3 h-3 mr-1" /> Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {(editingCourse.tags || []).map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="Ej: Python, Machine Learning, R"
                      />
                      <Button type="button" size="icon" aria-label="Quitar" variant="ghost" onClick={() => removeTag(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveCourse} 
                  className="flex-1 bg-gradient-to-r from-[#2E6DB4] to-[#1E3A5F]"
                  disabled={saving || !editingCourse.title.trim()}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  {editingCourse.id ? 'Guardar cambios' : 'Crear curso'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1E3A5F]">Vista Previa - Página Pública</DialogTitle>
          </DialogHeader>
          
          {editingCourse && (
            <div className="mt-4 space-y-6">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img 
                  src={editingCourse.image_url || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop'} 
                  alt={editingCourse.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {editingCourse.level}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      En vivo
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">{editingCourse.title}</h1>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <Clock className="w-5 h-5 text-[#2E6DB4] mb-2" />
                  <p className="text-sm text-slate-500">Duración</p>
                  <p className="font-semibold">{editingCourse.duration || 'No especificado'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <Users className="w-5 h-5 text-[#2E6DB4] mb-2" />
                  <p className="text-sm text-slate-500">Nivel</p>
                  <p className="font-semibold">{editingCourse.level}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <span className="text-2xl font-bold text-[#2E6DB4]">${editingCourse.price || 0}</span>
                  <p className="text-sm text-slate-500">Precio</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Descripción</h3>
                <p className="text-slate-600">{editingCourse.description}</p>
              </div>

              {editingCourse.curriculum?.filter(item => typeof item === 'string' ? item.trim() : item?.title?.trim()).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Temario</h3>
                  <div className="space-y-2">
                    {editingCourse.curriculum.filter(item => typeof item === 'string' ? item.trim() : item?.title?.trim()).map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2E6DB4] mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{typeof item === 'string' ? item : item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingCourse.requirements?.filter(req => req.trim()).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">Requisitos</h3>
                  <div className="space-y-2">
                    {editingCourse.requirements.filter(req => req.trim()).map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#2E6DB4] mt-2 flex-shrink-0" />
                        <span className="text-slate-600">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#2E6DB4]/5 p-6 rounded-xl border border-[#2E6DB4]/20">
                <p className="text-sm text-slate-600 mb-2">Instructor</p>
                <p className="font-bold text-[#1E3A5F]">{editingCourse.instructor_name}</p>
                {editingCourse.schedule && (
                  <p className="text-sm text-slate-500 mt-1">Horario: {editingCourse.schedule}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el curso "{courseToDelete?.title}" 
              y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}