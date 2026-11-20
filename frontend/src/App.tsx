import { CartProvider } from "./cart/CartContext";
import { Layout } from "./components/Layout";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderPage } from "./pages/OrderPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";
import { Link, matchPath, RouterProvider, useRouter } from "./router";

function Routes() {
  const { path } = useRouter();
  if (path === "/") return <ShopPage />;
  if (path === "/warenkorb") return <CartPage />;
  if (path === "/kasse") return <CheckoutPage />;
  if (path === "/bestellungen") return <OrdersPage />;
  const product = matchPath("/produkt/:slug", path);
  if (product) return <ProductPage key={product.slug} slug={product.slug} />;
  const order = matchPath("/bestellung/:number", path);
  if (order) return <OrderPage key={order.number} orderNumber={order.number} />;
  return (
    <div className="empty">
      <h1>Seite nicht gefunden</h1>
      <Link to="/" className="btn">
        Zum Shop
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <Layout>
          <Routes />
        </Layout>
      </CartProvider>
    </RouterProvider>
  );
}
