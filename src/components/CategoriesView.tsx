"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import type { Brand, Product } from "@/types";

export function CategoriesView() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBrand, setActiveBrand] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "無法載入商品");
        if (cancelled) return;
        const nextBrands = data.brands ?? [];
        setBrands(nextBrands);
        setProducts(data.products ?? []);
        setActiveBrand((current) => current || nextBrands[0]?.id || "");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "無法載入商品，請稍後再試");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.brandId === activeBrand),
    [products, activeBrand]
  );

  const activeBrandInfo = brands.find((b) => b.id === activeBrand);

  return (
    <ShopShell>
      <PageHeader title="古巴雪茄" showSearch />
      {loading ? (
        <p className="py-20 text-center text-sm text-foreground/50">載入中…</p>
      ) : error ? (
        <div className="px-4 py-20 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <p className="mt-2 text-xs text-foreground/50">
            若持續失敗，請確認已設定 DATABASE_URL，并在 Shell 執行 migrate 與 db:seed。
          </p>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-7rem)]">
          <aside className="w-[88px] shrink-0 overflow-y-auto border-r border-surface-border bg-surface scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => setActiveBrand(brand.id)}
                className={`w-full border-b border-surface-border/40 px-2 py-4 text-center text-[11px] leading-tight transition ${
                  activeBrand === brand.id
                    ? "border-l-2 border-l-gold bg-surface-elevated font-medium text-gold"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <span className="block font-display text-[10px] uppercase tracking-wide">
                  {brand.name.split(" ")[0]}
                </span>
                <span className="mt-1 block">{brand.nameZh}</span>
              </button>
            ))}
          </aside>
          <section className="flex-1 overflow-y-auto px-3 scrollbar-hide">
            {activeBrandInfo && (
              <div className="sticky top-0 z-10 bg-background/90 py-3 backdrop-blur-sm">
                <h2 className="font-display text-base text-gold">{activeBrandInfo.name}</h2>
                <p className="text-xs text-foreground/50">{filtered.length} 款商品</p>
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-foreground/50">此品牌暫無商品</p>
            ) : (
              filtered.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </section>
        </div>
      )}
    </ShopShell>
  );
}
