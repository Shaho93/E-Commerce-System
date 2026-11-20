import type { ReactNode } from "react";
import { api } from "../api";
import { useCart } from "../cart/CartContext";
import { forgetOrders } from "../myOrders";
import { Link } from "../router";

export function Layout({ children }: { children: ReactNode }) {
  const cart = useCart();

  const resetDemo = () => {
    api.reset?.();
    forgetOrders();
    cart.clear();
    window.location.href = "/";
  };

  return (
    <>
      {api.mode === "demo" && (
        <div className="demo-banner">
          Demo-Shop: Bestellungen und Zahlungen sind simuliert, alles bleibt in Ihrem Browser.{" "}
          <button type="button" onClick={resetDemo}>
            Demo zurücksetzen
          </button>
        </div>
      )}
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            <span aria-hidden="true">☕</span> Kindi Rösterei
          </Link>
          <nav className="nav">
            <Link to="/">Shop</Link>
            <Link to="/bestellungen">Bestellungen</Link>
            <Link to="/warenkorb" className="cart-link">
              <span aria-hidden="true">🛒</span>
              <span className="sr-only">Warenkorb</span>
              {cart.count > 0 && <span className="cart-link__count">{cart.count}</span>}
            </Link>
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
      <footer className="footer">
        <div className="container">
          Kindi Rösterei ist ein fiktiver Demo-Shop von{" "}
          <a href="https://kindiit.de" target="_blank" rel="noopener noreferrer">
            KindiIT
          </a>
          . Spring Boot · React · PostgreSQL
        </div>
      </footer>
    </>
  );
}
