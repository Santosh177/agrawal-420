import { handleRoute, ok, HttpError } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { orderService } from "@/backend/services/order.service";
import { objectIdSchema, orderStatusSchema } from "@/shared/lib/validators";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  return handleRoute(async () => {
    await requireAdmin();
    const idResult = objectIdSchema.safeParse((await params).id);
    if (!idResult.success) throw new HttpError("Invalid order id", 400);

    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const { status } = orderStatusSchema.parse(body);
    const order = await orderService.updateStatus(idResult.data, status);
    return ok({ order });
  });
}
