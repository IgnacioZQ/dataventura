import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const instructors = await base44.asServiceRole.entities.Instructor.filter({});
    const instructor = instructors.find(i => i.email.toLowerCase() === email.toLowerCase());

    if (!instructor) {
      return Response.json({ error: 'No se encontró un instructor con ese correo' }, { status: 404 });
    }

    if (instructor.password !== password) {
      return Response.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return Response.json({ instructor });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});