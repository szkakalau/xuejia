import type { Product as DbProduct } from "@prisma/client";
import type { Product } from "@/types";

export function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    brandId: row.brandId,
    brandName: row.brandName,
    brandNameZh: row.brandNameZh,
    name: row.name,
    nameZh: row.nameZh,
    specs: {
      length: row.length,
      ringGauge: row.ringGauge,
      packaging: row.packaging,
    },
    priceHkd: row.priceHkd,
    priceDisplay: row.priceHkd > 0 ? String(row.priceHkd) : "詢價",
    inStock: row.inStock,
    image: row.image,
  };
}
