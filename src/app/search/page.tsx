"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import type { Product } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setResults(data.products ?? []);
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <ShopShell>
      <PageHeader title="搜尋" backHref="/categories" />
      <div className="px-4 py-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="品牌、型號、中文名…"
          className="w-full rounded-full border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:border-gold/50"
          autoFocus
        />
      </div>
      <p className="px-4 pb-2 text-xs text-foreground/50">
        {loading ? "搜尋中…" : `${results.length} 個結果`}
      </p>
      <div className="px-3">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </ShopShell>
  );
}
