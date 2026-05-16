"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api-client";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import type { Brand, Product } from "@/types";

type CatalogResponse = { brands: Brand[]; products: Product[] };

function LoadingSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-8rem)] animate-fade-in">
      <aside className="w-[92px] shrink-0 space-y-2 border-r border-surface-border/50 bg-surface/50 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-14 rounded-lg" />
        ))}
      </aside>
      <section className="flex-1 space-y-4 p-4">
        <div className="skeleton-shimmer h-6 w-32 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton-shimmer h-20 w-20 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton-shimmer h-3 w-16 rounded" />
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="skeleton-shimmer h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

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
          setHint("請訪問 /api/setup/run?key=ADMIN_PASSWORD 初始化資料庫");
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
      <PageHeader title="古巴雪茄" subtitle="Cuban Cigars · HKD" showSearch />
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="animate-fade-up px-6 py-24 text-center">
          <div className="gold-rule mx-auto mb-6" />
          <p className="font-display text-lg text-gold">無法載入商品</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/55">{error}</p>
          <p className="mt-4 text-xs text-foreground/40">
            診斷：
            <a href="/api/health" className="text-gold underline underline-offset-2" target="_blank" rel="noreferrer">
              /api/health
            </a>
          </p>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-8rem)]">
          <aside className="w-[92px] shrink-0 overflow-y-auto border-r border-surface-border/50 bg-surface/40 scrollbar-hide">
            {brands.map((brand) => {
              const selected = activeBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setActiveBrand(brand.id)}
                  className={`w-full border-b border-surface-border/30 px-2 py-4 text-center text-[11px] leading-tight transition-all duration-300 ${
                    selected
                      ? "brand-pill-active font-medium"
                      : "text-foreground/50 hover:bg-surface-elevated/50 hover:text-foreground/80"
                  }`}
                >
                  <span className="block font-display text-[10px] uppercase tracking-wide text-gold-muted">
                    {brand.name.split(" ")[0]}
                  </span>
                  <span className="mt-1.5 block leading-snug">{brand.nameZh}</span>
                </button>
              );
            })}
          </aside>
          <section className="flex-1 overflow-y-auto px-4 scrollbar-hide">
            {hint && (
              <p className="mb-3 rounded-xl border border-gold/25 bg-gold/5 px-3 py-2.5 text-center text-xs leading-relaxed text-gold">
                {hint}
              </p>
            )}
            {activeBrandInfo && (
              <div className="sticky top-0 z-10 -mx-1 border-b border-surface-border/40 bg-background/85 px-1 py-4 backdrop-blur-md">
                <div className="gold-rule mb-3" />
                <h2 className="font-display text-xl tracking-wide text-gold">{activeBrandInfo.name}</h2>
                <p className="mt-0.5 text-xs text-cream/45">
                  {activeBrandInfo.nameZh} · {filtered.length} 款
                </p>
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-foreground/45">此品牌暫無商品</p>
            ) : (
              filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </section>
        </div>
      )}
    </ShopShell>
  );
}
