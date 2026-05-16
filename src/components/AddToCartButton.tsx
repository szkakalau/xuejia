"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
  variant?: "card" | "bar";
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  inStock,
  variant = "card",
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(productId, quantity);
    setFeedback(true);
    window.setTimeout(() => setFeedback(false), 1500);
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        disabled={!inStock}
        onClick={handleClick}
        aria-label="加入購物車"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition enabled:active:scale-95 enabled:hover:bg-gold/15 disabled:border-surface-border disabled:text-foreground/30 ${className}`}
      >
        {feedback ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
