import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  imageUrl: z.string().url("La URL de imagen no es válida").optional(),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  catalogId: z.string().uuid("catalogId debe ser un UUID válido"),
  categoryId: z.string().uuid("categoryId debe ser un UUID válido"),
});

export const updateProductSchema = createProductSchema
  .omit({ catalogId: true })
  .partial();