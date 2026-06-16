"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authApi } from "@/admin/services/auth.api";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await authApi.logout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="btn-secondary w-full"
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
