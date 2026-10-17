import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // Filter directly by email to avoid pagination issues
    const students = await base44.asServiceRole.entities.Student.filter({ email: email.toLowerCase().trim() });

    // Also try without lowercasing in case the stored email has different casing
    let student = students[0];
    if (!student) {
      const allStudents = await base44.asServiceRole.entities.Student.list('created_date', 500);
      student = allStudents.find(s => s.email?.toLowerCase().trim() === email.toLowerCase().trim());
    }

    if (!student) {
      return Response.json({ error: 'No se encontró un estudiante con ese correo' }, { status: 404 });
    }

    if (student.password !== password) {
      return Response.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    if (!student.has_logged_in) {
      await base44.asServiceRole.entities.Student.update(student.id, { has_logged_in: true });
      student.has_logged_in = true;
    }

    return Response.json({ student });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});