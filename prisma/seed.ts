import { PrismaClient } from "@prisma/client";
import brands from "../data/brands.json";
import products from "../data/products.json";

const prisma = new PrismaClient();

async function main() {
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

  const count = await prisma.product.count();
  console.log(`Done. ${count} products in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
