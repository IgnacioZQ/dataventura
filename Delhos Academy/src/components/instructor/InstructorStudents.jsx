import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, UserPlus, Loader2, Trash2, Eye, EyeOff, Award, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/api/client';
import AddStudentModal from './AddStudentModal';

export default function InstructorStudents({ courseId = null }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState(courseId || 'all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCompleteCourseDialog, setShowCompleteCourseDialog] = useState(false);
  const [completingCourse, setCompletingCourse] = useState(false);
  const [completeCourseHours, setCompleteCourseHours] = useState('40');

  useEffect(() => {
    loadData();

    // Suscripción en tiempo real para actualizar estudiantes automáticamente
    const unsubscribe = api.entities.Student.subscribe(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      setCourseFilter(courseId);
    }
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const session = localStorage.getItem('instructorSession');
      if (!session) return;
      
      const instructorData = JSON.parse(session);
      const instructorEmail = instructorData.email;

      const response = await api.functions.invoke('getInstructorDashboard', { instructorEmail });
      const { students: instructorStudents, courses: activeCourses } = response.data;
      
      setStudents(instructorStudents || []);
      setCourses(activeCourses || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('¿Eliminar este estudiante?')) return;
    try {
      await api.functions.invoke('manageStudent', { action: 'delete', id: studentId });
      loadData();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleToggleCertificate = async (student) => {
    try {
      const newValue = !student.certificate_enabled;
      await api.functions.invoke('manageStudent', { action: 'update', id: student.id, certificate_enabled: newValue });
      toast.success(newValue ? `Certificado habilitado para ${student.name}` : `Certificado deshabilitado para ${student.name}`);
      loadData();
    } catch (error) {
      toast.error('Error al actualizar el certificado');
    }
  };

  const handleCompleteCourse = async () => {
    if (!courseId) return;
    setCompletingCourse(true);
    try {
      const hours = parseInt(completeCourseHours) || 40;

      await api.functions.invoke('manageStudent', {
        action: 'complete_course',
        courseId: courseId,
        certificate_hours: hours,
      });

      toast.success(`¡Curso completado! Los estudiantes pueden descargar su certificado.`);
      setShowCompleteCourseDialog(false);
      loadData();
    } catch (error) {
      console.error('Error al completar el curso:', error);
      toast.error('Error al completar el curso: ' + (error.response?.data?.error || error.message));
    }
    setCompletingCourse(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(search.toLowerCase()) ||
                         student.email?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.course_id === courseFilter;
    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E6DB4]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Estudiantes</h1>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar estudiante..." 
              className="pl-10 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!courseId && (
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-48 rounded-full">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los cursos</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {courseId && (
            <Button
              variant="outline"
              className="rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              onClick={() => setShowCompleteCourseDialog(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completar curso
            </Button>
          )}
          <Button 
            className="bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-full"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 mb-4">No tienes estudiantes registrados</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#1e3a5f] rounded-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar primer estudiante
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Estudiante</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Correo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Contraseña</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Curso</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Estado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Certificado</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 bg-slate-50">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       {student.profile_image ? (
                         <img 
                           src={student.profile_image} 
                           alt={student.name} 
                           className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                           onClick={() => setSelectedImage(student.profile_image)}
                         />
                       ) : (
                         <div className="w-10 h-10 rounded-full bg-[#2E6DB4]/20 flex items-center justify-center text-[#1e3a5f] font-medium">
                           {student.name?.charAt(0) || 'E'}
                         </div>
                       )}
                       <div>
                         <p className="font-medium text-slate-700">{student.name}</p>
                       </div>
                     </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                      <div className="flex items-center gap-2">
                        {visiblePasswords[student.id] ? student.password : '••••••••'}
                        <button
                          onClick={() => setVisiblePasswords({...visiblePasswords, [student.id]: !visiblePasswords[student.id]})}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {visiblePasswords[student.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.course_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        student.has_logged_in 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.has_logged_in ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleCertificate(student)}
                        title={student.certificate_enabled ? 'Deshabilitar certificado' : 'Habilitar certificado'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          student.certificate_enabled
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {student.certificate_enabled ? 'Habilitado' : 'Habilitar'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No se encontraron estudiantes
            </div>
          )}
        </motion.div>
      )}

      <AddStudentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        courses={courses}
        onStudentAdded={loadData}
      />

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <img 
            src={selectedImage} 
            alt="Foto de perfil"
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo confirmar completar curso */}
      <Dialog open={showCompleteCourseDialog} onOpenChange={setShowCompleteCourseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#1e3a5f]">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Completar curso
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-slate-600 text-sm">
              Al marcar este curso como completado:
            </p>
            <ul className="text-sm text-slate-600 space-y-1.5 pl-4">
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> El estado del curso cambiará a <strong>Finalizado</strong></li>
              <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Todos los estudiantes del curso podrán descargar su <strong>certificado</strong></li>
            </ul>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-3">
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                Horas cronológicas del certificado
              </label>
              <input
                type="number"
                min="1"
                value={completeCourseHours}
                onChange={e => setCompleteCourseHours(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ej: 40"
              />
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Esta acción cambiará el estado del curso y no puede revertirse fácilmente.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCompleteCourseDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCompleteCourse}
              disabled={completingCourse}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {completingCourse ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Procesando...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}