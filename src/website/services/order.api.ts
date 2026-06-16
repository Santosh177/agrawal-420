"use client";

import type { OrderDTO } from "@/shared/types/orders";
import type { OrderInput, OrderStatus } from "@/shared/lib/validators";

async function parse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export const orderApi = {
  async create(input: OrderInput): Promise<OrderDTO> {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parse<{ order: OrderDTO }>(res);
    return data.order;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await parse<{ order: OrderDTO }>(res);
    return data.order;
  },

  async setPaymentLink(id: string, paymentLink: string): Promise<OrderDTO> {
    const res = await fetch(`/api/orders/${id}/payment-link`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentLink }),
    });
    const data = await parse<{ order: OrderDTO }>(res);
    return data.order;
  },
};
