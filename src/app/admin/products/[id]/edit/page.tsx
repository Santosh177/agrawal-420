import { notFound } from "next/navigation";
import { productService } from "@/backend/services/product.service";
import { ProductForm } from "@/admin/components/ProductForm";
import { HttpError } from "@/shared/lib/api-response";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const product = await productService.getById(id);
    return (
      <div>
        <h1 className="mb-6 text-2xl font-extrabold text-masala-900">
          Edit product
        </h1>
        <ProductForm initial={product} />
      </div>
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }
}
