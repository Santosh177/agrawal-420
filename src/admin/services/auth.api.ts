"use client";

import type { AdminUserDTO } from "@/admin/types";
import type { LoginInput } from "@/shared/lib/validators";

async function parse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message ?? "Request failed");
  }
  return json.data as T;
}

export const authApi = {
  async login(input: LoginInput): Promise<AdminUserDTO> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parse<{ user: AdminUserDTO }>(res);
    return data.user;
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },
};
