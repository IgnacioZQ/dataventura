import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { courseId, lessonId, lessonTitle, startDateTime, endDateTime, description, moduleId } = await req.json();

    if (!courseId || !lessonTitle || !startDateTime || !endDateTime) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [course, students] = await Promise.all([
      base44.asServiceRole.entities.Course.get(courseId),
      base44.asServiceRole.entities.Student.filter({ course_id: courseId, status: 'active' }),
    ]);

    if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Build attendees: students + instructor (so event appears in instructor's calendar too)
    const instructorEmail = course.instructor_email;
    const studentAttendees = students.map(s => ({ email: s.email, displayName: s.nombre_completo || s.name }));
    const allAttendees = instructorEmail
      ? [{ email: instructorEmail, organizer: true }, ...studentAttendees]
      : studentAttendees;

    const calEvent = {
      summary: `${course.title} — ${lessonTitle}`,
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
      conferenceData: {
        createRequest: {
          requestId: `delhos-${courseId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      visibility: 'default',
      status: 'confirmed',
    };

    // If updating an existing event in Google Calendar, PATCH instead of POST
    let createdEvent;
    if (lessonId) {
      const existingLesson = await base44.asServiceRole.entities.CourseLesson.get(lessonId);
      if (existingLesson?.google_event_id) {
        // Update existing Google Calendar event
        const patchRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingLesson.google_event_id}?conferenceDataVersion=1&sendUpdates=all`,
          {
            method: 'PUT',
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(calEvent),
          }
        );
        if (!patchRes.ok) {
          const err = await patchRes.text();
          return Response.json({ error: 'Google Calendar update error', details: err }, { status: 500 });
        }
        createdEvent = await patchRes.json();
      }
    }

    // Create new event if no existing one was updated
    if (!createdEvent) {
      const calRes = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(calEvent),
        }
      );
      if (!calRes.ok) {
        const err = await calRes.text();
        return Response.json({ error: 'Google Calendar error', details: err }, { status: 500 });
      }
      createdEvent = await calRes.json();
    }

    const meetLink = createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri || '';

    const lessonPatch = {
      meet_link: meetLink,
      scheduled_date: startDateTime,
      google_event_id: createdEvent.id,
      type: 'live',
    };

    let lesson;
    if (lessonId) {
      lesson = await base44.asServiceRole.entities.CourseLesson.update(lessonId, lessonPatch);
    } else {
      let resolvedModuleId = moduleId;
      if (!resolvedModuleId) {
        const modules = await base44.asServiceRole.entities.CourseModule.filter({ course_id: courseId });
        if (modules.length > 0) {
          resolvedModuleId = modules.sort((a, b) => a.order - b.order)[0].id;
        } else {
          const m = await base44.asServiceRole.entities.CourseModule.create({ course_id: courseId, title: 'Clases', order: 1 });
          resolvedModuleId = m.id;
        }
      }
      const existingInModule = await base44.asServiceRole.entities.CourseLesson.filter({ module_id: resolvedModuleId });
      lesson = await base44.asServiceRole.entities.CourseLesson.create({
        course_id: courseId,
        module_id: resolvedModuleId,
        title: lessonTitle,
        description: description || '',
        type: 'live',
        order: existingInModule.length + 1,
        ...lessonPatch,
      });
    }

    return Response.json({
      success: true,
      meetLink,
      eventId: createdEvent.id,
      lesson,
      studentsNotified: students.length,
      instructorNotified: !!instructorEmail,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});