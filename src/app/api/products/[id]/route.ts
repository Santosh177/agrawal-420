import { handleRoute, ok, HttpError } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { productService } from "@/backend/services/product.service";
import { objectIdSchema } from "@/shared/lib/validators";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

function validateId(id: string): string {
  const result = objectIdSchema.safeParse(id);
  if (!result.success) throw new HttpError("Invalid product id", 400);
  return result.data;
}

export async function GET(_request: Request, { params }: Params) {
  return handleRoute(async () => {
    const id = validateId((await params).id);
    const product = await productService.getById(id);
    return ok({ product });
  });
}

export async function PUT(request: Request, { params }: Params) {
  return handleRoute(async () => {
    await requireAdmin();
    const id = validateId((await params).id);
    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const product = await productService.update(id, body);
    return ok({ product });
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  return handleRoute(async () => {
    await requireAdmin();
    const id = validateId((await params).id);
    await productService.remove(id);
    return ok({ deleted: true });
  });
}
