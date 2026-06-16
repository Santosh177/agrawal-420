import mongoose, { Schema, model, models, type Model } from "mongoose";
import { ORDER_STATUSES } from "@/shared/lib/validators";

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

export interface OrderDocument extends mongoose.Document {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  status: (typeof ORDER_STATUSES)[number];
  paymentLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    weight: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    customerAddress: { type: String, required: true },
    notes: { type: String, default: "" },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "New",
      index: true,
    },
    paymentLink: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<OrderDocument> =
  (models.Order as Model<OrderDocument>) ||
  model<OrderDocument>("Order", orderSchema);
