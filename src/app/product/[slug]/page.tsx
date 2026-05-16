"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { ShopShell } from "@/components/ShopShell";
import { PageHeader } from "@/components/PageHeader";
import type { Product } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "無法載入商品");
        if (!cancelled) setProduct(data.product ?? null);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <ShopShell>
        <PageHeader title="載入中…" backHref="/categories" />
        <p className="py-20 text-center text-sm text-foreground/50">載入中…</p>
      </ShopShell>
    );
  }

  if (notFound || !product) {
    return (
      <ShopShell>
        <PageHeader title="商品不存在" backHref="/categories" />
        <p className="py-20 text-center text-foreground/50">找不到此商品</p>
      </ShopShell>
    );
  }

  return <ProductDetail product={product} />;
}
