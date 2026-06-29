'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listProductsWithStock, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';
import { useWorker } from '@/components/providers/WorkerProvider';

export function useProducts() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['products', worker.storeId],
    queryFn: async () => {
      const supabase = createClient();
      return listProductsWithStock(toServiceClient(supabase), worker.storeId);
    },
  });
}

export function useInvalidateProducts() {
  const worker = useWorker();
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ['products', worker.storeId] });
}
