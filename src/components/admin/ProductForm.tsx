"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Brand, Product } from "@/types";

export interface ProductFormValues {
  brandId: string;
  name: string;
  nameZh: string;
  slug: string;
  length: string;
  ringGauge: string;
  packaging: string;
  priceHkd: string;
  inStock: boolean;
  image: string;
}

interface ProductFormProps {
  brands: Brand[];
  initial?: Product;
  productId?: string;
}

function toFormValues(p?: Product): ProductFormValues {
  if (!p) {
    return {
      brandId: "",
      name: "",
      nameZh: "",
      slug: "",
      length: "",
      ringGauge: "",
      packaging: "",
      priceHkd: "",
      inStock: true,
      image: "/products/placeholder.jpg",
    };
  }
  return {
    brandId: p.brandId,
    name: p.name,
    nameZh: p.nameZh,
    slug: p.slug,
    length: p.specs.length,
    ringGauge: p.specs.ringGauge != null ? String(p.specs.ringGauge) : "",
    packaging: p.specs.packaging,
    priceHkd: String(p.priceHkd || ""),
    inStock: p.inStock,
    image: p.image,
  };
}

export function ProductForm({ brands, initial, productId }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(initial));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof ProductFormValues, value: string | boolean) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      brandId: values.brandId,
      name: values.name,
      nameZh: values.nameZh,
      slug: values.slug || undefined,
      length: values.length,
      ringGauge: values.ringGauge ? Number(values.ringGauge) : null,
      packaging: values.packaging,
      priceHkd: Number(values.priceHkd) || 0,
      inStock: values.inStock,
      image: values.image,
    };

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "儲存失敗");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm outline-none focus:border-gold/50";

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

      <label className="block text-sm">
        <span className="text-foreground/60">品牌 *</span>
        <select
          required
          value={values.brandId}
          onChange={(e) => set("brandId", e.target.value)}
          className={`mt-1 ${inputClass}`}
        >
          <option value="">請選擇</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nameZh} ({b.name})
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-foreground/60">英文名稱 *</span>
        <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={`mt-1 ${inputClass}`} />
      </label>

      <label className="block text-sm">
        <span className="text-foreground/60">中文名稱</span>
        <input value={values.nameZh} onChange={(e) => set("nameZh", e.target.value)} className={`mt-1 ${inputClass}`} />
      </label>

      <label className="block text-sm">
        <span className="text-foreground/60">Slug（留空自動生成）</span>
        <input value={values.slug} onChange={(e) => set("slug", e.target.value)} className={`mt-1 ${inputClass}`} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-foreground/60">長度</span>
          <input value={values.length} onChange={(e) => set("length", e.target.value)} className={`mt-1 ${inputClass}`} placeholder="129mm" />
        </label>
        <label className="block text-sm">
          <span className="text-foreground/60">環徑</span>
          <input value={values.ringGauge} onChange={(e) => set("ringGauge", e.target.value)} className={`mt-1 ${inputClass}`} type="number" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-foreground/60">包裝</span>
        <input value={values.packaging} onChange={(e) => set("packaging", e.target.value)} className={`mt-1 ${inputClass}`} placeholder="25支裝" />
      </label>

      <label className="block text-sm">
        <span className="text-foreground/60">價格 (HKD) *</span>
        <input required value={values.priceHkd} onChange={(e) => set("priceHkd", e.target.value)} className={`mt-1 ${inputClass}`} type="number" min={0} />
      </label>

      <label className="block text-sm">
        <span className="text-foreground/60">圖片路徑</span>
        <input value={values.image} onChange={(e) => set("image", e.target.value)} className={`mt-1 ${inputClass}`} placeholder="/products/xxx.jpg" />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.inStock} onChange={(e) => set("inStock", e.target.checked)} className="rounded" />
        <span>在售（有貨）</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? "儲存中…" : "儲存"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-surface-border px-6 py-2.5 text-sm text-foreground/70"
        >
          取消
        </button>
      </div>
    </form>
  );
}
