import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const brands = await getBrands();
  return (
    <AdminShell>
      <h1 className="mb-6 font-display text-xl text-gold">新增商品</h1>
      <ProductForm brands={brands} />
    </AdminShell>
  );
}
