import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production.local"
      : ".env.development.local",
});

import mongoose from "mongoose";
import { connectDB } from "@/shared/lib/db";
import { Product } from "@/backend/models/Product";
import { User } from "@/backend/models/User";
import { hashPassword } from "@/shared/lib/auth";
import { slugify } from "@/shared/lib/slug";
import { env } from "@/shared/lib/env";

const WEIGHTS = ["200g", "500g", "1kg"];

const products = [
  {
    name: "Aloo Bhujia",
    category: "Bhujia",
    description:
      "Classic spicy potato bhujia with a crisp bite and bold masala flavour.",
    price: 90,
    stock: 120,
    isFeatured: true,
  },
  {
    name: "Khatta Meetha",
    category: "Mixture",
    description:
      "A sweet and tangy mix of sev, boondi, peanuts and crunchy bits.",
    price: 110,
    stock: 80,
    isFeatured: true,
  },
  {
    name: "Masala Sev",
    category: "Sev",
    description: "Thin, crunchy gram-flour sev tossed with aromatic spices.",
    price: 85,
    stock: 60,
    isFeatured: false,
  },
  {
    name: "Moong Dal",
    category: "Dal",
    description: "Lightly salted, deep-fried split moong dal. Perfectly crisp.",
    price: 95,
    stock: 100,
    isFeatured: true,
  },
  {
    name: "Chana Jor Garam",
    category: "Dal",
    description: "Flattened, spiced black chana with a satisfying crunch.",
    price: 100,
    stock: 8,
    isFeatured: false,
  },
  {
    name: "Navratan Mix",
    category: "Mixture",
    description:
      "A royal nine-ingredient namkeen mixture with nuts and dry fruits.",
    price: 140,
    stock: 50,
    isFeatured: true,
  },
  {
    name: "Ratlami Sev",
    category: "Sev",
    description: "Famous Ratlami sev with a peppery, clove-forward kick.",
    price: 120,
    stock: 5,
    isFeatured: false,
  },
  {
    name: "Peanut Masala",
    category: "Nuts",
    description: "Crunchy coated masala peanuts, the perfect tea-time snack.",
    price: 80,
    stock: 200,
    isFeatured: false,
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB. Seeding...");

  for (const p of products) {
    const slug = slugify(p.name);
    await Product.findOneAndUpdate(
      { slug },
      {
        ...p,
        slug,
        imageUrl: `https://placehold.co/600x450/f05e02/ffffff?text=${encodeURIComponent(p.name)}`,
        weightOptions: WEIGHTS,
        isActive: true,
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ Product: ${p.name}`);
  }

  const passwordHash = await hashPassword(env.adminPassword);
  await User.findOneAndUpdate(
    { email: env.adminEmail.toLowerCase() },
    {
      name: "Namkeen 420 Admin",
      email: env.adminEmail.toLowerCase(),
      passwordHash,
      role: "admin",
    },
    { upsert: true, new: true }
  );
  console.log(`  ✓ Admin user: ${env.adminEmail}`);

  console.log("Seed complete.");
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
