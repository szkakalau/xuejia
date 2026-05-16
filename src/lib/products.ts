import { prisma } from "@/lib/db";
import { mapDbProduct } from "@/lib/product-mapper";
import type { Brand, Product } from "@/types";

export async function getBrands(): Promise<Brand[]> {
  const rows = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    nameZh: b.nameZh,
    slug: b.slug,
  }));
}

export async function getBrandById(id: string): Promise<Brand | undefined> {
  const b = await prisma.brand.findUnique({ where: { id } });
  if (!b) return undefined;
  return { id: b.id, name: b.name, nameZh: b.nameZh, slug: b.slug };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: [{ brandId: "asc" }, { name: "asc" }] });
  return rows.map(mapDbProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? mapDbProduct(row) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? mapDbProduct(row) : undefined;
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { brandId },
    orderBy: { name: "asc" },
  });
  return rows.map(mapDbProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return getProducts();
  const rows = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { nameZh: { contains: q, mode: "insensitive" } },
        { brandName: { contains: q, mode: "insensitive" } },
        { brandNameZh: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
  });
  return rows.map(mapDbProduct);
}

export function formatPrice(hkd: number): string {
  if (!hkd) return "詢價";
  return `HK$${hkd.toLocaleString("zh-HK")}`;
}
