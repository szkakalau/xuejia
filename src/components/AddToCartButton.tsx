"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  variant?: "card" | "bar";
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  product,
  variant = "card",
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, quantity);
    setFeedback(true);
    window.setTimeout(() => setFeedback(false), 1500);
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        disabled={!product.inStock}
        onClick={handleClick}
        aria-label="加入購物車"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 enabled:active:scale-90 ${
          feedback
            ? "border-gold bg-gold text-background shadow-gold"
            : "border-gold/50 text-gold enabled:hover:border-gold enabled:hover:bg-gold/15 enabled:hover:shadow-gold"
        } disabled:border-surface-border disabled:text-foreground/25 ${className}`}
      >
        {feedback ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        )}
      </button>
    );
  }

  return null;
}
