import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data } = payload;
    const entityName = event?.entity_name;

    let courseId, announcementTitle, announcementContent, emailSubject, emailBody;

    if (entityName === 'CourseLesson') {
      courseId = data?.course_id;
      announcementTitle = `📚 Nueva lección publicada: ${data?.title || 'Sin título'}`;
      announcementContent = data?.description
        ? `Se ha publicado una nueva lección: "${data.title}". ${data.description}`
        : `Se ha publicado una nueva lección: "${data.title}".`;
      emailSubject = `Nueva lección: ${data?.title}`;
      emailBody = announcementContent;
    } else if (entityName === 'Assignment') {
      courseId = data?.course_id;
      announcementTitle = `📝 Nueva tarea asignada: ${data?.title || 'Sin título'}`;
      announcementContent = data?.description
        ? `Se ha asignado una nueva tarea: "${data.title}". ${data.description}`
        : `Se ha asignado una nueva tarea: "${data.title}".`;
      if (data?.due_date) {
        const dueDateStr = new Date(data.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        announcementContent += ` Fecha límite: ${dueDateStr}.`;
      }
      emailSubject = `📝 Nueva tarea asignada: ${data?.title}`;
      emailBody = announcementContent;
    } else {
      return Response.json({ skipped: true });
    }

    if (!courseId) return Response.json({ skipped: true, reason: 'no course_id' });

    const courses = await base44.asServiceRole.entities.Course.filter({ id: courseId });
    const course = courses[0];
    const instructorEmail = course?.instructor_email || data?.instructor_email || '';
    const instructorName = course?.instructor_name || 'Tu Instructor';
    const courseName = course?.title || data?.course_name || 'tu curso';

    // Create internal announcement
    await base44.asServiceRole.entities.Announcement.create({
      course_id: courseId,
      instructor_email: instructorEmail,
      instructor_name: instructorName,
      title: announcementTitle,
      content: announcementContent,
      read_by: []
    });

    // Send email to all students of the course
    if (entityName === 'Assignment') {
      const students = await base44.asServiceRole.entities.Student.filter({ course_id: courseId, status: 'active' });

      const dueDateStr = data?.due_date
        ? new Date(data.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;

      const emailPromises = students.map(student => {
        const nombre = student.nombre_completo || student.name || 'Estudiante';
        const body = `
Hola ${nombre},

Se ha publicado una nueva tarea en el curso "${courseName}".

📝 Tarea: ${data?.title}
${data?.description ? `\nDescripción:\n${data.description}\n` : ''}
${dueDateStr ? `⏰ Fecha límite: ${dueDateStr}` : ''}

Ingresa a la plataforma para ver los detalles y realizar tu entrega.

Saludos,
${instructorName}
Delhos Academy
        `.trim();

        return base44.asServiceRole.integrations.Core.SendEmail({
          to: student.email,
          subject: emailSubject,
          body
        });
      });

      await Promise.all(emailPromises);
      return Response.json({ success: true, courseId, emailsSent: students.length });
    }

    return Response.json({ success: true, courseId, announcementTitle });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});