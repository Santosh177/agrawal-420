import Link from "next/link";
import { orderService } from "@/backend/services/order.service";
import { productService } from "@/backend/services/product.service";
import { StatCard } from "@/admin/components/StatCard";
import { Badge } from "@/shared/components/ui/Badge";
import { formatRupees } from "@/shared/lib/format";
import type { DashboardStats } from "@/shared/types/orders";
import type { ProductDTO } from "@/shared/types/products";

export const dynamic = "force-dynamic";

async function getDashboard(): Promise<{
  stats: DashboardStats;
  lowStock: ProductDTO[];
}> {
  const [stats, productStats] = await Promise.all([
    orderService.dashboard(),
    productService.stats(),
  ]);
  return { stats, lowStock: productStats.lowStock };
}

export default async function AdminDashboardPage() {
  const { stats, lowStock } = await getDashboard();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-masala-900">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary">
          + Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total products" value={stats.totalProducts} />
        <StatCard label="Total orders" value={stats.totalOrders} />
        <StatCard label="New orders" value={stats.newOrders} hint="Awaiting action" />
        <StatCard label="Paid orders" value={stats.paidOrders} />
        <StatCard
          label="Revenue estimate"
          value={formatRupees(stats.revenueEstimate)}
          hint="Paid, packed & delivered"
        />
        <StatCard
          label="Low stock"
          value={stats.lowStockCount}
          hint="≤ 10 units"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-masala-900">
          Low stock products
        </h2>
        {lowStock.length === 0 ? (
          <p className="card p-6 text-masala-700">Everything is well stocked.</p>
        ) : (
          <div className="card divide-y divide-masala-100">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium text-masala-900">{p.name}</p>
                  <p className="text-xs text-masala-700">{p.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={p.stock <= 0 ? "danger" : "warning"}>
                    {p.stock} left
                  </Badge>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="btn-ghost px-2 py-1 text-xs"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
