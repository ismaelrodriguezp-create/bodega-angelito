'use server';

import { generateSKU, productWithStockSchema, type ProductWithStockSchemaInput } from '@bodega-angelito/shared';
import { createProductWithStock, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/server';
import { getSessionWorker } from './auth';

export type CreateProductResult =
  | { success: true; productId: string }
  | { success: false; error: string };

export async function createProduct(
  input: ProductWithStockSchemaInput
): Promise<CreateProductResult> {
  const worker = await getSessionWorker();
  if (!worker || !['admin', 'manager'].includes(worker.role)) {
    return { success: false, error: 'No tienes permisos para registrar productos' };
  }

  const parsed = productWithStockSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos inválidos' };
  }

  const data = parsed.data;

  try {
    const supabase = await createClient();

    let categoryName = 'GEN';
    if (data.category_id) {
      const { data: category } = await supabase
        .from('categories')
        .select('name')
        .eq('id', data.category_id)
        .single<{ name: string }>();
      if (category?.name) categoryName = category.name;
    }

    const sku =
      data.sku && data.sku.trim() !== ''
        ? data.sku.trim()
        : generateSKU(data.name, categoryName);

    const productId = await createProductWithStock(toServiceClient(supabase), worker.storeId, {
      ...data,
      sku,
    });

    return { success: true, productId };
  } catch (err: any) {
    console.error('Error al registrar producto en Supabase:', err);
    return { 
      success: false, 
      error: `Error al guardar en base de datos: ${err.message || 'Error de conexión con Supabase'}` 
    };
  }
}
