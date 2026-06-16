import Link from "next/link";
import { productService } from "@/backend/services/product.service";
import { ProductsTable } from "@/admin/components/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await productService.list();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-masala-900">Products</h1>
          <p className="text-sm text-masala-700">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Add product
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
