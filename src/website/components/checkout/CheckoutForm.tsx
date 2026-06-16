"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/website/features/cart/store";
import { orderApi } from "@/website/services/order.api";
import { buildOrderMessage, buildWhatsAppUrl } from "@/shared/lib/whatsapp";
import { formatRupees } from "@/shared/lib/format";

interface FormState {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
}

const initial: FormState = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  notes: "",
};

export function CheckoutForm() {
  const { items, clear } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      await orderApi.create({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        notes: form.notes,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          weight: i.weight,
          quantity: i.quantity,
          price: i.price,
        })),
      });

      // Build the WhatsApp message from the cart, then hand off and clear.
      const message = buildOrderMessage(
        items.map((i) => ({
          name: i.name,
          weight: i.weight,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        {
          name: form.customerName,
          phone: form.customerPhone,
          address: form.customerAddress,
          notes: form.notes,
        }
      );

      clear();
      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-semibold text-masala-900">
          Nothing to checkout
        </p>
        <Link href="/products" className="btn-primary mt-4">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="card space-y-4 p-5 lg:col-span-2">
        <div>
          <label className="label" htmlFor="customerName">
            Full name
          </label>
          <input
            id="customerName"
            className="input"
            required
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="customerPhone">
            Phone number
          </label>
          <input
            id="customerPhone"
            className="input"
            required
            inputMode="tel"
            placeholder="e.g. 9876543210"
            value={form.customerPhone}
            onChange={(e) => update("customerPhone", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="customerAddress">
            Delivery address
          </label>
          <textarea
            id="customerAddress"
            className="input min-h-[90px]"
            required
            value={form.customerAddress}
            onChange={(e) => update("customerAddress", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            className="input min-h-[70px]"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-spice-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Placing order..." : "Place order on WhatsApp"}
        </button>
        <p className="text-center text-xs text-masala-700">
          Your order is saved and WhatsApp opens with a prefilled message for
          confirmation and payment link.
        </p>
      </form>

      <div className="card h-fit p-5">
        <h2 className="text-lg font-bold text-masala-900">Your order</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {mounted &&
            items.map((item) => (
              <li
                key={`${item.productId}-${item.weight}`}
                className="flex justify-between gap-2 text-masala-700"
              >
                <span className="min-w-0 truncate">
                  {item.name} ({item.weight}) × {item.quantity}
                </span>
                <span className="font-medium text-masala-900">
                  {formatRupees(item.price * item.quantity)}
                </span>
              </li>
            ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-masala-100 pt-3">
          <span className="font-semibold">Subtotal</span>
          <span className="text-lg font-bold text-brand-600">
            {mounted ? formatRupees(subtotal) : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
