import { handleRoute, ok } from "@/shared/lib/api-response";
import { requireAdmin } from "@/shared/lib/auth";
import { authService } from "@/backend/services/auth.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireAdmin();
    const user = await authService.getCurrentUser(session.sub);
    return ok({ user });
  });
}
