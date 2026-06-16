import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/admin/components/LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
