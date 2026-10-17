import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { api } from '@/api/client';
import { toast } from 'sonner';

export default function ExportStudentsData({ instructorEmail }) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = async () => {
    setExporting(true);
    try {
      // Obtener datos
      const [students, courses, attendance, submissions, assignments] = await Promise.all([
        api.entities.Student.filter({ instructor_email: instructorEmail }),
        api.entities.Course.filter({ instructor_email: instructorEmail }),
        api.entities.Attendance.list(),
        api.entities.Submission.list(),
        api.entities.Assignment.filter({ instructor_email: instructorEmail })
      ]);

      // Preparar datos para cada estudiante
      const rows = students.map(student => {
        const studentCourse = courses.find(c => c.id === student.course_id);
        
        // Calcular asistencia
        const studentAttendance = attendance.filter(a => a.student_id === student.id);
        const attendedClasses = studentAttendance.filter(a => a.attended).length;
        const totalClasses = studentAttendance.length;
        const attendanceRate = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(1) : '0';

        // Obtener calificaciones
        const studentSubmissions = submissions.filter(s => s.student_id === student.id && s.status === 'graded');
        const grades = studentSubmissions.map(sub => {
          const assignment = assignments.find(a => a.id === sub.assignment_id);
          return `${assignment?.title || 'N/A'}: ${sub.grade}/${assignment?.max_grade || 100}`;
        }).join(' | ');

        const avgGrade = studentSubmissions.length > 0
          ? (studentSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / studentSubmissions.length).toFixed(1)
          : 'N/A';

        return {
          'Nombre': student.name,
          'Email': student.email,
          'Contraseña': student.password || '',
          'Curso': studentCourse?.title || 'N/A',
          'Estado': student.status === 'active' ? 'Activo' : 'Inactivo',
          'Biografía': student.bio || '',
          'LinkedIn': student.linkedin || '',
          'Sitio Web': student.website || '',
          'Áreas de Interés': student.specialties?.join(' | ') || '',
          'Logros': student.achievements?.join(' | ') || '',
          'Certificaciones': student.certifications?.join(' | ') || '',
          'Clases Asistidas': `${attendedClasses}/${totalClasses}`,
          'Porcentaje Asistencia': `${attendanceRate}%`,
          'Racha': student.streak || 0,
          'Puntos': student.points || 0,
          'Progreso': `${student.progress || 0}%`,
          'Promedio Calificaciones': avgGrade,
          'Evaluaciones': grades || 'Sin calificaciones',
          'Fecha Registro': new Date(student.created_date).toLocaleDateString('es-ES')
        };
      });

      // Convertir a CSV
      if (rows.length === 0) {
        toast.error('No hay estudiantes para exportar');
        setExporting(false);
        return;
      }

      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(','),
        ...rows.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escapar valores con comas o comillas
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Descargar archivo
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar datos');
    }
    setExporting(false);
  };

  return (
    <Button
      onClick={exportToCSV}
      disabled={exporting}
      variant="outline"
      className="w-fit"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Exportar estudiantes (CSV para Excel)
        </>
      )}
    </Button>
  );
}