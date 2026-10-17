import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// El contenido del juego vive en src/content. El seed solo crea las cuentas de prueba.
const db = new PrismaClient();

async function main() {
  const demoUsers = [
    { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, nombre: "Administración DataMind", role: Role.ADMIN },
    { email: process.env.SEED_STUDENT_EMAIL, password: process.env.SEED_STUDENT_PASSWORD, nombre: "Estudiante Demo", role: Role.USER }
  ];

  for (const demo of demoUsers) {
    if (!demo.email || !demo.password) {
      throw new Error("Configura SEED_ADMIN_EMAIL/PASSWORD y SEED_STUDENT_EMAIL/PASSWORD antes de ejecutar el seed.");
    }
    if (demo.password.length < 12) {
      throw new Error(`La contraseña de seed para ${demo.email} debe tener al menos 12 caracteres.`);
    }
    const passwordHash = await bcrypt.hash(demo.password, 12);
    await db.user.upsert({
      where: { email: demo.email.toLowerCase() },
      update: { nombre: demo.nombre, role: demo.role, passwordHash },
      create: { email: demo.email.toLowerCase(), nombre: demo.nombre, role: demo.role, passwordHash }
    });
  }

  console.info(`Seed aplicado: ${demoUsers.length} cuentas de prueba.`);
}

main()
  .catch((error: unknown) => {
    console.error("Falló el seed de DataMind.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
