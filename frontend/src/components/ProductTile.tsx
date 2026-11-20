import type { Product } from "../api/types";

/** Produktbild als farbige Kachel (die Demo kommt ohne Fotos aus) */
export function ProductTile({ product, size = "md" }: { product: Pick<Product, "emoji" | "color" | "name">; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`tile tile--${size}`} style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)` }} aria-hidden="true">
      <span>{product.emoji}</span>
    </div>
  );
}
