"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/website/features/cart/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  removeItem: (productId: string, weight: string) => void;
  clear: () => void;
  subtotal: () => number;
  totalCount: () => number;
}

function lineKey(productId: string, weight: string): string {
  return `${productId}__${weight}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = lineKey(item.productId, item.weight);
          const existing = state.items.find(
            (i) => lineKey(i.productId, i.weight) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.weight) === key
                  ? {
                      ...i,
                      quantity: Math.min(
                        i.quantity + item.quantity,
                        i.maxStock || Infinity
                      ),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateQuantity: (productId, weight, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.productId, i.weight) === lineKey(productId, weight)
                ? { ...i, quantity: Math.max(1, quantity) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      removeItem: (productId, weight) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.productId, i.weight) !== lineKey(productId, weight)
          ),
        })),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "namkeen420-cart",
    }
  )
);
