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
      <PageHeader title="購物車" subtitle="Shopping Cart" />
      {items.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center px-6 py-28 text-center">
          <div className="gold-rule mb-8" />
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface-border/80 bg-surface-elevated/50">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-gold/40"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h2l2.4 12h11.2l2-8H6" />
            </svg>
          </div>
          <p className="mt-6 font-display text-xl text-foreground/60">購物車是空的</p>
          <Link href="/categories" className="btn-outline mt-8 inline-block px-8">
            去選購
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs tracking-wide text-cream/45">共 {items.length} 款</span>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-foreground/40 underline decoration-foreground/20 underline-offset-2 transition hover:text-gold"
            >
              清空
            </button>
          </div>
          <ul className="space-y-3 px-4 pb-52">
            {items.map((item, index) => (
              <li
                key={item.productId}
                className="card-surface animate-fade-up flex gap-3.5 p-3.5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="image-frame relative h-[4.5rem] w-[4.5rem] shrink-0">
                  <Image src={item.product.image} alt="" fill className="object-cover" sizes="72px" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-display text-base leading-snug">
                    {item.product.nameZh || item.product.name}
                  </h3>
                  <p className="mt-1 font-display text-gold">{formatPrice(item.product.priceHkd)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-sm text-gold transition hover:bg-gold/10"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-border text-sm text-gold transition hover:bg-gold/10"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto text-xs text-foreground/35 underline underline-offset-2 transition hover:text-red-400/80"
                      onClick={() => removeItem(item.productId)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="fixed above-bottom-nav left-1/2 z-40 w-full max-w-lg -translate-x-1/2 px-4">
            <div className="rounded-2xl border border-surface-border/70 bg-background/95 p-4 shadow-float backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-cream/50">合計</span>
                <span className="font-display text-2xl text-gold">{formatPrice(totalHkd)}</span>
              </div>
              {error && <p className="mb-3 text-center text-xs text-red-400">{error}</p>}
              <button
                type="button"
                disabled={loading || totalHkd <= 0}
                onClick={checkout}
                className="btn-primary w-full"
              >
                {loading ? "正在跳轉支付…" : "結算"}
              </button>
              <p className="mt-3 text-center text-[10px] tracking-wide text-foreground/35">
                Stripe 安全處理 · 信用卡 / Apple Pay
              </p>
            </div>
          </div>
        </>
      )}
    </ShopShell>
  );
}
