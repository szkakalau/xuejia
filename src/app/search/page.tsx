"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api-client";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";
import type { Product } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const result = await fetchJson<{ products: Product[] }>(
        `/api/products?${params.toString()}`
      );
      if (result.ok) {
        setResults(result.data.products ?? []);
      } else {
        setResults([]);
        setError(result.error);
      }
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <ShopShell>
      <PageHeader title="搜尋" subtitle="Search" backHref="/categories" />
      <div className="animate-fade-up px-4 py-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="品牌、型號、中文名…"
            className="input-luxury pl-11"
            autoFocus
          />
        </div>
      </div>
      <p className="px-5 pb-3 text-xs tracking-wide text-cream/45">
        {loading ? "搜尋中…" : error || `${results.length} 個結果`}
      </p>
      <div className="px-4">
        {results.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index} />
        ))}
      </div>
    </ShopShell>
  );
}
