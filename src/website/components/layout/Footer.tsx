import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-masala-100 bg-white">
      <div className="container-page flex flex-col items-start justify-between gap-4 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-extrabold text-masala-900">
            Namkeen <span className="text-brand-600">420</span>
          </p>
          <p className="mt-1 text-sm text-masala-700">
            Freshly made Indian namkeen, delivered with love.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-masala-700">
          <Link href="/products" className="hover:text-brand-600">
            Products
          </Link>
          <Link href="/cart" className="hover:text-brand-600">
            Cart
          </Link>
          <Link href="/admin" className="hover:text-brand-600">
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-masala-100 py-4 text-center text-xs text-masala-700">
        © {new Date().getFullYear()} Namkeen 420. All rights reserved.
      </div>
    </footer>
  );
}
