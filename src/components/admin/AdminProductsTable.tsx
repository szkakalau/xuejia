"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/products";
import type { Brand, Product } from "@/types";

interface AdminProductsTableProps {
  brands: Brand[];
  products: Product[];
  page: number;
  total: number;
}

export function AdminProductsTable({ brands, products, page, total }: AdminProductsTableProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [brandId, setBrandId] = useState("");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (brandId) params.set("brandId", brandId);
    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`確定刪除「${name}」？`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("刪除失敗");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋商品…"
          className="min-w-[140px] flex-1 rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm"
        >
          <option value="">全部品牌</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nameZh}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={applyFilters}
          className="rounded-lg border border-gold/50 px-4 py-2 text-sm text-gold"
        >
          篩選
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-surface-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-surface-border bg-surface-elevated text-foreground/60">
            <tr>
              <th className="px-3 py-2">圖</th>
              <th className="px-3 py-2">名稱</th>
              <th className="px-3 py-2">品牌</th>
              <th className="px-3 py-2">價格</th>
              <th className="px-3 py-2">庫存</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-surface-border/50">
                <td className="px-3 py-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded bg-surface">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{p.nameZh || p.name}</p>
                  <p className="text-xs text-foreground/40">{p.slug}</p>
                </td>
                <td className="px-3 py-2 text-foreground/70">{p.brandNameZh}</td>
                <td className="px-3 py-2 text-gold">{formatPrice(p.priceHkd)}</td>
                <td className="px-3 py-2">
                  {p.inStock ? (
                    <span className="text-green-400">在售</span>
                  ) : (
                    <span className="text-foreground/40">無貨</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-gold hover:underline">
                      編輯
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.id, p.nameZh || p.name)}
                      className="text-red-400 hover:underline"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <p className="py-8 text-center text-foreground/50">沒有符合條件的商品</p>
      )}

      <p className="text-center text-xs text-foreground/40">
        第 {page} 頁 · 共 {total} 條
      </p>
    </div>
  );
}
