import { PrismaClient } from "@prisma/client";
import brands from "../../data/brands.json";
import products from "../../data/products.json";

let client: PrismaClient | undefined;

function getClient() {
  if (!client) client = new PrismaClient();
  return client;
}

export async function seedDatabase(): Promise<number> {
  const prisma = getClient();

  console.log("Seeding brands...");
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        name: b.name,
        nameZh: b.nameZh,
        slug: b.slug,
      },
      update: {
        name: b.name,
        nameZh: b.nameZh,
        slug: b.slug,
      },
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        brandId: p.brandId,
        brandName: p.brandName,
        brandNameZh: p.brandNameZh,
        name: p.name,
        nameZh: p.nameZh,
        length: p.specs?.length ?? "",
        ringGauge: p.specs?.ringGauge ?? null,
        packaging: p.specs?.packaging ?? "",
        priceHkd: p.priceHkd ?? 0,
        inStock: p.inStock ?? false,
        image: p.image ?? "/products/placeholder.jpg",
      },
      update: {
        slug: p.slug,
        brandId: p.brandId,
        brandName: p.brandName,
        brandNameZh: p.brandNameZh,
        name: p.name,
        nameZh: p.nameZh,
        length: p.specs?.length ?? "",
        ringGauge: p.specs?.ringGauge ?? null,
        packaging: p.specs?.packaging ?? "",
        priceHkd: p.priceHkd ?? 0,
        inStock: p.inStock ?? false,
        image: p.image ?? "/products/placeholder.jpg",
      },
    });
  }

  return prisma.product.count();
}

export async function seedIfEmpty(): Promise<{
  seeded: boolean;
  productCount: number;
}> {
  const prisma = getClient();
  let productCount = 0;

  try {
    productCount = await prisma.product.count();
  } catch {
    productCount = 0;
  }

  if (productCount > 0) {
    return { seeded: false, productCount };
  }

  productCount = await seedDatabase();
  return { seeded: true, productCount };
}

export async function disconnectSeedClient() {
  await client?.$disconnect();
  client = undefined;
}
