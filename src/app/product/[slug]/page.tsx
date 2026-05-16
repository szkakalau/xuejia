"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchJson } from "@/lib/api-client";
import { ProductDetail } from "@/components/ProductDetail";
import { ShopShell } from "@/components/ShopShell";
import { PageHeader } from "@/components/PageHeader";
import type { Product } from "@/types";

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      const result = await fetchJson<{ product: Product }>(
        `/api/products?slug=${encodeURIComponent(slug)}`
      );
      if (cancelled) return;

      if (!result.ok) {
        setProduct(null);
        setError(result.error);
      } else {
        setProduct(result.data.product ?? null);
      }
      setLoading(false);
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

  if (error || !product) {
    return (
      <ShopShell>
        <PageHeader title="商品不存在" backHref="/categories" />
        <p className="px-4 py-20 text-center text-sm text-foreground/50">
          {error || "找不到此商品"}
        </p>
      </ShopShell>
    );
  }

  return <ProductDetail product={product} />;
}
