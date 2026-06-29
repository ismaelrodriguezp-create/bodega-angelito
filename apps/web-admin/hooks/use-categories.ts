'use client';

import { useQuery } from '@tanstack/react-query';
import { listCategories, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const supabase = createClient();
      return listCategories(toServiceClient(supabase));
    },
    staleTime: 5 * 60 * 1000,
  });
}
