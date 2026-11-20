import { useEffect, useState } from "react";
import { api } from "../api";
import type { Order } from "../api/types";
import { Loading } from "../components/Message";
import { OrderDetails } from "../components/OrderDetails";
import { myOrderNumbers } from "../myOrders";
import { Link } from "../router";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    Promise.all(myOrderNumbers().map((n) => api.getOrder(n).catch(() => null))).then((list) =>
      setOrders(list.filter((o): o is Order => o !== null)),
    );
  }, []);

  if (!orders) return <Loading />;

  return (
    <div className="narrow">
      <h1>Ihre Bestellungen</h1>
      {orders.length === 0 ? (
        <div className="empty">
          <p className="muted">Von diesem Browser aus wurde noch nichts bestellt.</p>
          <Link to="/" className="btn">
            Zum Shop
          </Link>
        </div>
      ) : (
        <div className="stack">
          {orders.map((o) => (
            <OrderDetails key={o.orderNumber} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
