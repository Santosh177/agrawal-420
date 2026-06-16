"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/admin/components/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-masala-100 bg-white p-4 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <Link href="/admin" className="mb-6 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
          N
        </span>
        <span className="font-extrabold text-masala-900">Admin</span>
      </Link>

      <nav className="flex flex-row gap-1 md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              isActive(link.href)
                ? "bg-brand-600 text-white"
                : "text-masala-700 hover:bg-masala-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden pt-6 md:block">
        <Link
          href="/"
          className="mb-2 block text-center text-sm text-masala-700 hover:text-brand-600"
        >
          View store
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
