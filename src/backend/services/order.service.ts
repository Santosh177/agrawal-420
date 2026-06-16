import { orderRepository, type OrderFilter } from "@/backend/repositories/order.repository";
import { productRepository } from "@/backend/repositories/product.repository";
import type { OrderDocument } from "@/backend/models/Order";
import type { OrderDTO, DashboardStats } from "@/shared/types/orders";
import {
  orderInputSchema,
  type OrderInput,
  type OrderStatus,
} from "@/shared/lib/validators";
import { HttpError } from "@/shared/lib/api-response";
import { productService } from "@/backend/services/product.service";

const REVENUE_STATUSES: OrderStatus[] = ["Paid", "Packed", "Delivered"];

function toDTO(doc: OrderDocument): OrderDTO {
  return {
    id: String(doc._id),
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    customerAddress: doc.customerAddress,
    notes: doc.notes ?? "",
    items: doc.items.map((item) => ({
      productId: String(item.productId),
      name: item.name,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: doc.subtotal,
    status: doc.status,
    paymentLink: doc.paymentLink,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export const orderService = {
  async create(input: OrderInput): Promise<OrderDTO> {
    const data = orderInputSchema.parse(input);

    // Re-price each item against the DB so the trusted price/name is stored,
    // never the value sent by the client.
    const repriced = await Promise.all(
      data.items.map(async (item) => {
        const product = await productRepository.findById(item.productId);
        if (!product || !product.isActive) {
          throw new HttpError(`Product unavailable: ${item.name}`, 400);
        }
        return {
          productId: product._id,
          name: product.name,
          weight: item.weight,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const subtotal = repriced.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const doc = await orderRepository.create({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      notes: data.notes,
      items: repriced,
      subtotal,
      status: "New",
    });

    return toDTO(doc);
  },

  async list(filter: OrderFilter = {}): Promise<OrderDTO[]> {
    const docs = await orderRepository.findMany(filter);
    return docs.map(toDTO);
  },

  async getById(id: string): Promise<OrderDTO> {
    const doc = await orderRepository.findById(id);
    if (!doc) throw new HttpError("Order not found", 404);
    return toDTO(doc);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
    const doc = await orderRepository.update(id, { status });
    if (!doc) throw new HttpError("Order not found", 404);
    return toDTO(doc);
  },

  async setPaymentLink(id: string, paymentLink: string): Promise<OrderDTO> {
    // Attaching a payment link advances a brand-new order to "Payment Link Sent".
    const existing = await orderRepository.findById(id);
    if (!existing) throw new HttpError("Order not found", 404);

    const nextStatus: OrderStatus =
      existing.status === "New" || existing.status === "Confirmed"
        ? "Payment Link Sent"
        : existing.status;

    const doc = await orderRepository.update(id, {
      paymentLink,
      status: nextStatus,
    });
    if (!doc) throw new HttpError("Order not found", 404);
    return toDTO(doc);
  },

  async dashboard(): Promise<DashboardStats> {
    const [
      productStats,
      totalOrders,
      newOrders,
      paidOrders,
      revenueEstimate,
    ] = await Promise.all([
      productService.stats(),
      orderRepository.count(),
      orderRepository.count({ status: "New" }),
      orderRepository.count({ status: "Paid" }),
      orderRepository.sumRevenue(REVENUE_STATUSES),
    ]);

    return {
      totalProducts: productStats.total,
      totalOrders,
      newOrders,
      paidOrders,
      revenueEstimate,
      lowStockCount: productStats.lowStock.length,
    };
  },
};
