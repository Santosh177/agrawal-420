import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface ProductDocument extends mongoose.Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  weightOptions: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    weightOptions: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Product: Model<ProductDocument> =
  (models.Product as Model<ProductDocument>) ||
  model<ProductDocument>("Product", productSchema);
