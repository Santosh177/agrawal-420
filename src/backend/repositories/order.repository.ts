import { connectDB } from "@/shared/lib/db";
import { Order, type OrderDocument } from "@/backend/models/Order";
import type { FilterQuery } from "mongoose";
import type { OrderStatus } from "@/shared/lib/validators";

export interface OrderFilter {
  status?: OrderStatus;
  phone?: string;
  fromDate?: Date;
  toDate?: Date;
}

function buildQuery(filter: OrderFilter): FilterQuery<OrderDocument> {
  const query: FilterQuery<OrderDocument> = {};
  if (filter.status) query.status = filter.status;
  if (filter.phone) query.customerPhone = { $regex: filter.phone, $options: "i" };
  if (filter.fromDate || filter.toDate) {
    query.createdAt = {};
    if (filter.fromDate) query.createdAt.$gte = filter.fromDate;
    if (filter.toDate) query.createdAt.$lte = filter.toDate;
  }
  return query;
}

export const orderRepository = {
  async findMany(filter: OrderFilter = {}): Promise<OrderDocument[]> {
    await connectDB();
    return Order.find(buildQuery(filter))
      .sort({ createdAt: -1 })
      .lean<OrderDocument[]>();
  },

  async findById(id: string): Promise<OrderDocument | null> {
    await connectDB();
    return Order.findById(id).lean<OrderDocument>();
  },

  async create(data: Partial<OrderDocument>): Promise<OrderDocument> {
    await connectDB();
    const doc = await Order.create(data);
    return doc.toObject();
  },

  async update(
    id: string,
    data: Partial<OrderDocument>
  ): Promise<OrderDocument | null> {
    await connectDB();
    return Order.findByIdAndUpdate(id, data, { new: true }).lean<OrderDocument>();
  },

  async count(filter: OrderFilter = {}): Promise<number> {
    await connectDB();
    return Order.countDocuments(buildQuery(filter));
  },

  async sumRevenue(statuses: OrderStatus[]): Promise<number> {
    await connectDB();
    const result = await Order.aggregate<{ total: number }>([
      { $match: { status: { $in: statuses } } },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]);
    return result[0]?.total ?? 0;
  },
};
