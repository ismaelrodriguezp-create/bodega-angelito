'use client';

import { useQuery } from '@tanstack/react-query';
import { listCategories, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';

// UUIDs válidos para las categorías mock (compatibles con validación Zod uuid)
const MOCK_CATEGORIES = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Bebidas', slug: 'bebidas' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Lácteos', slug: 'lacteos' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Abarrotes', slug: 'abarrotes' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Limpieza', slug: 'limpieza' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'Panadería', slug: 'panaderia' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Snacks', slug: 'snacks' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Higiene Personal', slug: 'higiene' },
];

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const supabase = createClient();
        const result = await listCategories(toServiceClient(supabase));
        if (result && result.length > 0) return result;
        return MOCK_CATEGORIES;
      } catch (err) {
        console.warn('Usando categorías de demostración:', err);
        return MOCK_CATEGORIES;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
