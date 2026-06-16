import { z } from "zod";

export const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "Payment Link Sent",
  "Paid",
  "Packed",
  "Delivered",
  "Cancelled",
] as const;

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const productInputSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens")
    .optional(),
  category: z.string().min(2).max(60),
  description: z.string().min(1).max(2000),
  imageUrl: z.string().url("Image URL must be valid"),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive(),
  weightOptions: z.array(z.string().min(1)).min(1, "At least one weight option"),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const productUpdateSchema = productInputSchema.partial();

export const orderItemSchema = z.object({
  productId: objectIdSchema,
  name: z.string().min(1),
  weight: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const orderInputSchema = z.object({
  customerName: z.string().min(2, "Name required").max(120),
  customerPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Valid phone required"),
  customerAddress: z.string().min(5, "Address required").max(500),
  notes: z.string().max(1000).optional().default(""),
  items: z.array(orderItemSchema).min(1, "At least one item required"),
});

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const paymentLinkSchema = z.object({
  paymentLink: z.string().url("Payment link must be a valid URL"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
