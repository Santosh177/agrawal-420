import Link from "next/link";
import Image from "next/image";
import { productService } from "@/backend/services/product.service";
import type { ProductDTO } from "@/shared/types/products";
import { ProductCard } from "@/website/components/products/ProductCard";
import { buildWhatsAppUrl } from "@/shared/lib/whatsapp";

// ISR: public catalog is SEO-friendly and only needs periodic freshness.
export const revalidate = 60;

async function getData(): Promise<{
  featured: ProductDTO[];
  categories: string[];
}> {
  try {
    const [featured, all] = await Promise.all([
      productService.listFeatured(),
      productService.listPublic(),
    ]);
    const categories = Array.from(new Set(all.map((p) => p.category))).sort();
    return { featured: featured.slice(0, 4), categories };
  } catch (error) {
    console.error("Home data load failed:", error);
    return { featured: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, categories } = await getData();

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-spice-600 text-white">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              Freshly made · Crunchy · Authentic
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              Namkeen 420
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/90">
              Traditional Indian namkeen and snacks, made fresh and delivered to
              your door. Order easily over WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn bg-white text-brand-700 hover:bg-brand-50">
                Browse products
              </Link>
              <a
                href={buildWhatsAppUrl(
                  "Hello Namkeen 420, I would like to place an order."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-white/40 text-white hover:bg-white/10"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
            <Image
              src="https://res.cloudinary.com/dvqdayvz1/image/upload/v1780837747/HeroBanner1_qnfpkp.jpg"
              alt="Assorted Indian namkeen"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-2xl font-bold text-masala-900">Categories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href="/products"
                className="card px-5 py-3 text-sm font-semibold text-masala-900 hover:border-brand-300"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-masala-900">
            Featured products
          </h2>
          <Link href="/products" className="text-sm font-semibold text-brand-600">
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-6 text-masala-700">
            Products will appear here once added. Run the seed script to load the
            starter catalog.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-16">
        <div className="card flex flex-col items-center gap-4 bg-masala-100 p-8 text-center">
          <h3 className="text-xl font-bold text-masala-900">
            Ready to snack?
          </h3>
          <p className="max-w-lg text-masala-700">
            Add your favourites to the cart and send your order on WhatsApp. We
            confirm availability and share a payment link.
          </p>
          <Link href="/products" className="btn-primary">
            Start your order
          </Link>
        </div>
      </section>
    </div>
  );
}
