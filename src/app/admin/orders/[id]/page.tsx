import Link from "next/link";
import { notFound } from "next/navigation";
import { orderService } from "@/backend/services/order.service";
import { OrderDetailManager } from "@/admin/components/OrderDetailManager";
import { objectIdSchema } from "@/shared/lib/validators";
import { HttpError } from "@/shared/lib/api-response";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!objectIdSchema.safeParse(id).success) notFound();

  try {
    const order = await orderService.getById(id);
    return (
      <div>
        <Link
          href="/admin/orders"
          className="mb-4 inline-block text-sm font-semibold text-brand-600"
        >
          ← Back to orders
        </Link>
        <OrderDetailManager order={order} />
      </div>
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }
}
