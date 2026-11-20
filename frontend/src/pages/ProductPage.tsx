import { useEffect, useState } from "react";
import { api } from "../api";
import type { Product } from "../api/types";
import { maxQuantity, useCart } from "../cart/CartContext";
import { ErrorBox, Loading } from "../components/Message";
import { ProductTile } from "../components/ProductTile";
import { QuantityStepper } from "../components/QuantityStepper";
import { StockBadge } from "../components/StockBadge";
import { formatPrice } from "../pricing";
import { Link, useRouter } from "../router";

export function ProductPage({ slug }: { slug: string }) {
  const cart = useCart();
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setProduct(null);
    api
      .getProduct(slug)
      .then(setProduct)
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!product) return <Loading />;

  const alreadyInCart = cart.lines.find((l) => l.product.id === product.id)?.quantity ?? 0;
  const available = Math.max(0, maxQuantity(product) - alreadyInCart);

  return (
    <>
      <Link to="/" className="back">
        ← Zurück zum Shop
      </Link>
      <div className="product">
        <ProductTile product={product} size="lg" />
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="price price--lg">{formatPrice(product.priceCents)}</p>
          <StockBadge stock={product.stock} />
          <p className="product__text">{product.description}</p>
          {available > 0 ? (
            <div className="product__buy">
              <QuantityStepper value={Math.min(quantity, available)} max={available} onChange={setQuantity} label="Menge" />
              <button
                type="button"
                className="btn btn--lg"
                onClick={() => {
                  cart.add(product, Math.min(quantity, available));
                  navigate("/warenkorb");
                }}
              >
                In den Warenkorb
              </button>
            </div>
          ) : (
            <p className="muted">
              {product.stock === 0 ? "Dieses Produkt ist ausverkauft." : "Die maximale Menge liegt bereits im Warenkorb."}
            </p>
          )}
          {alreadyInCart > 0 && <p className="muted">Im Warenkorb: {alreadyInCart} Stück</p>}
        </div>
      </div>
    </>
  );
}
