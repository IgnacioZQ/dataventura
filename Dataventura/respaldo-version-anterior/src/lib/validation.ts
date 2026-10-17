import { z } from "zod";

export const emailSchema = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
export const passwordSchema = z.string().min(12).max(128);

export const registerSchema = z.object({
  email: emailSchema,
  nombre: z.string().trim().min(2).max(80),
  password: passwordSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128)
});

export const onboardingSchema = z.object({
  objetivoDeclarado: z.enum(["DECISIONES", "PROFESIONAL", "ESTUDIOS", "CURIOSIDAD"]),
  nivelInicial: z.enum(["PRINCIPIANTE", "INTERMEDIO", "AVANZADO"])
});
