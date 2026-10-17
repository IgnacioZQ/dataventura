import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Get all active assignments with a due_date
    const allAssignments = await base44.asServiceRole.entities.Assignment.filter({ status: 'active' });

    // Filter those with deadline within the next 24-48h window (to avoid duplicates from hourly runs)
    const upcoming = allAssignments.filter(a => {
      if (!a.due_date) return false;
      const due = new Date(a.due_date);
      return due >= in24h && due < in48h;
    });

    if (upcoming.length === 0) {
      return Response.json({ success: true, message: 'No upcoming deadlines', checked: allAssignments.length });
    }

    let totalEmails = 0;

    for (const assignment of upcoming) {
      // Get students of this course who haven't submitted yet
      const [students, submissions] = await Promise.all([
        base44.asServiceRole.entities.Student.filter({ course_id: assignment.course_id, status: 'active' }),
        base44.asServiceRole.entities.Submission.filter({ assignment_id: assignment.id })
      ]);

      const submittedStudentIds = new Set(submissions.map(s => s.student_id));
      const pendingStudents = students.filter(s => !submittedStudentIds.has(s.id));

      const dueDateStr = new Date(assignment.due_date).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const emailPromises = pendingStudents.map(student => {
        const nombre = student.nombre_completo || student.name || 'Estudiante';
        const body = `
Hola ${nombre},

Te recordamos que tienes una tarea pendiente con fecha límite próxima.

📝 Tarea: ${assignment.title}
⏰ Fecha límite: ${dueDateStr}
${assignment.description ? `\nDescripción:\n${assignment.description}` : ''}

¡No olvides entregar tu trabajo a tiempo! Ingresa a la plataforma para subir tu entrega.

Saludos,
Delhos Academy
        `.trim();

        return base44.asServiceRole.integrations.Core.SendEmail({
          to: student.email,
          subject: `⏰ Recordatorio: "${assignment.title}" vence en menos de 24 horas`,
          body
        });
      });

      await Promise.all(emailPromises);
      totalEmails += pendingStudents.length;
    }

    return Response.json({ success: true, assignmentsChecked: upcoming.length, emailsSent: totalEmails });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});