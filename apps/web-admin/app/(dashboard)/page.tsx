'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@bodega-angelito/shared';
import { calculateInventoryValue, countCriticalStock } from '@bodega-angelito/services';
import { SalesOverviewChart } from '@/components/dashboard/SalesOverviewChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { SalesByCategoryChart } from '@/components/dashboard/SalesByCategoryChart';
import { useProducts } from '@/hooks/use-products';
import { useActiveOrderCount } from '@/hooks/use-orders';

export default function DashboardPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: activeOrders = 0 } = useActiveOrderCount();

  const criticalCount = countCriticalStock(products);
  const totalValuation = calculateInventoryValue(products);

  const kpis = useMemo(
    () => [
      { label: 'SKUs Activos', value: isLoading ? '...' : String(products.length), color: '#1a73e8', bg: '#e8f0fe' },
      { label: 'Pedidos Activos', value: String(activeOrders), color: '#1e8e3e', bg: '#e6f4ea' },
      { label: 'Stock Crítico', value: isLoading ? '...' : String(criticalCount), color: '#d93025', bg: '#fce8e6' },
      { label: 'Valor Inventario', value: isLoading ? '...' : formatCurrency(totalValuation), color: '#8430ce', bg: '#f3e8fd' },
    ],
    [products.length, activeOrders, criticalCount, totalValuation, isLoading]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-[24px] md:text-[30px] font-bold text-[#1f1f1f]">Centro de Inteligencia</h1>
        <p className="text-[14px] text-[#5f6368] mt-1">Resumen en tiempo real de tu bodega</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-6 border border-[#e8eaed] shadow-sm">
            <div className="text-[24px] font-bold text-[#1f1f1f] truncate">{kpi.value}</div>
            <div className="text-[13px] font-medium text-[#5f6368] mt-2">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dadce0] shadow-sm p-6">
          <h2 className="text-[16px] font-semibold mb-1">Tendencia de Ventas</h2>
          <p className="text-[13px] text-[#5f6368] mb-2">Últimos 7 días (demo)</p>
          <SalesOverviewChart />
        </div>
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-6">
          <h2 className="text-[16px] font-semibold mb-1">Por Categoría</h2>
          <p className="text-[13px] text-[#5f6368] mb-2">Distribución (demo)</p>
          <SalesByCategoryChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-6">
          <h2 className="text-[16px] font-semibold mb-2">Top Productos</h2>
          <TopProductsChart />
        </div>
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-6 flex flex-col justify-center gap-4">
          <h2 className="text-[16px] font-semibold">Acciones rápidas</h2>
          <Link href="/productos" className="text-[#1a73e8] text-[14px] font-medium hover:underline">
            Gestionar productos →
          </Link>
          <Link href="/pedidos" className="text-[#1e8e3e] text-[14px] font-medium hover:underline">
            Ver pedidos →
          </Link>
        </div>
      </div>
    </div>
  );
}
