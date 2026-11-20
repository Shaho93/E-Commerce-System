import { useRef, useState, type FormEvent } from "react";
import { api } from "../api";
import { ApiError, type PaymentMethod } from "../api/types";
import { useCart } from "../cart/CartContext";
import { ErrorBox } from "../components/Message";
import { Summary } from "../components/Summary";
import { rememberOrder } from "../myOrders";
import { formatPrice } from "../pricing";
import { Link, useRouter } from "../router";

const empty = { customerName: "", customerEmail: "", street: "", zip: "", city: "" };
type Fields = typeof empty;

const example: Fields = {
  customerName: "Erika Beispiel",
  customerEmail: "erika@example.com",
  street: "Musterweg 12",
  zip: "70173",
  city: "Stuttgart",
};

const labels: Record<keyof Fields, string> = {
  customerName: "Vor- und Nachname",
  customerEmail: "E-Mail",
  street: "Straße und Hausnummer",
  zip: "PLZ",
  city: "Ort",
};

function newKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function CheckoutPage() {
  const cart = useCart();
  const { navigate } = useRouter();
  const [fields, setFields] = useState<Fields>(empty);
  const [payment, setPayment] = useState<PaymentMethod>("PAYPAL");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [paypalOpen, setPaypalOpen] = useState(false);
  // derselbe Schlüssel bei erneutem Absenden: der Server legt keine doppelte Bestellung an
  const idempotencyKey = useRef(newKey());

  if (cart.lines.length === 0) {
    return (
      <div className="empty">
        <h1>Nichts zu bezahlen</h1>
        <Link to="/" className="btn">
          Zum Shop
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    setBusy(true);
    setError("");
    setErrors({});
    try {
      const order = await api.createOrder(
        {
          ...fields,
          paymentMethod: payment,
          items: cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        },
        idempotencyKey.current,
      );
      rememberOrder(order.orderNumber);
      cart.clear();
      navigate(`/bestellung/${order.orderNumber}`);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fields);
        setError(e.message);
      } else {
        setError("Die Bestellung konnte nicht abgeschlossen werden.");
      }
    } finally {
      setBusy(false);
      setPaypalOpen(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (payment === "PAYPAL") setPaypalOpen(true);
    else void placeOrder();
  };

  return (
    <>
      <Link to="/warenkorb" className="back">
        ← Zurück zum Warenkorb
      </Link>
      <h1>Kasse</h1>
      <form className="two-col" onSubmit={onSubmit} noValidate>
        <div className="panel">
          <div className="panel__head">
            <h2>Lieferadresse</h2>
            {api.mode === "demo" && (
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setFields(example);
                  setErrors({});
                  setError("");
                }}
              >
                Beispieldaten einfügen
              </button>
            )}
          </div>
          <div className="form">
            {(Object.keys(empty) as (keyof Fields)[]).map((key) => (
              <label key={key} className={`field field--${key}`}>
                {labels[key]}
                <input
                  value={fields[key]}
                  onChange={(e) => {
                    setFields({ ...fields, [key]: e.target.value });
                    if (errors[key])
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                  }}
                  type={key === "customerEmail" ? "email" : "text"}
                  inputMode={key === "zip" ? "numeric" : undefined}
                  autoComplete={
                    { customerName: "name", customerEmail: "email", street: "street-address", zip: "postal-code", city: "address-level2" }[key]
                  }
                  aria-invalid={Boolean(errors[key])}
                  required
                />
                {errors[key] && <span className="field__error">{errors[key]}</span>}
              </label>
            ))}
          </div>

          <h2>Zahlungsart</h2>
          <div className="payments">
            <label className={`payment ${payment === "PAYPAL" ? "is-active" : ""}`}>
              <input type="radio" name="payment" checked={payment === "PAYPAL"} onChange={() => setPayment("PAYPAL")} />
              <span>
                <strong>PayPal</strong>
                <small className="muted">{api.mode === "demo" ? "simuliert, kein echtes Konto nötig" : "PayPal Checkout"}</small>
              </span>
            </label>
            <label className={`payment ${payment === "INVOICE" ? "is-active" : ""}`}>
              <input type="radio" name="payment" checked={payment === "INVOICE"} onChange={() => setPayment("INVOICE")} />
              <span>
                <strong>Rechnung</strong>
                <small className="muted">Zahlbar innerhalb von 14 Tagen</small>
              </span>
            </label>
          </div>
        </div>

        <aside className="panel">
          <h2>Ihre Bestellung</h2>
          <ul className="mini-lines">
            {cart.lines.map((l) => (
              <li key={l.product.id}>
                <span>
                  {l.quantity} × {l.product.name}
                </span>
                <span>{formatPrice(l.product.priceCents * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <Summary subtotalCents={cart.subtotalCents} shippingCents={cart.shippingCents} totalCents={cart.totalCents} />
          {error && <ErrorBox>{error}</ErrorBox>}
          <button type="submit" className="btn btn--lg btn--block" disabled={busy}>
            {busy ? "Wird bestellt …" : "Zahlungspflichtig bestellen"}
          </button>
        </aside>
      </form>

      {paypalOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="paypal-title">
          <div className="modal__box">
            <p className="paypal-logo">PayPal</p>
            <h2 id="paypal-title">Zahlung bestätigen</h2>
            <p>
              Kindi Rösterei möchte <strong>{formatPrice(cart.totalCents)}</strong> abbuchen.
            </p>
            {api.mode === "demo" && <p className="muted">Simulation: Es wird kein Geld bewegt und kein PayPal-Konto verwendet.</p>}
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setPaypalOpen(false)} disabled={busy}>
                Abbrechen
              </button>
              <button type="button" className="btn btn--paypal" onClick={() => void placeOrder()} disabled={busy}>
                {busy ? "Wird bezahlt …" : "Jetzt bezahlen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
