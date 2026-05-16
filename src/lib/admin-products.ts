import { prisma } from "@/lib/db";
import { mapDbProduct } from "@/lib/product-mapper";
import { slugify } from "@/lib/product-slug";
import type { Product } from "@/types";

export interface ProductInput {
  brandId: string;
  name: string;
  nameZh: string;
  slug?: string;
  length?: string;
  ringGauge?: number | null;
  packaging?: string;
  priceHkd: number;
  inStock: boolean;
  image: string;
}

export async function listAdminProducts(params: {
  q?: string;
  brandId?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));
  const skip = (page - 1) * pageSize;

  const where: {
    brandId?: string;
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" };
      nameZh?: { contains: string; mode: "insensitive" };
    }>;
  } = {};

  if (params.brandId) where.brandId = params.brandId;
  if (params.q?.trim()) {
    const q = params.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { nameZh: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(mapDbProduct),
    total,
    page,
    pageSize,
  };
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const brand = await prisma.brand.findUnique({ where: { id: input.brandId } });
  if (!brand) throw new Error("品牌不存在");

  const baseSlug = input.slug?.trim() || slugify(`${brand.id}-${input.nameZh || input.name}`);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  const id = slug;
  const row = await prisma.product.create({
    data: {
      id,
      slug,
      brandId: brand.id,
      brandName: brand.name,
      brandNameZh: brand.nameZh,
      name: input.name,
      nameZh: input.nameZh,
      length: input.length ?? "",
      ringGauge: input.ringGauge ?? null,
      packaging: input.packaging ?? "",
      priceHkd: input.priceHkd,
      inStock: input.inStock,
      image: input.image || "/products/placeholder.jpg",
    },
  });
  return mapDbProduct(row);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new Error("商品不存在");

  const brand = await prisma.brand.findUnique({ where: { id: input.brandId } });
  if (!brand) throw new Error("品牌不存在");

  const slug = input.slug?.trim() || existing.slug;
  if (slug !== existing.slug) {
    const conflict = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) throw new Error("slug 已被使用");
  }

  const row = await prisma.product.update({
    where: { id },
    data: {
      slug,
      brandId: brand.id,
      brandName: brand.name,
      brandNameZh: brand.nameZh,
      name: input.name,
      nameZh: input.nameZh,
      length: input.length ?? "",
      ringGauge: input.ringGauge ?? null,
      packaging: input.packaging ?? "",
      priceHkd: input.priceHkd,
      inStock: input.inStock,
      image: input.image || "/products/placeholder.jpg",
    },
  });
  return mapDbProduct(row);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}
