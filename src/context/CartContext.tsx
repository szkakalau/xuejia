"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "cigar-cart";

interface CartLine extends CartItem {
  product: Product;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  totalHkd: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadStored(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRawItems(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawItems));
    }
  }, [rawItems, hydrated]);

  const items = useMemo(() => {
    return rawItems
      .filter((item) => item.product)
      .map((item) => ({ ...item, product: item.product! }));
  }, [rawItems]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalHkd = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + (i.product.inStock ? i.product.priceHkd * i.quantity : 0),
        0
      ),
    [items]
  );

  const addItem = useCallback((product: Product, qty = 1) => {
    if (!product.inStock) return;
    setRawItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty, product }
            : i
        );
      }
      return [...prev, { productId: product.id, quantity: qty, product }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setRawItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setRawItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setRawItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setRawItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count,
      totalHkd,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [items, count, totalHkd, addItem, removeItem, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
