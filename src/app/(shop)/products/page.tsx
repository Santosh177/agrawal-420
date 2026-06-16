import type { Metadata } from "next";
import { productService } from "@/backend/services/product.service";
import type { ProductDTO } from "@/shared/types/products";
import { ProductCatalog } from "@/website/features/products/ProductCatalog";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full range of Namkeen 420 snacks and namkeen.",
};

// ISR: catalog data refreshes periodically; client handles search/filter/sort.
export const revalidate = 60;

async function getProducts(): Promise<ProductDTO[]> {
  try {
    return await productService.listPublic();
  } catch (error) {
    console.error("Products load failed:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-masala-900">
          Our Namkeen
        </h1>
        <p className="mt-1 text-masala-700">
          Search, filter and add your favourites to the cart.
        </p>
      </div>
      <ProductCatalog products={products} />
    </div>
  );
}
