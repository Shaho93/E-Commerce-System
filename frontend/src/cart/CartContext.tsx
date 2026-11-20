import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../api/types";
import { MAX_QUANTITY_PER_ITEM, shippingFor } from "../pricing";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const CART_KEY = "kindi-shop-cart";
const CartContext = createContext<CartValue | null>(null);

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

/** Höchstmenge: Bestand, aber nie mehr als die Grenze pro Artikel */
export const maxQuantity = (p: Product) => Math.min(p.stock, MAX_QUANTITY_PER_ITEM);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      // Speichern nicht möglich: Warenkorb gilt dann nur für diesen Besuch
    }
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const subtotalCents = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
    const shippingCents = shippingFor(subtotalCents);
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      add: (product, quantity = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.product.id === product.id);
          const next = Math.min((existing?.quantity ?? 0) + quantity, maxQuantity(product));
          if (next <= 0) return prev;
          return existing
            ? prev.map((l) => (l.product.id === product.id ? { product, quantity: next } : l))
            : [...prev, { product, quantity: next }];
        }),
      setQuantity: (productId, quantity) =>
        setLines((prev) =>
          prev
            .map((l) => (l.product.id === productId ? { ...l, quantity: Math.min(quantity, maxQuantity(l.product)) } : l))
            .filter((l) => l.quantity > 0),
        ),
      remove: (productId) => setLines((prev) => prev.filter((l) => l.product.id !== productId)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart nur innerhalb von CartProvider verwenden");
  return ctx;
}
