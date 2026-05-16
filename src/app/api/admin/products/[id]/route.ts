import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/admin-products";
import { getProductById } from "@/lib/products";
import { revalidateStorefront } from "@/lib/revalidate-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: "商品不存在" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const product = await updateProduct(id, {
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
    return NextResponse.json(product);
  } catch (e) {
    const message = e instanceof Error ? e.message : "更新失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    revalidateStorefront();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "刪除失敗" }, { status: 400 });
  }
}
