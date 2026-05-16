import { NextResponse } from "next/server";
import { createProduct, listAdminProducts } from "@/lib/admin-products";
import { revalidateStorefront } from "@/lib/revalidate-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await listAdminProducts({
    q: searchParams.get("q") ?? undefined,
    brandId: searchParams.get("brandId") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    pageSize: Number(searchParams.get("pageSize") ?? 50),
  });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
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
    };

    if (!body.brandId || !body.name?.trim()) {
      return NextResponse.json({ error: "請填寫品牌與商品名稱" }, { status: 400 });
    }

    const product = await createProduct({
      brandId: body.brandId,
      name: body.name.trim(),
      nameZh: (body.nameZh || body.name).trim(),
      slug: body.slug,
      length: body.length,
      ringGauge: body.ringGauge,
      packaging: body.packaging,
      priceHkd: Number(body.priceHkd) || 0,
      inStock: Boolean(body.inStock),
      image: body.image?.trim() || "/products/placeholder.jpg",
    });

    revalidateStorefront();
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "建立失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
