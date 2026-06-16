"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductDTO } from "@/shared/types/products";
import { productApi } from "@/shared/services/product.api";
import { uploadProductImage } from "@/admin/services/image-upload.api";
import { slugify } from "@/shared/lib/slug";

interface Props {
  initial?: ProductDTO;
}

interface FormState {
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  price: string;
  weightOptions: string;
  stock: string;
  isFeatured: boolean;
  isActive: boolean;
}

function toFormState(p?: ProductDTO): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "",
    description: p?.description ?? "",
    imageUrl: p?.imageUrl ?? "",
    price: p ? String(p.price) : "",
    weightOptions: p ? p.weightOptions.join(", ") : "200g, 500g, 1kg",
    stock: p ? String(p.stock) : "0",
    isFeatured: p?.isFeatured ?? false,
    isActive: p?.isActive ?? true,
  };
}

export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug.trim() || slugify(form.name),
      category: form.category,
      description: form.description,
      imageUrl: form.imageUrl,
      price: Number(form.price),
      weightOptions: form.weightOptions
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean),
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };

    try {
      if (isEdit && initial) {
        await productApi.update(initial.id, payload);
      } else {
        await productApi.create(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const imageUrl = await uploadProductImage(file);
      update("imageUrl", imageUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Could not upload image"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="input"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="slug">
            Slug (auto if blank)
          </label>
          <input
            id="slug"
            className="input"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder={slugify(form.name)}
          />
        </div>
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            className="input"
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="price">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="1"
            className="input"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            className="input"
            required
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="weightOptions">
            Weight options (comma separated)
          </label>
          <input
            id="weightOptions"
            className="input"
            value={form.weightOptions}
            onChange={(e) => update("weightOptions", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="imageUrl">
          Image URL
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            id="imageUrl"
            className="input"
            required
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
          <label className="btn-secondary cursor-pointer">
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading || saving}
              onChange={handleImageUpload}
              className="sr-only"
            />
          </label>
        </div>
        {uploadError && (
          <p className="mt-2 text-sm text-spice-600">{uploadError}</p>
        )}
        {form.imageUrl && (
          <div className="relative mt-3 h-48 overflow-hidden rounded-lg border border-masala-100 bg-masala-50">
            <Image
              src={form.imageUrl}
              alt={form.name || "Product image preview"}
              fill
              sizes="(max-width: 768px) 100vw, 42rem"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="input min-h-[100px]"
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-masala-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => update("isFeatured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-masala-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
          />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-spice-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : isEdit ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
