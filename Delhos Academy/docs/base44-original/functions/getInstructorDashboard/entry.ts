import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { instructorEmail } = await req.json();

    if (!instructorEmail) {
      return Response.json({ error: 'instructorEmail requerido' }, { status: 400 });
    }

    const [allStudents, allCourses, allLessons] = await Promise.all([
      base44.asServiceRole.entities.Student.filter({}),
      base44.asServiceRole.entities.Course.filter({}),
      base44.asServiceRole.entities.CourseLesson.filter({})
    ]);

    const courses = allCourses.filter(c => c.instructor_email === instructorEmail);
    const activeCourses = courses.filter(c => c.status === 'active');
    const allCourseIds = new Set(courses.map(c => c.id));

    const students = allStudents.filter(s =>
      s.instructor_email === instructorEmail && allCourseIds.has(s.course_id)
    );

    return Response.json({ students, courses: activeCourses, lessons: allLessons, allCourses: courses });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});