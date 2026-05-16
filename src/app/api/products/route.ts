import { NextResponse } from "next/server";
import { getDbErrorMessage } from "@/lib/db-error";
import {
  getBrands,
  getProductBySlug,
  getProducts,
  getProductsByBrand,
  searchProducts,
} from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "未配置 DATABASE_URL" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const brandId = searchParams.get("brandId");
    const slug = searchParams.get("slug");

    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: "商品不存在" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

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
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: getDbErrorMessage(error) },
      { status: 503 }
    );
  }
}
