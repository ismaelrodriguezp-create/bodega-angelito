'use client';

import { useQuery } from '@tanstack/react-query';
import { countActiveOrders, listOrdersByStore, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';
import { useWorker } from '@/components/providers/WorkerProvider';

export function useOrders() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['orders', worker.storeId],
    queryFn: async () => {
      const supabase = createClient();
      return listOrdersByStore(toServiceClient(supabase), worker.storeId);
    },
  });
}

export function useActiveOrderCount() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['orders-count', worker.storeId],
    queryFn: async () => {
      const supabase = createClient();
      return countActiveOrders(toServiceClient(supabase), worker.storeId);
    },
    staleTime: 30 * 1000,
  });
}
