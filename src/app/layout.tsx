import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Namkeen 420 | Freshly Made Indian Snacks",
    template: "%s | Namkeen 420",
  },
  description:
    "Order authentic Indian namkeen and snacks from Namkeen 420. Aloo bhujia, sev, mixtures and more, delivered fresh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
