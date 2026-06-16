export interface ProductDTO {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
