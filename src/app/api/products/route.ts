import { NextResponse } from "next/server";
import { getBrands, getProducts, getProductsByBrand, searchProducts } from "@/lib/products";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const brandId = searchParams.get("brandId");

  if (q) {
    const products = await searchProducts(q);
    return NextResponse.json({ products });
  }

  if (brandId) {
    const products = await getProductsByBrand(brandId);
    return NextResponse.json({ products });
  }

  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return NextResponse.json({ brands, products });
}
