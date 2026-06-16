import { handleRoute, ok, created, HttpError } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { orderService } from "@/backend/services/order.service";
import { ORDER_STATUSES, type OrderStatus } from "@/shared/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleRoute(async () => {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status");
    const status =
      statusParam && (ORDER_STATUSES as readonly string[]).includes(statusParam)
        ? (statusParam as OrderStatus)
        : undefined;

    const phone = searchParams.get("phone") || undefined;
    const fromRaw = searchParams.get("from");
    const toRaw = searchParams.get("to");

    const orders = await orderService.list({
      status,
      phone,
      fromDate: fromRaw ? new Date(fromRaw) : undefined,
      toDate: toRaw ? new Date(`${toRaw}T23:59:59.999Z`) : undefined,
    });
    return ok({ orders });
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const order = await orderService.create(body);
    return created({ order });
  });
}
