import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { action, ...data } = await req.json();

    if (!action) {
      return Response.json({ error: 'action requerido (create, update, delete)' }, { status: 400 });
    }

    if (action === 'create') {
      const student = await base44.asServiceRole.entities.Student.create(data);
      return Response.json({ student });
    }

    if (action === 'update') {
      const { id, ...updateData } = data;
      if (!id) return Response.json({ error: 'id requerido' }, { status: 400 });
      const student = await base44.asServiceRole.entities.Student.update(id, updateData);
      return Response.json({ student });
    }

    if (action === 'delete') {
      const { id } = data;
      if (!id) return Response.json({ error: 'id requerido' }, { status: 400 });
      await base44.asServiceRole.entities.Student.delete(id);
      return Response.json({ success: true });
    }

    if (action === 'complete_course') {
      const { courseId, certificate_hours } = data;
      if (!courseId) return Response.json({ error: 'courseId requerido' }, { status: 400 });
      const hours = parseInt(certificate_hours) || 40;

      // 1. Marcar curso como finalizado
      await base44.asServiceRole.entities.Course.update(courseId, { status: 'finished' });

      // 2. Habilitar certificado para todos los estudiantes del curso
      const students = await base44.asServiceRole.entities.Student.filter({ course_id: courseId });
      await Promise.all(
        students.map(s =>
          base44.asServiceRole.entities.Student.update(s.id, {
            certificate_enabled: true,
            certificate_hours: hours,
          })
        )
      );

      return Response.json({ success: true, studentsUpdated: students.length });
    }

    return Response.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});