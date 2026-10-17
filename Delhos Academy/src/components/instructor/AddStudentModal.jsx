import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Loader2 } from 'lucide-react';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function AddStudentModal({ open, onClose, courses, onStudentAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.course_id || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    console.log('=== INICIO: Agregar estudiante ===');

    try {
      const selectedCourse = courses.find(c => c.id === formData.course_id);
      console.log('Curso seleccionado:', selectedCourse);
      
      if (!selectedCourse) {
        throw new Error('No se encontró el curso seleccionado');
      }

      const platformUrl = window.location.origin;
      
      // Crear estudiante
      console.log('Creando estudiante con datos:', {
        name: formData.name,
        email: formData.email,
        course_id: formData.course_id,
        course_name: selectedCourse.title
      });

      const response = await api.functions.invoke('manageStudent', {
        action: 'create',
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
        course_id: formData.course_id,
        course_name: selectedCourse.title,
        instructor_email: selectedCourse.instructor_email,
        progress: 0,
        status: 'active'
      });
      const newStudent = response.data.student;

      console.log('✓ Estudiante creado exitosamente:', newStudent);
      toast.success('Estudiante agregado exitosamente');

      // Limpiar y cerrar
      setFormData({ name: '', email: '', course_id: '', password: '' });
      onStudentAdded();
      onClose();
      
      console.log('=== FIN: Proceso completado ===');
    } catch (error) {
      console.error('❌ ERROR al agregar estudiante:', error);
      console.error('Detalles del error:', {
        message: error.message,
        stack: error.stack,
        error: error
      });
      
      toast.error(`Error al agregar estudiante: ${error.message || 'Verifica la consola para más detalles'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1e3a5f]">
            <UserPlus className="w-5 h-5" />
            Agregar Estudiante
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Nombre completo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="juan@email.com"
              className="mt-1.5 rounded-xl"
              required
            />
          </div>

          <div>
            <Label>Curso</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => setFormData({ ...formData, course_id: value })}
            >
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Contraseña temporal</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Contraseña"
                className="rounded-xl"
                required
              />
              <Button type="button" variant="outline" onClick={generatePassword} className="rounded-xl">
                Generar
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-full">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#1e3a5f] hover:bg-[#2A4C77] rounded-full"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}