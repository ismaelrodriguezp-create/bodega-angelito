import { z } from 'zod';

export const productSchema = z.object({
  barcode: z.string().trim().nullable().optional().or(z.literal('')),
  sku: z.string().trim().nullable().optional().or(z.literal('')),
  name: z.string().trim().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  description: z.string().trim().nullable().optional().or(z.literal('')),
  brand: z.string().trim().nullable().optional().or(z.literal('')),
  category_id: z.string().uuid({ message: 'Categoría no válida' }).nullable().optional(),
  price: z.coerce.number().min(0, { message: 'El precio debe ser mayor o igual a 0' }),
  cost: z.coerce.number().min(0, { message: 'El costo debe ser mayor o igual a 0' }),
  is_active: z.boolean().default(true),
});

export const productWithStockSchema = productSchema.extend({
  initial_stock: z.coerce.number().int().min(0, { message: 'El stock inicial debe ser mayor o igual a 0' }).default(0),
  minimum_stock: z.coerce.number().int().min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' }).default(5),
  safety_stock: z.coerce.number().int().min(0, { message: 'El stock de seguridad debe ser mayor o igual a 0' }).default(2),
  location_in_store: z.string().trim().nullable().optional().or(z.literal('')),
});

export type ProductSchemaInput = z.infer<typeof productSchema>;
export type ProductWithStockSchemaInput = z.infer<typeof productWithStockSchema>;
