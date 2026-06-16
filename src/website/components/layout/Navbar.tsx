import Link from "next/link";
import { CartIndicator } from "@/website/components/layout/CartIndicator";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-masala-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
            N
          </span>
          <span className="text-lg font-extrabold tracking-tight text-masala-900">
            Namkeen <span className="text-brand-600">420</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-masala-700 hover:bg-masala-100"
          >
            Products
          </Link>
          <CartIndicator />
          <Link href="/checkout" className="btn-primary hidden sm:inline-flex">
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
