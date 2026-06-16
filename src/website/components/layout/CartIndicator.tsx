"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/website/features/cart/store";

export function CartIndicator() {
  const count = useCartStore((s) => s.totalCount());
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: localStorage count is only known on the client.
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-masala-900 hover:bg-masala-100"
    >
      Cart
      {mounted && count > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
