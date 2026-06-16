import { handleRoute, ok, HttpError } from "@/shared/lib/api-response";
import { setAuthCookie } from "@/shared/lib/auth";
import { authService } from "@/backend/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const body = await request.json().catch(() => {
      throw new HttpError("Invalid JSON body", 400);
    });
    const { token, user } = await authService.login(body);
    await setAuthCookie(token);
    return ok({ user });
  });
}
