import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands, getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [brands, product] = await Promise.all([getBrands(), getProductById(id)]);

  if (!product) notFound();

  return (
    <AdminShell>
      <h1 className="mb-6 font-display text-xl text-gold">編輯商品</h1>
      <ProductForm brands={brands} initial={product} productId={id} />
    </AdminShell>
  );
}
