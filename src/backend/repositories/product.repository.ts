import { connectDB } from "@/shared/lib/db";
import { Product, type ProductDocument } from "@/backend/models/Product";
import type { FilterQuery } from "mongoose";

export interface ProductFilter {
  activeOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
}

function buildQuery(filter: ProductFilter): FilterQuery<ProductDocument> {
  const query: FilterQuery<ProductDocument> = {};
  if (filter.activeOnly) query.isActive = true;
  if (filter.featuredOnly) query.isFeatured = true;
  if (filter.category) query.category = filter.category;
  return query;
}

export const productRepository = {
  async findMany(filter: ProductFilter = {}): Promise<ProductDocument[]> {
    await connectDB();
    return Product.find(buildQuery(filter)).sort({ createdAt: -1 }).lean<ProductDocument[]>();
  },

  async findById(id: string): Promise<ProductDocument | null> {
    await connectDB();
    return Product.findById(id).lean<ProductDocument>();
  },

  async findBySlug(slug: string): Promise<ProductDocument | null> {
    await connectDB();
    return Product.findOne({ slug }).lean<ProductDocument>();
  },

  async create(data: Partial<ProductDocument>): Promise<ProductDocument> {
    await connectDB();
    const doc = await Product.create(data);
    return doc.toObject();
  },

  async update(
    id: string,
    data: Partial<ProductDocument>
  ): Promise<ProductDocument | null> {
    await connectDB();
    return Product.findByIdAndUpdate(id, data, { new: true }).lean<ProductDocument>();
  },

  async deleteById(id: string): Promise<boolean> {
    await connectDB();
    const res = await Product.findByIdAndDelete(id);
    return Boolean(res);
  },

  async count(filter: ProductFilter = {}): Promise<number> {
    await connectDB();
    return Product.countDocuments(buildQuery(filter));
  },

  async lowStock(threshold: number): Promise<ProductDocument[]> {
    await connectDB();
    return Product.find({ isActive: true, stock: { $lte: threshold } })
      .sort({ stock: 1 })
      .lean<ProductDocument[]>();
  },
};
