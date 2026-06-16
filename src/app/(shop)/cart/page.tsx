import type { Metadata } from "next";
import { CartView } from "@/website/components/cart/CartView";

export const metadata: Metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-6 text-3xl font-extrabold text-masala-900">
        Your Cart
      </h1>
      <CartView />
    </div>
  );
}
