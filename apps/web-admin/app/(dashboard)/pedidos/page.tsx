'use client';

import { formatCurrency, formatDate } from '@bodega-angelito/shared';
import { useOrders } from '@/hooks/use-orders';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#fef7e0] text-[#b06000]',
  preparing: 'bg-[#e8f0fe] text-[#1a73e8]',
  shipped: 'bg-[#f3e8fd] text-[#8430ce]',
  delivered: 'bg-[#e6f4ea] text-[#1e8e3e]',
  cancelled: 'bg-[#fce8e6] text-[#d93025]',
};

export default function PedidosPage() {
  const { data: orders = [], isLoading, isError, error } = useOrders();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1f1f1f]">Pedidos</h1>
        <p className="text-[14px] text-[#5f6368] mt-1">
          {isLoading ? 'Cargando...' : `${orders.length} pedidos en total`}
        </p>
      </div>

      {isError && (
        <div className="bg-[#fce8e6] text-[#c5221f] text-[14px] px-5 py-4 rounded-2xl">
          {error instanceof Error ? error.message : 'Error al cargar pedidos'}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16 text-[#5f6368]">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-[#5f6368]">
            <p className="text-[16px] font-medium">No hay pedidos aún</p>
            <p className="text-[13px] mt-1">Los pedidos de la tienda online aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#f1f3f4]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Pedido</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Cliente</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Estado</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase text-right">Total</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa]">
                    <td className="px-5 py-3.5">
                      <div className="text-[13px] font-mono text-[#1f1f1f]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-[12px] text-[#5f6368]">{order.itemCount} productos</div>
                    </td>
                    <td className="px-5 py-3.5 text-[14px]">
                      {order.customerName ?? 'Invitado'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[14px]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#5f6368]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
