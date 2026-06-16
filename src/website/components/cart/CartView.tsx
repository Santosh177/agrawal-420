"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/website/features/cart/store";
import { formatRupees } from "@/shared/lib/format";

export function CartView() {
  const { items, updateQuantity, removeItem, clear } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <p className="text-masala-700">Loading cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold text-masala-900">
          Your cart is empty
        </p>
        <p className="mt-1 text-masala-700">
          Add some crunchy namkeen to get started.
        </p>
        <Link href="/products" className="btn-primary mt-5">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.weight}`}
            className="card flex items-center gap-4 p-3"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-masala-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-masala-900">
                {item.name}
              </p>
              <p className="text-sm text-masala-700">
                {item.weight} · {formatRupees(item.price)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.weight)}
                className="mt-1 text-xs font-medium text-spice-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn-secondary h-8 w-8 p-0"
                onClick={() =>
                  updateQuantity(
                    item.productId,
                    item.weight,
                    item.quantity - 1
                  )
                }
              >
                -
              </button>
              <span className="w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                type="button"
                className="btn-secondary h-8 w-8 p-0"
                onClick={() =>
                  updateQuantity(
                    item.productId,
                    item.weight,
                    item.quantity + 1
                  )
                }
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold text-masala-900">
              {formatRupees(item.price * item.quantity)}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={clear}
          className="btn-ghost text-spice-600"
        >
          Clear cart
        </button>
      </div>

      <div className="card h-fit p-5">
        <h2 className="text-lg font-bold text-masala-900">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-masala-700">
          <span>Subtotal</span>
          <span className="text-lg font-bold text-masala-900">
            {formatRupees(subtotal)}
          </span>
        </div>
        <p className="mt-2 text-xs text-masala-700">
          Final amount confirmed by our team on WhatsApp.
        </p>
        <Link href="/checkout" className="btn-primary mt-5 w-full">
          Proceed to checkout
        </Link>
        <Link href="/products" className="btn-secondary mt-2 w-full">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
