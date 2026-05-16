import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";
import { listAdminProducts } from "@/lib/admin-products";
import { getBrands } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brandId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const brands = await getBrands();
  const { items, total, page } = await listAdminProducts({
    q: params.q,
    brandId: params.brandId,
    page: Number(params.page ?? 1),
    pageSize: 50,
  });

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl text-gold">商品管理</h1>
          <p className="text-sm text-foreground/50">共 {total} 款</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-background"
        >
          + 新增商品
        </Link>
      </div>
      <AdminProductsTable brands={brands} products={items} page={page} total={total} />
    </AdminShell>
  );
}
