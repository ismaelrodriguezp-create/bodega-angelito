import { z } from 'zod';

export const orderItemSchema = z.object({
  product_id: z.string().uuid({ message: 'ID de producto no válido' }),
  quantity: z.coerce.number().int().min(1, { message: 'La cantidad debe ser al menos 1' }),
});

export const orderSchema = z.object({
  store_id: z.string().uuid({ message: 'ID de tienda no válido' }),
  customer_id: z.string().uuid().nullable().optional(),
  delivery_address: z.string().trim().min(5, { message: 'La dirección debe tener al menos 5 caracteres' }).nullable().optional(),
  delivery_lat: z.number().nullable().optional(),
  delivery_lng: z.number().nullable().optional(),
  items: z.array(orderItemSchema).min(1, { message: 'El pedido debe contener al menos un producto' }),
});

export type OrderSchemaInput = z.infer<typeof orderSchema>;
export type OrderItemSchemaInput = z.infer<typeof orderItemSchema>;
