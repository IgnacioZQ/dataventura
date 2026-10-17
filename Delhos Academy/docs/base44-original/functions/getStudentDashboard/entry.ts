import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { courseId } = await req.json();

    if (!courseId) {
      return Response.json({ error: 'courseId requerido' }, { status: 400 });
    }

    const [courses, modules, lessons] = await Promise.all([
      base44.asServiceRole.entities.Course.filter({ id: courseId }),
      base44.asServiceRole.entities.CourseModule.filter({ course_id: courseId }),
      base44.asServiceRole.entities.CourseLesson.filter({ course_id: courseId })
    ]);

    return Response.json({
      course: courses[0] || null,
      modules,
      lessons
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});