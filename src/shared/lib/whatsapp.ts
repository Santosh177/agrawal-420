import { publicEnv } from "@/shared/lib/env";

export interface WhatsAppOrderItem {
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

export interface WhatsAppCustomer {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Builds the customer order message sent from the checkout page. */
export function buildOrderMessage(
  items: WhatsAppOrderItem[],
  subtotal: number,
  customer: WhatsAppCustomer
): string {
  const itemLines = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} - ${item.weight} - Qty ${item.quantity} - ${formatRupees(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  return [
    "Hello Namkeen 420, I want to order:",
    "",
    "Order Items:",
    itemLines,
    "",
    `Subtotal: ${formatRupees(subtotal)}`,
    "",
    "Customer Details:",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    `Notes: ${customer.notes ?? ""}`,
    "",
    "Please confirm availability and send payment link.",
  ].join("\n");
}

/** Builds the payment-link message the admin sends back to a customer. */
export function buildPaymentMessage(
  customerName: string,
  subtotal: number,
  paymentLink: string
): string {
  return [
    `Hello ${customerName}, thank you for ordering from Namkeen 420.`,
    "",
    `Order total: ${formatRupees(subtotal)}`,
    `Payment link: ${paymentLink}`,
    "",
    "Please complete the payment to confirm your order.",
  ].join("\n");
}

/** Sanitize a phone number to digits only for wa.me. */
function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Builds a wa.me deep link. When `to` is omitted, the business number from env
 * is used (customer -> business). Pass a customer number for business -> customer.
 */
export function buildWhatsAppUrl(message: string, to?: string): string {
  const number = normalizeNumber(to ?? publicEnv.whatsappNumber);
  const encoded = encodeURIComponent(message);
  return number
    ? `https://wa.me/${number}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
