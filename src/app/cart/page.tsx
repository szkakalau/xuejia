"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format-price";

export default function CartPage() {
  const { items, totalHkd, setQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "結算失敗");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "結算失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopShell>
      <PageHeader title="購物車" />
      {items.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-foreground/50">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-40">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h2l2.4 12h11.2l2-8H6" />
          </svg>
          <p>購物車是空的</p>
          <Link href="/categories" className="mt-4 text-gold underline">
            去選購
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs text-foreground/50">共 {items.length} 款</span>
            <button type="button" onClick={clearCart} className="text-xs text-foreground/50 underline">
              清空
            </button>
          </div>
          <ul className="divide-y divide-surface-border px-4">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
                  <Image src={item.product.image} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm">{item.product.nameZh || item.product.name}</h3>
                  <p className="mt-1 text-sm text-gold">{formatPrice(item.product.priceHkd)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-surface-border text-sm"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-surface-border text-sm"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs text-foreground/40 underline"
                      onClick={() => removeItem(item.productId)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-lg -translate-x-1/2 border-t border-surface-border bg-background/95 px-4 py-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-foreground/60">合計</span>
              <span className="text-xl font-semibold text-gold">{formatPrice(totalHkd)}</span>
            </div>
            {error && <p className="mb-2 text-center text-xs text-red-400">{error}</p>}
            <button
              type="button"
              disabled={loading || totalHkd <= 0}
              onClick={checkout}
              className="w-full rounded-full bg-gold py-3 text-sm font-medium text-background transition hover:bg-gold-light disabled:opacity-50"
            >
              {loading ? "正在跳轉支付…" : "結算"}
            </button>
            <p className="mt-2 text-center text-[10px] text-foreground/40">
              由 Stripe 安全處理 · 支持信用卡 / Apple Pay
            </p>
          </div>
        </>
      )}
    </ShopShell>
  );
}
