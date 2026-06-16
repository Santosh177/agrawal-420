"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductDTO } from "@/shared/types/products";
import { productApi } from "@/shared/services/product.api";
import { formatRupees } from "@/shared/lib/format";
import { Badge } from "@/shared/components/ui/Badge";

export function ProductsTable({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      await productApi.remove(id);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(product: ProductDTO) {
    setBusyId(product.id);
    try {
      await productApi.update(product.id, { isActive: !product.isActive });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (products.length === 0) {
    return <p className="card p-8 text-center text-masala-700">No products yet.</p>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-masala-100 bg-masala-50 text-xs uppercase tracking-wide text-masala-700">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-masala-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-masala-50">
              <td className="px-4 py-3 font-medium text-masala-900">
                {p.name}
                {p.isFeatured && (
                  <span className="ml-2">
                    <Badge tone="warning">Featured</Badge>
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-masala-700">{p.category}</td>
              <td className="px-4 py-3">{formatRupees(p.price)}</td>
              <td className="px-4 py-3">
                {p.stock <= 0 ? (
                  <Badge tone="danger">{p.stock}</Badge>
                ) : p.stock <= 10 ? (
                  <Badge tone="warning">{p.stock}</Badge>
                ) : (
                  p.stock
                )}
              </td>
              <td className="px-4 py-3">
                {p.isActive ? (
                  <Badge tone="success">Active</Badge>
                ) : (
                  <Badge tone="neutral">Inactive</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="btn-ghost px-2 py-1 text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => handleToggleActive(p)}
                    className="btn-ghost px-2 py-1 text-xs"
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => handleDelete(p.id, p.name)}
                    className="btn-ghost px-2 py-1 text-xs text-spice-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
