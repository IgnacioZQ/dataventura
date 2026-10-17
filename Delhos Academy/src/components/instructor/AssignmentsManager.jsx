import React, { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Download, Check, Loader2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AssignmentsManager({ instructorData, courseId = null }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseId || 'all');
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
    max_grade: 100
  });

  const [gradeData, setGradeData] = useState({
    grade: '',
    feedback: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (courseId) {
      setFormData(prev => ({ ...prev, course_id: courseId }));
    }
  }, [courseId]);

  const loadData = async () => {
    try {
      const [assignmentsData, submissionsData, coursesData] = await Promise.all([
        api.entities.Assignment.filter({ instructor_email: instructorData.email }),
        api.entities.Submission.list(),
        api.entities.Course.filter({ instructor_email: instructorData.email })
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    }
    setLoading(false);
  };

  const handleAddAssignment = async () => {
    if (!formData.course_id || !formData.title) {
      toast.error('Completa los campos requeridos');
      return;
    }

    try {
      const course = courses.find(c => c.id === formData.course_id);
      await api.entities.Assignment.create({
        ...formData,
        course_name: course.title,
        instructor_email: instructorData.email,
        max_grade: parseFloat(formData.max_grade)
      });

      toast.success('Tarea creada');
      setAddDialogOpen(false);
      setFormData({ course_id: '', title: '', description: '', due_date: '', max_grade: 100 });
      loadData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Error al crear tarea');
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradeData.grade) {
      toast.error('Ingresa una calificación');
      return;
    }

    try {
      await api.entities.Submission.update(selectedSubmission.id, {
        grade: parseFloat(gradeData.grade),
        feedback: gradeData.feedback,
        graded_by: instructorData.email,
        graded_date: new Date().toISOString(),
        status: 'graded'
      });

      toast.success('Calificación guardada');
      setGradeDialogOpen(false);
      setSelectedSubmission(null);
      setGradeData({ grade: '', feedback: '' });
      loadData();
    } catch (error) {
      console.error('Error grading:', error);
      toast.error('Error al calificar');
    }
  };

  const handleDelete = async () => {
    try {
      await api.entities.Assignment.delete(deleteId);
      toast.success('Tarea eliminada');
      setDeleteId(null);
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error al eliminar');
    }
  };

  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter(s => s.assignment_id === assignmentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Tareas</h2>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E6DB4] hover:bg-[#1e3a5f] rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!courseId && (
                <div>
                  <Label>Curso</Label>
                  <Select value={formData.course_id} onValueChange={(val) => setFormData({...formData, course_id: val})}>
                    <SelectTrigger>
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

              <div>
                <Label>Título de la Tarea</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ej: Proyecto Final"
                />
              </div>

              <div>
                <Label>Descripción e Instrucciones</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Instrucciones para el estudiante..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Fecha Límite</Label>
                <Input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>

              <div>
                <Label>Puntaje Máximo</Label>
                <Input
                  type="number"
                  value={formData.max_grade}
                  onChange={(e) => setFormData({...formData, max_grade: e.target.value})}
                  placeholder="100"
                />
              </div>

              <Button onClick={handleAddAssignment} className="w-full bg-[#2E6DB4] hover:bg-[#1e3a5f]">
                Crear Tarea
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No hay tareas creadas</p>
          <Button onClick={() => setAddDialogOpen(true)} variant="outline" className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear primera tarea
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments
            .filter(a => !courseId || a.course_id === courseId)
            .map(assignment => {
              const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
              const gradedCount = assignmentSubmissions.filter(s => s.status === 'graded').length;
              const pendingCount = assignmentSubmissions.length - gradedCount;
              
              return (
                <div key={assignment.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Assignment header */}
                  <div className="flex items-start justify-between p-5 border-b border-slate-100">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1e3a5f] text-base">{assignment.title}</h4>
                      {assignment.description && (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{assignment.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                        {assignment.due_date && (
                          <span>Vence: {new Date(assignment.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                        <span>Máx: {assignment.max_grade} pts</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{assignmentSubmissions.length} entregas</p>
                        <p className="text-xs text-slate-400">{gradedCount} calificadas · {pendingCount} pendientes</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(assignment.id)} className="text-red-400 hover:text-red-600 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Submissions */}
                  {assignmentSubmissions.length > 0 && (
                    <div className="divide-y divide-slate-50">
                      {assignmentSubmissions.map(submission => (
                        <div key={submission.id} className="flex items-center gap-3 px-5 py-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                            submission.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {submission.student_name?.charAt(0) || 'E'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 text-sm">{submission.student_name}</p>
                            <p className="text-xs text-slate-400">{new Date(submission.created_date).toLocaleDateString('es-ES')}</p>
                          </div>
                          {submission.status === 'graded' && (
                            <span className="text-sm font-semibold text-green-600 flex-shrink-0">
                              {submission.grade}/{assignment.max_grade}
                            </span>
                          )}
                          {submission.status !== 'graded' && (
                            <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full flex-shrink-0">Pendiente</span>
                          )}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Download className="w-3.5 h-3.5" />
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant={submission.status === 'graded' ? 'outline' : 'default'}
                              className={`text-xs h-8 px-3 ${submission.status !== 'graded' ? 'bg-[#2E6DB4] hover:bg-[#1e3a5f] text-white' : ''}`}
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setGradeData({ 
                                  grade: submission.grade?.toString() || '', 
                                  feedback: submission.feedback || '' 
                                });
                                setGradeDialogOpen(true);
                              }}
                            >
                              {submission.status === 'graded' ? <Edit className="w-3.5 h-3.5" /> : 'Calificar'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {assignmentSubmissions.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-5">Sin entregas aún</p>
                  )}
                </div>
              );
            })}
        </div>
      )}

      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.status === 'graded' ? 'Editar Calificación' : 'Calificar Entrega'}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Estudiante</p>
                <p className="font-semibold text-slate-900">{selectedSubmission.student_name}</p>
                {selectedSubmission.status === 'graded' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Calificación actual: {selectedSubmission.grade}
                  </p>
                )}
              </div>

              <div>
                <Label>Calificación</Label>
                <Input
                  type="number"
                  value={gradeData.grade}
                  onChange={(e) => setGradeData({...gradeData, grade: e.target.value})}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <Label>Retroalimentación</Label>
                <Textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                  placeholder="Comentarios para el estudiante..."
                  className="h-24"
                />
              </div>

              <Button onClick={handleGradeSubmission} className="w-full bg-[#2E6DB4] hover:bg-[#1e3a5f]">
                {selectedSubmission.status === 'graded' ? 'Actualizar Calificación' : 'Guardar Calificación'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la tarea y todas sus entregas. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}