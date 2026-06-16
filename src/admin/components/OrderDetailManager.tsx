"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderDTO } from "@/shared/types/orders";
import { orderApi } from "@/website/services/order.api";
import { ORDER_STATUSES, type OrderStatus } from "@/shared/lib/validators";
import { formatRupees, formatDate } from "@/shared/lib/format";
import { buildPaymentMessage, buildWhatsAppUrl } from "@/shared/lib/whatsapp";
import { OrderStatusBadge } from "@/shared/components/ui/OrderStatusBadge";

export function OrderDetailManager({ order: initial }: { order: OrderDTO }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [status, setStatus] = useState<OrderStatus>(initial.status);
  const [paymentLink, setPaymentLink] = useState(initial.paymentLink ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  }

  async function saveStatus() {
    setBusy(true);
    try {
      const updated = await orderApi.updateStatus(order.id, status);
      setOrder(updated);
      notify("Status updated");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePaymentLink() {
    setBusy(true);
    try {
      const updated = await orderApi.setPaymentLink(order.id, paymentLink);
      setOrder(updated);
      setStatus(updated.status);
      notify("Payment link saved");
      router.refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save link");
    } finally {
      setBusy(false);
    }
  }

  const paymentMessage = buildPaymentMessage(
    order.customerName,
    order.subtotal,
    order.paymentLink || paymentLink || "<paste payment link>"
  );

  async function copyPaymentMessage() {
    try {
      await navigator.clipboard.writeText(paymentMessage);
      notify("Payment message copied");
    } catch {
      notify("Copy failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-masala-900">
                Order #{order.id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-sm text-masala-700">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-masala-700">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Weight</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-masala-100">
                {order.items.map((item, idx) => (
                  <tr key={`${item.productId}-${idx}`}>
                    <td className="py-2 font-medium text-masala-900">
                      {item.name}
                    </td>
                    <td className="py-2 text-masala-700">{item.weight}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatRupees(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end border-t border-masala-100 pt-3">
            <span className="text-lg font-bold text-brand-600">
              Subtotal: {formatRupees(order.subtotal)}
            </span>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-masala-900">Customer</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 text-masala-700">Name</dt>
              <dd className="font-medium text-masala-900">
                {order.customerName}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-masala-700">Phone</dt>
              <dd className="font-medium text-masala-900">
                {order.customerPhone}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-masala-700">Address</dt>
              <dd className="font-medium text-masala-900">
                {order.customerAddress}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 text-masala-700">Notes</dt>
              <dd className="text-masala-900">{order.notes || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        {message && (
          <div className="rounded-lg bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
            {message}
          </div>
        )}

        <div className="card p-5">
          <h3 className="font-bold text-masala-900">Update status</h3>
          <select
            className="input mt-3"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={saveStatus}
            disabled={busy}
            className="btn-primary mt-3 w-full"
          >
            Save status
          </button>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-masala-900">Payment link</h3>
          <input
            className="input mt-3"
            placeholder="https://..."
            value={paymentLink}
            onChange={(e) => setPaymentLink(e.target.value)}
          />
          <button
            type="button"
            onClick={savePaymentLink}
            disabled={busy || !paymentLink}
            className="btn-primary mt-3 w-full"
          >
            Save payment link
          </button>

          <div className="mt-4 border-t border-masala-100 pt-4">
            <p className="text-xs text-masala-700">WhatsApp payment message</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-masala-50 p-3 text-xs text-masala-900">
              {paymentMessage}
            </pre>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copyPaymentMessage}
                className="btn-secondary flex-1"
              >
                Copy message
              </button>
              <a
                href={buildWhatsAppUrl(paymentMessage, order.customerPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1"
              >
                Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
