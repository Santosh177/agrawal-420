import type { Metadata } from "next";
import { CheckoutForm } from "@/website/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-10">
      <h1 className="mb-2 text-3xl font-extrabold text-masala-900">Checkout</h1>
      <p className="mb-6 text-masala-700">
        Enter your details to place the order on WhatsApp.
      </p>
      <CheckoutForm />
    </div>
  );
}
