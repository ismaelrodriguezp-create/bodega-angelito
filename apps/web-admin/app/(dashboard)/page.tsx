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
      {
        label: 'SKUs Activos',
        value: isLoading ? '...' : String(products.length),
        color: '#4f46e5',
        bg: '#f0f0ff',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        label: 'Pedidos Activos',
        value: String(activeOrders),
        color: '#10b981',
        bg: '#ecfdf5',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        label: 'Stock Crítico',
        value: isLoading ? '...' : String(criticalCount),
        color: '#f43f5e',
        bg: '#fff1f2',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      {
        label: 'Valor Inventario',
        value: isLoading ? '...' : formatCurrency(totalValuation),
        color: '#8b5cf6',
        bg: '#f5f3ff',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V5" />
          </svg>
        ),
      },
    ],
    [products.length, activeOrders, criticalCount, totalValuation, isLoading]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-extrabold text-[#0f172a] tracking-tight font-sans">
            Centro de Inteligencia
          </h1>
          <p className="text-[14px] font-medium text-[#64748b]">
            Monitoreo en tiempo real de tu inventario y ventas
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="card-elevated kpi-card p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#64748b] tracking-wide">{kpi.label}</span>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: kpi.bg, color: kpi.color }}
              >
                {kpi.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[26px] md:text-[28px] font-extrabold text-[#0f172a] tracking-tight">
                {kpi.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elevated p-6 bg-white">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#0f172a]">Tendencia de Ventas</h2>
              <p className="text-[12px] font-medium text-[#64748b]">Desempeño diario en los últimos 7 días</p>
            </div>
          </div>
          <SalesOverviewChart />
        </div>
        <div className="card-elevated p-6 bg-white">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#0f172a]">Por Categoría</h2>
              <p className="text-[12px] font-medium text-[#64748b]">Distribución de inventario</p>
            </div>
          </div>
          <SalesByCategoryChart />
        </div>
      </div>

      {/* Lists and Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6 bg-white">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
            <div>
              <h2 className="text-[17px] font-bold text-[#0f172a]">Top Productos</h2>
              <p className="text-[12px] font-medium text-[#64748b]">Artículos con mayor demanda</p>
            </div>
          </div>
          <TopProductsChart />
        </div>
        <div className="card-elevated p-6 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[#0f172a] border-b border-[#f1f5f9] pb-4 mb-6">
              Accesos Rápidos
            </h2>
            <div className="space-y-4">
              <Link
                href="/productos"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#eeebff] text-[#4f46e5] hover:bg-[#e0dbff] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-bold">Gestionar Productos</span>
                </div>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/pedidos"
                className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-bold">Ver Pedidos de Tienda</span>
                </div>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
          <div className="text-[12px] font-medium text-[#94a3b8] mt-6 text-center">
            Sistema Bodega Angelito v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
