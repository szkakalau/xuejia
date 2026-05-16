import brandsData from "../../data/brands.json";
import productsData from "../../data/products.json";
import type { Brand, Product } from "@/types";

export const brands: Brand[] = brandsData as Brand[];
export const products: Product[] = productsData as Product[];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameZh.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.brandNameZh.toLowerCase().includes(q)
  );
}

export function formatPrice(hkd: number): string {
  if (!hkd) return "詢價";
  return `HK$${hkd.toLocaleString("zh-HK")}`;
}
