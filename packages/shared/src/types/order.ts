export type OrderStatus = 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  customerName: string | null;
  itemCount: number;
  createdAt: string;
}
