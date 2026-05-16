import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`flex gap-3 border-b border-surface-border/50 py-3 transition active:bg-surface-elevated/50 ${
        !product.inStock ? "opacity-50" : ""
      }`}
    >
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
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.nameZh || product.name}</h3>
        {product.specs.packaging && (
          <p className="mt-0.5 text-[11px] text-foreground/50">{product.specs.packaging}</p>
        )}
        <p className="mt-1 font-medium text-gold">
          {product.inStock ? formatPrice(product.priceHkd) : "暫時無貨"}
        </p>
      </div>
    </Link>
  );
}
