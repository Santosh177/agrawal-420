"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductDTO } from "@/shared/types/products";
import { useCartStore } from "@/website/features/cart/store";
import { formatRupees } from "@/shared/lib/format";
import { Badge } from "@/shared/components/ui/Badge";

export function ProductCard({ product }: { product: ProductDTO }) {
  const addItem = useCartStore((s) => s.addItem);
  const [weight, setWeight] = useState(product.weightOptions[0] ?? "");
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      weight,
      price: product.price,
      quantity: 1,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-masala-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
        {product.isFeatured && (
          <span className="absolute left-2 top-2">
            <Badge tone="warning">Featured</Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-masala-900">{product.name}</h3>
          <span className="shrink-0 font-bold text-brand-600">
            {formatRupees(product.price)}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-masala-700">
          {product.category}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-masala-700">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <label className="sr-only" htmlFor={`weight-${product.id}`}>
            Weight
          </label>
          <select
            id={`weight-${product.id}`}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input max-w-[8rem] py-1.5"
          >
            {product.weightOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {outOfStock ? (
            <Badge tone="danger">Out of stock</Badge>
          ) : product.stock <= 10 ? (
            <Badge tone="warning">Low stock</Badge>
          ) : (
            <Badge tone="success">In stock</Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-primary mt-4 w-full"
        >
          {added ? "Added!" : outOfStock ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
