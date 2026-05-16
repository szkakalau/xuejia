"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addItem(product, qty);
    router.push("/cart");
  };

  return (
    <ShopShell>
      <PageHeader title={product.brandNameZh} backHref="/categories" />
      <article className="animate-fade-in pb-40">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-tobacco">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 512px) 100vw, 512px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />
        </div>
        <div className="relative -mt-6 rounded-t-3xl border-t border-surface-border/60 bg-background px-5 pb-6 pt-7 shadow-[0_-16px_48px_rgba(0,0,0,0.35)]">
          <div className="gold-rule mx-auto mb-5" />
          <p className="text-[10px] font-medium uppercase tracking-luxury text-gold-muted">
            {product.brandName}
          </p>
          <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight text-balance">
            {product.nameZh || product.name}
          </h1>
          <p className="mt-2 text-sm text-cream/50">{product.name}</p>
          <p className="mt-5 font-display text-3xl text-gold">
            {product.inStock ? formatPrice(product.priceHkd) : "暫時無貨"}
          </p>
          <dl className="card-surface mt-8 grid grid-cols-2 gap-x-5 gap-y-3 p-5 text-sm">
            {product.specs.length && (
              <>
                <dt className="text-cream/45">長度</dt>
                <dd>{product.specs.length}</dd>
              </>
            )}
            {product.specs.ringGauge != null && (
              <>
                <dt className="text-cream/45">環徑</dt>
                <dd>{product.specs.ringGauge}</dd>
              </>
            )}
            {product.specs.packaging && (
              <>
                <dt className="text-cream/45">包裝</dt>
                <dd>{product.specs.packaging}</dd>
              </>
            )}
          </dl>
          {product.inStock && (
            <div className="mt-8 flex items-center gap-5">
              <span className="text-sm text-cream/50">數量</span>
              <div className="flex items-center overflow-hidden rounded-full border border-surface-border bg-surface-elevated/50">
                <button
                  type="button"
                  className="px-4 py-2.5 text-lg text-gold transition hover:bg-gold/10"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="min-w-[2.5rem] text-center font-medium">{qty}</span>
                <button
                  type="button"
                  className="px-4 py-2.5 text-lg text-gold transition hover:bg-gold/10"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
          <Link
            href="/contact"
            className="mt-8 block text-center text-sm text-gold/90 underline decoration-gold/30 underline-offset-4 transition hover:text-gold"
          >
            聯繫客服（微信）
          </Link>
        </div>
      </article>
      <div className="fixed above-bottom-nav left-1/2 z-[60] w-full max-w-lg -translate-x-1/2 px-4">
        <div className="flex gap-3 rounded-2xl border border-surface-border/70 bg-background/95 p-3 shadow-float backdrop-blur-xl">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAdd}
            className="btn-outline flex-1 !py-3.5"
          >
            {added ? "已加入 ✓" : "加入購物車"}
          </button>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className="btn-primary flex-1 !py-3.5"
          >
            立即購買
          </button>
        </div>
      </div>
    </ShopShell>
  );
}
