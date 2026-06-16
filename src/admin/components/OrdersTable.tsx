import Link from "next/link";
import type { OrderDTO } from "@/shared/types/orders";
import { formatRupees, formatDate } from "@/shared/lib/format";
import { OrderStatusBadge } from "@/shared/components/ui/OrderStatusBadge";

export function OrdersTable({ orders }: { orders: OrderDTO[] }) {
  if (orders.length === 0) {
    return (
      <p className="card p-8 text-center text-masala-700">
        No orders match these filters.
      </p>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-masala-100 bg-masala-50 text-xs uppercase tracking-wide text-masala-700">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Subtotal</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-masala-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-masala-50">
              <td className="px-4 py-3 text-masala-700">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 font-medium text-masala-900">
                {order.customerName}
              </td>
              <td className="px-4 py-3 text-masala-700">{order.customerPhone}</td>
              <td className="px-4 py-3 text-masala-700">
                {order.items.reduce((n, i) => n + i.quantity, 0)}
              </td>
              <td className="px-4 py-3 font-medium">
                {formatRupees(order.subtotal)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="btn-ghost px-2 py-1 text-xs"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
