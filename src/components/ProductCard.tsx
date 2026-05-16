"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/format-price";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <article
      className={`group animate-fade-up flex gap-3 border-b border-surface-border/40 py-4 last:border-0 ${
        !product.inStock ? "opacity-55" : ""
      }`}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <Link href={`/product/${product.slug}`} className="flex min-w-0 flex-1 gap-3.5">
        <div className="image-frame relative h-[5.25rem] w-[5.25rem] shrink-0 bg-tobacco shadow-inner-glow transition duration-300 group-hover:ring-gold/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="84px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          {!product.inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/75 text-[10px] font-medium uppercase tracking-wide text-foreground/80 backdrop-blur-[2px]">
              暫時無貨
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gold-muted">
            {product.brandName}
          </p>
          <h3 className="mt-0.5 line-clamp-2 font-display text-[1.05rem] leading-snug text-foreground">
            {product.nameZh || product.name}
          </h3>
          {product.specs.packaging && (
            <p className="mt-1 text-[11px] text-cream/45">{product.specs.packaging}</p>
          )}
          <p className="mt-2 font-display text-lg text-gold">
            {product.inStock ? formatPrice(product.priceHkd) : (
              <span className="text-sm text-foreground/40">暫時無貨</span>
            )}
          </p>
        </div>
      </Link>
      <div className="flex shrink-0 flex-col items-center justify-center pr-0.5">
        <AddToCartButton product={product} variant="card" />
      </div>
    </article>
  );
}
