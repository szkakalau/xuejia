"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
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
      <article className="pb-36">
        <div className="relative aspect-square w-full bg-surface-elevated">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
        <div className="px-4 py-5">
          <p className="text-xs uppercase tracking-widest text-gold/70">{product.brandName}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight">
            {product.nameZh || product.name}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">{product.name}</p>
          <p className="mt-4 text-2xl font-semibold text-gold">
            {product.inStock ? formatPrice(product.priceHkd) : "暫時無貨"}
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-surface-border bg-surface-elevated p-4 text-sm">
            {product.specs.length && (
              <>
                <dt className="text-foreground/50">長度</dt>
                <dd>{product.specs.length}</dd>
              </>
            )}
            {product.specs.ringGauge != null && (
              <>
                <dt className="text-foreground/50">環徑</dt>
                <dd>{product.specs.ringGauge}</dd>
              </>
            )}
            {product.specs.packaging && (
              <>
                <dt className="text-foreground/50">包裝</dt>
                <dd>{product.specs.packaging}</dd>
              </>
            )}
          </dl>
          {product.inStock && (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-foreground/60">數量</span>
              <div className="flex items-center rounded-full border border-surface-border">
                <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="min-w-[2rem] text-center">{qty}</span>
                <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>
          )}
          <Link href="/contact" className="mt-6 block text-center text-sm text-gold underline underline-offset-4">
            聯繫客服（微信）
          </Link>
        </div>
      </article>
      <div className="fixed above-bottom-nav left-1/2 z-[60] flex w-full max-w-lg -translate-x-1/2 gap-3 border-t border-surface-border bg-background/98 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleAdd}
          className="flex-1 rounded-full border border-gold py-3 text-sm font-medium text-gold transition enabled:hover:bg-gold/10 disabled:opacity-40"
        >
          {added ? "已加入 ✓" : "加入購物車"}
        </button>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleBuyNow}
          className="flex-1 rounded-full bg-gold py-3 text-sm font-medium text-background transition enabled:hover:bg-gold-light disabled:opacity-40"
        >
          立即購買
        </button>
      </div>
    </ShopShell>
  );
}
