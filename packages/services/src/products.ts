import type { ServiceClient } from './client';
import type { Database } from '@bodega-angelito/db';
import type { ProductWithStockSchemaInput } from '@bodega-angelito/shared';
import type { ProductWithStock } from '@bodega-angelito/shared';

type StockLevelRow = {
  current_stock: number;
  minimum_stock: number;
  products: {
    id: string;
    sku: string | null;
    name: string;
    brand: string | null;
    price: number;
    cost: number;
    category_id: string | null;
    categories: { name: string } | null;
  } | null;
};

export async function listProductsWithStock(
  client: ServiceClient,
  storeId: string
): Promise<ProductWithStock[]> {
  const { data, error } = await client
    .from('stock_levels')
    .select(`
      current_stock,
      minimum_stock,
      products (
        id,
        sku,
        name,
        brand,
        price,
        cost,
        category_id,
        categories ( name )
      )
    `)
    .eq('store_id', storeId);

  if (error) throw error;

  return (data as StockLevelRow[])
    .filter((row) => row.products !== null)
    .map((row) => ({
      id: row.products!.id,
      sku: row.products!.sku ?? '',
      name: row.products!.name,
      brand: row.products!.brand ?? '',
      category: row.products!.categories?.name ?? 'Sin categoría',
      categoryId: row.products!.category_id,
      price: Number(row.products!.price),
      cost: Number(row.products!.cost),
      stock: row.current_stock,
      minStock: row.minimum_stock,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function createProductWithStock(
  client: ServiceClient,
  storeId: string,
  input: ProductWithStockSchemaInput & { sku: string }
): Promise<string> {
  const { data, error } = await client.rpc('create_product_with_stock', {
    p_store_id: storeId,
    p_name: input.name,
    p_brand: input.brand || null,
    p_sku: input.sku,
    p_barcode: input.barcode || null,
    p_description: input.description || null,
    p_category_id: input.category_id ?? null,
    p_price: input.price,
    p_cost: input.cost,
    p_initial_stock: input.initial_stock ?? 0,
    p_minimum_stock: input.minimum_stock ?? 5,
    p_safety_stock: input.safety_stock ?? 2,
    p_location_in_store: input.location_in_store || null,
  } as Database['public']['Functions']['create_product_with_stock']['Args']);

  if (error) throw error;
  if (!data) throw new Error('No se recibió el ID del producto creado');

  return data as string;
}

export function countCriticalStock(products: ProductWithStock[]): number {
  return products.filter((p) => p.stock <= p.minStock).length;
}

export function calculateInventoryValue(products: ProductWithStock[]): number {
  return products.reduce((sum, p) => sum + p.price * p.stock, 0);
}
