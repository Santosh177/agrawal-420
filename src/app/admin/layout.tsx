import { getSession } from "@/shared/lib/auth";
import { AdminSidebar } from "@/admin/components/AdminSidebar";

// Admin must always reflect fresh, protected data.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Unauthenticated requests only ever reach /admin/login (middleware guards
  // the rest), so render the bare shell for the login screen.
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-masala-50 p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-masala-50 md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
