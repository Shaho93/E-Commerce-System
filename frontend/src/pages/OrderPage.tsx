import { useEffect, useState } from "react";
import { api } from "../api";
import type { Order } from "../api/types";
import { ErrorBox, Loading } from "../components/Message";
import { OrderDetails } from "../components/OrderDetails";
import { Link } from "../router";

export function OrderPage({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrder(orderNumber)
      .then(setOrder)
      .catch((e: Error) => setError(e.message));
  }, [orderNumber]);

  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!order) return <Loading />;

  return (
    <div className="narrow">
      <div className="success">
        <span aria-hidden="true">✓</span>
        <h1>Vielen Dank für Ihre Bestellung!</h1>
        <p className="muted">
          Eine Bestätigung geht an {order.customerEmail}
          {api.mode === "demo" ? " (in der Demo wird keine E-Mail versendet)" : ""}.
        </p>
      </div>
      <OrderDetails order={order} />
      <p className="center">
        <Link to="/" className="btn">
          Weiter einkaufen
        </Link>
      </p>
    </div>
  );
}
