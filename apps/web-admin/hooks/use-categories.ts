'use client';

import { useQuery } from '@tanstack/react-query';
import { listCategories, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Bebidas', slug: 'bebidas' },
  { id: 'cat-2', name: 'Lácteos', slug: 'lacteos' },
  { id: 'cat-3', name: 'Abarrotes', slug: 'abarrotes' },
  { id: 'cat-4', name: 'Limpieza', slug: 'limpieza' },
  { id: 'cat-5', name: 'Panadería', slug: 'panaderia' }
];

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const supabase = createClient();
        return await listCategories(toServiceClient(supabase));
      } catch (err) {
        console.warn('Falla de Supabase, usando categorías mockeadas para demo:', err);
        return MOCK_CATEGORIES;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
