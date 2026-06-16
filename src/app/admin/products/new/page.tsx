import { ProductForm } from "@/admin/components/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-masala-900">
        Add product
      </h1>
      <ProductForm />
    </div>
  );
}
