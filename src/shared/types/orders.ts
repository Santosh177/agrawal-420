import type { OrderStatus } from "@/shared/lib/validators";

export interface OrderItemDTO {
  productId: string;
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  items: OrderItemDTO[];
  subtotal: number;
  status: OrderStatus;
  paymentLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  newOrders: number;
  paidOrders: number;
  revenueEstimate: number;
  lowStockCount: number;
}
