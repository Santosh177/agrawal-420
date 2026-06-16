import { handleRoute, ok, HttpError } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { orderService } from "@/backend/services/order.service";
import { objectIdSchema, orderStatusSchema } from "@/shared/lib/validators";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

function validateId(id: string): string {
  const result = objectIdSchema.safeParse(id);
  if (!result.success) throw new HttpError("Invalid order id", 400);
  return result.data;
}

export async function GET(_request: Request, { params }: Params) {
  return handleRoute(async () => {
    await requireAdmin();
    const id = validateId((await params).id);
    const order = await orderService.getById(id);
    return ok({ order });
  });
}

// PUT /api/orders/:id updates the status (general order update in MVP).
export async function PUT(request: Request, { params }: Params) {
  return handleRoute(async () => {
    await requireAdmin();
    const id = validateId((await params).id);
    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const { status } = orderStatusSchema.parse(body);
    const order = await orderService.updateStatus(id, status);
    return ok({ order });
  });
}
