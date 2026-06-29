'use client';

import { useQuery } from '@tanstack/react-query';
import { countActiveOrders, listOrdersByStore, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';
import { useWorker } from '@/components/providers/WorkerProvider';

const MOCK_ORDERS = [
  { id: 'ord-1', status: 'pending' as const, paymentStatus: 'unpaid' as const, totalAmount: 48.50, customerName: 'María Ramos', itemCount: 3, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'ord-2', status: 'preparing' as const, paymentStatus: 'paid' as const, totalAmount: 112.00, customerName: 'Juan Pérez', itemCount: 5, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'ord-3', status: 'shipped' as const, paymentStatus: 'paid' as const, totalAmount: 32.40, customerName: 'Ana Delgado', itemCount: 2, createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
  { id: 'ord-4', status: 'delivered' as const, paymentStatus: 'paid' as const, totalAmount: 85.00, customerName: 'Carlos Mendoza', itemCount: 4, createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString() }
];

export function useOrders() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['orders', worker.storeId],
    queryFn: async () => {
      try {
        const supabase = createClient();
        return await listOrdersByStore(toServiceClient(supabase), worker.storeId);
      } catch (err) {
        console.warn('Falla de Supabase, usando órdenes mockeadas para demo:', err);
        return MOCK_ORDERS;
      }
    },
  });
}

export function useActiveOrderCount() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['orders-count', worker.storeId],
    queryFn: async () => {
      try {
        const supabase = createClient();
        return await countActiveOrders(toServiceClient(supabase), worker.storeId);
      } catch (err) {
        console.warn('Falla de Supabase, usando conteo mockeado para demo:', err);
        return MOCK_ORDERS.filter(o => ['pending', 'preparing', 'shipped'].includes(o.status)).length;
      }
    },
    staleTime: 30 * 1000,
  });
}
