'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listProductsWithStock, toServiceClient } from '@bodega-angelito/services';
import { createClient } from '@/lib/supabase/client';
import { useWorker } from '@/components/providers/WorkerProvider';

const MOCK_PRODUCTS = [
  { id: '1', sku: 'BEB-COLA-01', name: 'Coca Cola 1.5L', brand: 'Coca Cola', category: 'Bebidas', categoryId: 'cat-1', price: 6.50, cost: 4.20, stock: 45, minStock: 10 },
  { id: '2', sku: 'LAC-GLOR-02', name: 'Leche Gloria Evaporada', brand: 'Gloria', category: 'Lácteos', categoryId: 'cat-2', price: 4.20, cost: 2.80, stock: 4, minStock: 15 },
  { id: '3', sku: 'ABA-ARRO-03', name: 'Arroz Costeño Extra 1kg', brand: 'Costeño', category: 'Abarrotes', categoryId: 'cat-3', price: 4.80, cost: 3.50, stock: 82, minStock: 20 },
  { id: '4', sku: 'ABA-AZUC-04', name: 'Azúcar Rubia Cartavio 1kg', brand: 'Cartavio', category: 'Abarrotes', categoryId: 'cat-3', price: 3.90, cost: 2.70, stock: 120, minStock: 25 },
  { id: '5', sku: 'LIM-LAVA-05', name: 'Sapolio Lejía 2L', brand: 'Sapolio', category: 'Limpieza', categoryId: 'cat-4', price: 8.90, cost: 5.50, stock: 15, minStock: 8 },
  { id: '6', sku: 'PAN-MOLD-06', name: 'Panetón D\'Onofrio 900g', brand: 'D\'Onofrio', category: 'Panadería', categoryId: 'cat-5', price: 19.90, cost: 14.00, stock: 0, minStock: 5 },
  { id: '7', sku: 'BEB-INKA-07', name: 'Inka Cola 3L', brand: 'Inka Cola', category: 'Bebidas', categoryId: 'cat-1', price: 11.50, cost: 8.00, stock: 8, minStock: 10 }
];

export function useProducts() {
  const worker = useWorker();

  return useQuery({
    queryKey: ['products', worker.storeId],
    queryFn: async () => {
      try {
        const supabase = createClient();
        return await listProductsWithStock(toServiceClient(supabase), worker.storeId);
      } catch (err) {
        console.warn('Falla de Supabase, usando datos mockeados para demo:', err);
        return MOCK_PRODUCTS;
      }
    },
  });
}

export function useInvalidateProducts() {
  const worker = useWorker();
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ['products', worker.storeId] });
}
