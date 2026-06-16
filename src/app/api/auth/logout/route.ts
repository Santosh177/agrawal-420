import { handleRoute, ok } from "@/shared/lib/api-response";
import { clearAuthCookie } from "@/shared/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  return handleRoute(async () => {
    await clearAuthCookie();
    return ok({ loggedOut: true });
  });
}
