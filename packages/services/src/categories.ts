import type { ServiceClient } from './client';
import type { Category } from '@bodega-angelito/shared';

export async function listCategories(client: ServiceClient): Promise<Category[]> {
  const { data, error } = await client
    .from('categories')
    .select('id, name, slug')
    .order('name');

  if (error) throw error;
  return data ?? [];
}
