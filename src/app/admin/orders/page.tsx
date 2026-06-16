import { Suspense } from "react";
import { orderService } from "@/backend/services/order.service";
import { OrderFilters } from "@/admin/components/OrderFilters";
import { OrdersTable } from "@/admin/components/OrdersTable";
import { ORDER_STATUSES, type OrderStatus } from "@/shared/lib/validators";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  phone?: string;
  from?: string;
  to?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status: statusParam, phone, from, to } = await searchParams;
  const status =
    statusParam && (ORDER_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as OrderStatus)
      : undefined;

  const orders = await orderService.list({
    status,
    phone: phone || undefined,
    fromDate: from ? new Date(from) : undefined,
    toDate: to ? new Date(`${to}T23:59:59.999Z`) : undefined,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-masala-900">Orders</h1>
        <p className="text-sm text-masala-700">{orders.length} shown</p>
      </div>
      <Suspense fallback={null}>
        <OrderFilters />
      </Suspense>
      <OrdersTable orders={orders} />
    </div>
  );
}
