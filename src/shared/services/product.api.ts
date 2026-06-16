"use client";

import type { ProductDTO } from "@/shared/types/products";
import type { ProductInput, ProductUpdateInput } from "@/shared/lib/validators";

async function parse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export const productApi = {
  async create(input: ProductInput): Promise<ProductDTO> {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parse<{ product: ProductDTO }>(res);
    return data.product;
  },

  async update(id: string, input: ProductUpdateInput): Promise<ProductDTO> {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parse<{ product: ProductDTO }>(res);
    return data.product;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    await parse<{ deleted: boolean }>(res);
  },
};
