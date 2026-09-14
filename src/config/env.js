import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  PORT: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME es requerida"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY es requerida"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET es requerida"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Variables de entorno inválidas o faltantes:");
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = result.data;