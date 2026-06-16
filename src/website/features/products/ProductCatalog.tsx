"use client";

import { useMemo, useState } from "react";
import type { ProductDTO } from "@/shared/types/products";
import { ProductCard } from "@/website/components/products/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function ProductCatalog({ products }: { products: ProductDTO[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return Number(b.isFeatured) - Number(a.isFeatured);
      }
    });

    return list;
  }, [products, search, category, sort]);

  return (
    <div>
      <div className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            className="input"
            placeholder="Search namkeen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="input sm:w-44"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className="input sm:w-44"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="featured">Featured first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-masala-700">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
