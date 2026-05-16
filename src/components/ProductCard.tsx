"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      className={`flex gap-3 border-b border-surface-border/50 py-3 ${
        !product.inStock ? "opacity-50" : ""
      }`}
    >
      <Link href={`/product/${product.slug}`} className="flex min-w-0 flex-1 gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
          {!product.inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] text-foreground/80">
              暫時無貨
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-gold/70">{product.brandName}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">
            {product.nameZh || product.name}
          </h3>
          {product.specs.packaging && (
            <p className="mt-0.5 text-[11px] text-foreground/50">{product.specs.packaging}</p>
          )}
          <p className="mt-1 font-medium text-gold">
            {product.inStock ? formatPrice(product.priceHkd) : "暫時無貨"}
          </p>
        </div>
      </Link>
      <div className="flex shrink-0 flex-col items-center justify-center gap-1 pr-1">
        <AddToCartButton productId={product.id} inStock={product.inStock} variant="card" />
      </div>
    </div>
  );
}
