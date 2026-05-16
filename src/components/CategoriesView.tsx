"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api-client";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import type { Brand, Product } from "@/types";

type CatalogResponse = { brands: Brand[]; products: Product[] };

export function CategoriesView() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [activeBrand, setActiveBrand] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      setHint("");

      const result = await fetchJson<CatalogResponse>("/api/products");
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const nextBrands = result.data.brands ?? [];
      const nextProducts = result.data.products ?? [];
      setBrands(nextBrands);
      setProducts(nextProducts);
      setActiveBrand((current) => current || nextBrands[0]?.id || "");

      if (nextProducts.length === 0) {
        const health = await fetchJson<{
          ok: boolean;
          productCount?: number;
          hint?: string;
          error?: string;
        }>("/api/health");
        if (!cancelled && health.ok && health.data.hint) {
          setHint(health.data.hint);
        } else if (!cancelled && !health.ok) {
          setHint("請在 Render Shell 執行：npx prisma migrate deploy && npm run db:seed");
        }
      }

      setLoading(false);
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
          <p className="mt-3 text-xs leading-relaxed text-foreground/50">
            請在 Render → Web 服務 → Environment 設置 DATABASE_URL，然後在 Shell 執行：
          </p>
          <pre className="mx-auto mt-2 max-w-sm overflow-x-auto rounded-lg bg-surface-elevated p-3 text-left text-[10px] text-foreground/70">
            npx prisma migrate deploy{"\n"}npm run db:seed
          </pre>
          <p className="mt-2 text-xs text-foreground/40">
            診斷：<a href="/api/health" className="text-gold underline" target="_blank" rel="noreferrer">/api/health</a>
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
            {hint && (
              <p className="border-b border-gold/30 bg-gold/10 px-2 py-2 text-center text-xs text-gold">
                {hint}
              </p>
            )}
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
