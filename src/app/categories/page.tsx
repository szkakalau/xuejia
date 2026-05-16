"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import { brands, getProductsByBrand } from "@/lib/products";

export default function CategoriesPage() {
  const [activeBrand, setActiveBrand] = useState(brands[0]?.id ?? "");

  const products = useMemo(
    () => getProductsByBrand(activeBrand),
    [activeBrand]
  );

  const activeBrandInfo = brands.find((b) => b.id === activeBrand);

  return (
    <ShopShell>
      <PageHeader title="古巴雪茄" showSearch />
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
              <p className="text-xs text-foreground/50">{products.length} 款商品</p>
            </div>
          )}
          {products.length === 0 ? (
            <p className="py-12 text-center text-sm text-foreground/50">此品牌暫無商品</p>
          ) : (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </section>
      </div>
    </ShopShell>
  );
}
