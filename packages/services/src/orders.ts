import type { ServiceClient } from './client';
import type { OrderSummary } from '@bodega-angelito/shared';

type OrderRow = {
  id: string;
  status: OrderSummary['status'];
  payment_status: OrderSummary['paymentStatus'];
  total_amount: number;
  created_at: string;
  customers: { first_name: string; last_name: string } | null;
  order_items: { id: string }[];
};

export async function listOrdersByStore(
  client: ServiceClient,
  storeId: string
): Promise<OrderSummary[]> {
  const { data, error } = await client
    .from('orders')
    .select(`
      id,
      status,
      payment_status,
      total_amount,
      created_at,
      customers ( first_name, last_name ),
      order_items ( id )
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data as OrderRow[]) ?? []).map((order) => ({
    id: order.id,
    status: order.status,
    paymentStatus: order.payment_status,
    totalAmount: Number(order.total_amount),
    customerName: order.customers
      ? `${order.customers.first_name} ${order.customers.last_name}`.trim()
      : null,
    itemCount: order.order_items?.length ?? 0,
    createdAt: order.created_at,
  }));
}

export async function countActiveOrders(
  client: ServiceClient,
  storeId: string
): Promise<number> {
  const { count, error } = await client
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId)
    .in('status', ['pending', 'preparing', 'shipped']);

  if (error) throw error;
  return count ?? 0;
}
