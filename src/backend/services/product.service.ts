import { productRepository, type ProductFilter } from "@/backend/repositories/product.repository";
import type { ProductDocument } from "@/backend/models/Product";
import type { ProductDTO } from "@/shared/types/products";
import {
  productInputSchema,
  productUpdateSchema,
  type ProductInput,
  type ProductUpdateInput,
} from "@/shared/lib/validators";
import { slugify } from "@/shared/lib/slug";
import { HttpError } from "@/shared/lib/api-response";

const LOW_STOCK_THRESHOLD = 10;

function toDTO(doc: ProductDocument): ProductDTO {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    description: doc.description,
    imageUrl: doc.imageUrl,
    price: doc.price,
    weightOptions: doc.weightOptions,
    stock: doc.stock,
    isFeatured: doc.isFeatured,
    isActive: doc.isActive,
    createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export const productService = {
  async list(filter: ProductFilter = {}): Promise<ProductDTO[]> {
    const docs = await productRepository.findMany(filter);
    return docs.map(toDTO);
  },

  async listPublic(): Promise<ProductDTO[]> {
    return this.list({ activeOnly: true });
  },

  async listFeatured(): Promise<ProductDTO[]> {
    return this.list({ activeOnly: true, featuredOnly: true });
  },

  async getById(id: string): Promise<ProductDTO> {
    const doc = await productRepository.findById(id);
    if (!doc) throw new HttpError("Product not found", 404);
    return toDTO(doc);
  },

  async create(input: ProductInput): Promise<ProductDTO> {
    const data = productInputSchema.parse(input);
    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      throw new HttpError("A product with this slug already exists", 409);
    }

    const doc = await productRepository.create({ ...data, slug });
    return toDTO(doc);
  },

  async update(id: string, input: ProductUpdateInput): Promise<ProductDTO> {
    const data = productUpdateSchema.parse(input);

    if (data.slug) {
      const existing = await productRepository.findBySlug(data.slug);
      if (existing && String(existing._id) !== id) {
        throw new HttpError("A product with this slug already exists", 409);
      }
    }

    const doc = await productRepository.update(id, data);
    if (!doc) throw new HttpError("Product not found", 404);
    return toDTO(doc);
  },

  async remove(id: string): Promise<void> {
    const deleted = await productRepository.deleteById(id);
    if (!deleted) throw new HttpError("Product not found", 404);
  },

  async stats() {
    const [total, lowStock] = await Promise.all([
      productRepository.count(),
      productRepository.lowStock(LOW_STOCK_THRESHOLD),
    ]);
    return { total, lowStock: lowStock.map(toDTO) };
  },
};
