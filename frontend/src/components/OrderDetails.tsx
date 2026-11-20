import type { Order } from "../api/types";
import { formatPrice } from "../pricing";
import { Summary } from "./Summary";

const statusText: Record<Order["status"], string> = {
  CREATED: "Angelegt",
  PAID: "Bezahlt",
  SHIPPED: "Versendet",
  CANCELLED: "Storniert",
};

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="panel">
      <div className="panel__head">
        <h2>Bestellung {order.orderNumber}</h2>
        <span className="badge badge--ok">{statusText[order.status]}</span>
      </div>
      <p className="muted">
        {new Date(order.createdAt).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
        {order.paymentMethod === "PAYPAL" ? "PayPal" : "Rechnung"}
      </p>
      <ul className="mini-lines">
        {order.items.map((i) => (
          <li key={i.productId}>
            <span>
              {i.quantity} × {i.productName}
            </span>
            <span>{formatPrice(i.lineTotalCents)}</span>
          </li>
        ))}
      </ul>
      <Summary subtotalCents={order.subtotalCents} shippingCents={order.shippingCents} totalCents={order.totalCents} />
      <p className="address">
        <strong>Lieferadresse</strong>
        <br />
        {order.customerName}
        <br />
        {order.street}
        <br />
        {order.zip} {order.city}
      </p>
    </div>
  );
}
