import { FREE_SHIPPING_FROM_CENTS, formatPrice } from "../pricing";

export function Summary({ subtotalCents, shippingCents, totalCents }: { subtotalCents: number; shippingCents: number; totalCents: number }) {
  const missing = FREE_SHIPPING_FROM_CENTS - subtotalCents;
  return (
    <dl className="summary">
      <div>
        <dt>Zwischensumme</dt>
        <dd>{formatPrice(subtotalCents)}</dd>
      </div>
      <div>
        <dt>Versand</dt>
        <dd>{shippingCents === 0 ? "kostenlos" : formatPrice(shippingCents)}</dd>
      </div>
      {missing > 0 && subtotalCents > 0 && (
        <p className="summary__hint">
          Noch {formatPrice(missing)} bis zum kostenlosen Versand
          <span className="progress">
            <i style={{ width: `${Math.min(100, (subtotalCents / FREE_SHIPPING_FROM_CENTS) * 100)}%` }} />
          </span>
        </p>
      )}
      <div className="summary__total">
        <dt>Gesamt (inkl. MwSt.)</dt>
        <dd>{formatPrice(totalCents)}</dd>
      </div>
    </dl>
  );
}
