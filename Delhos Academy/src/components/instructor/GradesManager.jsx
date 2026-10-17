import React, { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Plus, Search, Loader2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function GradesManager({ instructorData }) {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [deleteGradeId, setDeleteGradeId] = useState(null);

  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    assignment_name: '',
    grade: '',
    max_grade: 100,
    feedback: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gradesData, studentsData, coursesData] = await Promise.all([
        api.entities.Grade.filter({ instructor_email: instructorData.email }),
        api.entities.Student.filter({ instructor_email: instructorData.email }),
        api.entities.Course.filter({ instructor_email: instructorData.email })
      ]);
      
      // Solo cursos activos
      const activeCourses = coursesData.filter(c => c.status === 'active');
      const activeCourseIds = new Set(activeCourses.map(c => c.id));
      
      // Solo estudiantes de cursos activos
      const activeStudents = studentsData.filter(s => activeCourseIds.has(s.course_id));
      
      setGrades(gradesData);
      setStudents(activeStudents);
      setCourses(activeCourses);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar datos');
    }
    setLoading(false);
  };

  const handleAddGrade = async () => {
    if (!formData.student_id || !formData.course_id || !formData.assignment_name || !formData.grade) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const student = students.find(s => s.id === formData.student_id);
      
      const gradeData = {
        ...formData,
        student_email: student.email,
        student_name: student.name,
        instructor_email: instructorData.email,
        grade: parseFloat(formData.grade),
        max_grade: parseFloat(formData.max_grade)
      };

      if (editingGrade) {
        await api.entities.Grade.update(editingGrade.id, gradeData);
        toast.success('Calificación actualizada');
      } else {
        await api.entities.Grade.create(gradeData);
        toast.success('Calificación agregada');
      }

      setAddDialogOpen(false);
      setEditingGrade(null);
      setFormData({
        student_id: '',
        course_id: '',
        assignment_name: '',
        grade: '',
        max_grade: 100,
        feedback: ''
      });
      loadData();
    } catch (error) {
      console.error('Error saving grade:', error);
      toast.error('Error al guardar calificación');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      student_id: grade.student_id,
      course_id: grade.course_id,
      assignment_name: grade.assignment_name,
      grade: grade.grade.toString(),
      max_grade: grade.max_grade,
      feedback: grade.feedback || ''
    });
    setAddDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.entities.Grade.delete(deleteGradeId);
      toast.success('Calificación eliminada');
      setDeleteGradeId(null);
      loadData();
    } catch (error) {
      console.error('Error deleting grade:', error);
      toast.error('Error al eliminar calificación');
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesCourse = filterCourse === 'all' || grade.course_id === filterCourse;
    const matchesSearch = grade.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.assignment_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">Calificaciones</h2>
          <p className="text-slate-500">Gestiona las calificaciones de tus estudiantes</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E6DB4] hover:bg-[#1e3a5f]" onClick={() => {
              setEditingGrade(null);
              setFormData({
                student_id: '',
                course_id: '',
                assignment_name: '',
                grade: '',
                max_grade: 100,
                feedback: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Calificación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGrade ? 'Editar' : 'Agregar'} Calificación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Curso</Label>
                <Select value={formData.course_id} onValueChange={(val) => setFormData({...formData, course_id: val, student_id: ''})}>
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

              <div>
                <Label>Estudiante</Label>
                <Select value={formData.student_id} onValueChange={(val) => setFormData({...formData, student_id: val})} disabled={!formData.course_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.filter(s => s.course_id === formData.course_id).map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nombre de la Tarea/Evaluación</Label>
                <Input
                  value={formData.assignment_name}
                  onChange={(e) => setFormData({...formData, assignment_name: e.target.value})}
                  placeholder="Ej: Proyecto Final, Quiz 1, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calificación</Label>
                  <Input
                    type="number"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label>De</Label>
                  <Input
                    type="number"
                    value={formData.max_grade}
                    onChange={(e) => setFormData({...formData, max_grade: e.target.value})}
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label>Retroalimentación (Opcional)</Label>
                <Textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  placeholder="Comentarios para el estudiante..."
                  className="h-20"
                />
              </div>

              <Button onClick={handleAddGrade} className="w-full bg-[#2E6DB4] hover:bg-[#1e3a5f]">
                {editingGrade ? 'Actualizar' : 'Guardar'} Calificación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por estudiante o tarea..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredGrades.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No hay calificaciones registradas</p>
          <Button onClick={() => setAddDialogOpen(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar primera calificación
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Estudiante</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Tarea</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Curso</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Calificación</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.map(grade => {
                const course = courses.find(c => c.id === grade.course_id);
                const percentage = ((grade.grade / grade.max_grade) * 100).toFixed(0);
                return (
                  <tr key={grade.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{grade.student_name}</div>
                      <div className="text-sm text-slate-500">{grade.student_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{grade.assignment_name}</div>
                      {grade.feedback && (
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{grade.feedback}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course?.title || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {grade.grade}/{grade.max_grade}
                        </span>
                        <span className="text-xs text-slate-500">({percentage}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(grade.created_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(grade)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteGradeId(grade.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deleteGradeId} onOpenChange={() => setDeleteGradeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar calificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La calificación será eliminada permanentemente.
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