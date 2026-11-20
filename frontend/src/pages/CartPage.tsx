import { maxQuantity, useCart } from "../cart/CartContext";
import { ProductTile } from "../components/ProductTile";
import { QuantityStepper } from "../components/QuantityStepper";
import { Summary } from "../components/Summary";
import { formatPrice } from "../pricing";
import { Link } from "../router";

export function CartPage() {
  const cart = useCart();

  if (cart.lines.length === 0) {
    return (
      <div className="empty">
        <h1>Ihr Warenkorb ist leer</h1>
        <p className="muted">Stöbern Sie in Kaffee, Tee und Zubehör.</p>
        <Link to="/" className="btn">
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1>Warenkorb</h1>
      <div className="two-col">
        <ul className="lines">
          {cart.lines.map(({ product, quantity }) => (
            <li key={product.id} className="line">
              <ProductTile product={product} size="sm" />
              <div className="line__info">
                <Link to={`/produkt/${product.slug}`}>
                  <strong>{product.name}</strong>
                </Link>
                <span className="muted">{formatPrice(product.priceCents)} pro Stück</span>
                <button type="button" className="link-btn" onClick={() => cart.remove(product.id)}>
                  Entfernen
                </button>
              </div>
              <QuantityStepper
                value={quantity}
                max={maxQuantity(product)}
                onChange={(q) => cart.setQuantity(product.id, q)}
                label={`Menge ${product.name}`}
              />
              <strong className="line__total">{formatPrice(product.priceCents * quantity)}</strong>
            </li>
          ))}
        </ul>
        <aside className="panel">
          <Summary subtotalCents={cart.subtotalCents} shippingCents={cart.shippingCents} totalCents={cart.totalCents} />
          <Link to="/kasse" className="btn btn--lg btn--block">
            Zur Kasse
          </Link>
        </aside>
      </div>
    </>
  );
}
