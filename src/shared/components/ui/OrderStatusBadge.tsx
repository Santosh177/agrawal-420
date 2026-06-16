import { Badge } from "@/shared/components/ui/Badge";
import type { OrderStatus } from "@/shared/lib/validators";

const toneByStatus: Record<OrderStatus, Parameters<typeof Badge>[0]["tone"]> = {
  New: "info",
  Confirmed: "info",
  "Payment Link Sent": "warning",
  Paid: "success",
  Packed: "success",
  Delivered: "success",
  Cancelled: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={toneByStatus[status]}>{status}</Badge>;
}
