import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { lessonId, lessonTitle, description, startDateTime, endDateTime, courseId } = await req.json();

    if (!lessonId || !startDateTime || !endDateTime || !courseId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [lesson, course, students] = await Promise.all([
      base44.asServiceRole.entities.CourseLesson.get(lessonId),
      base44.asServiceRole.entities.Course.get(courseId),
      base44.asServiceRole.entities.Student.filter({ course_id: courseId, status: 'active' }),
    ]);

    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });
    if (!lesson.google_event_id) return Response.json({ error: 'No Google Calendar event linked' }, { status: 400 });
    if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const title = lessonTitle || lesson.title;
    const instructorEmail = course.instructor_email;
    const studentAttendees = students.map(s => ({ email: s.email, displayName: s.nombre_completo || s.name }));
    const allAttendees = instructorEmail
      ? [{ email: instructorEmail, organizer: true }, ...studentAttendees]
      : studentAttendees;

    const eventBody = {
      summary: `${course.title} — ${title}`,
      description: [
        description || `Clase en vivo del curso "${course.title}"`,
        '',
        `📚 Curso: ${course.title}`,
        `👨‍🏫 Instructor: ${course.instructor_name || instructorEmail}`,
        '',
        'Este evento fue generado automáticamente por Delhos Academy.',
      ].join('\n'),
      start: { dateTime: startDateTime, timeZone: 'America/Santiago' },
      end:   { dateTime: endDateTime,   timeZone: 'America/Santiago' },
      attendees: allAttendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      status: 'confirmed',
    };

    // Use PUT (full replace) to ensure all attendees are properly synced
    const patchRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${lesson.google_event_id}?sendUpdates=all`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody),
      }
    );

    if (!patchRes.ok) {
      const err = await patchRes.text();
      return Response.json({ error: 'Failed to update event', details: err }, { status: 500 });
    }

    const updatedEvent = await patchRes.json();

    await base44.asServiceRole.entities.CourseLesson.update(lessonId, {
      scheduled_date: startDateTime,
      title,
      description: description || lesson.description,
    });

    return Response.json({
      success: true,
      eventId: updatedEvent.id,
      studentsNotified: students.length,
      instructorNotified: !!instructorEmail,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});