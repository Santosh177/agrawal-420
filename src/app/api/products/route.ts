import { handleRoute, ok, created, HttpError } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { productService } from "@/backend/services/product.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      // Admin listing (all products including inactive) requires auth.
      await requireAdmin();
      const products = await productService.list();
      return ok({ products });
    }

    const products = await productService.listPublic();
    return ok({ products });
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const product = await productService.create(body);
    return created({ product });
  });
}
