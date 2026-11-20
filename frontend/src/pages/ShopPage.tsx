import { useEffect, useState } from "react";
import { api } from "../api";
import type { Product, Sort } from "../api/types";
import { maxQuantity, useCart } from "../cart/CartContext";
import { ErrorBox, Loading } from "../components/Message";
import { ProductTile } from "../components/ProductTile";
import { StockBadge } from "../components/StockBadge";
import { FREE_SHIPPING_FROM_CENTS, formatPrice } from "../pricing";
import { Link } from "../router";

export function ShopPage() {
  const cart = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("RELEVANCE");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      api
        .listProducts({ category: category || undefined, q: query || undefined, sort })
        .then((list) => {
          if (!active) return;
          setProducts(list);
          setError("");
        })
        .catch((e: Error) => active && setError(e.message));
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [category, query, sort]);

  const add = (p: Product) => {
    cart.add(p);
    setAdded(p.id);
    setTimeout(() => setAdded((id) => (id === p.id ? null : id)), 1500);
  };

  const inCart = (p: Product) => cart.lines.find((l) => l.product.id === p.id)?.quantity ?? 0;

  return (
    <>
      <section className="hero">
        <h1>Frisch geröstet, schnell geliefert</h1>
        <p>
          Kaffee, Tee und Zubehör aus unserer kleinen Rösterei. Kostenloser Versand ab{" "}
          {formatPrice(FREE_SHIPPING_FROM_CENTS)}.
        </p>
      </section>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Kategorie">
          <button type="button" className={`chip ${category === "" ? "is-active" : ""}`} onClick={() => setCategory("")}>
            Alle
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={`chip ${category === c ? "is-active" : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="toolbar__right">
          <input
            type="search"
            placeholder="Suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Produkte suchen"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sortierung">
            <option value="RELEVANCE">Empfohlen</option>
            <option value="PRICE_ASC">Preis aufsteigend</option>
            <option value="PRICE_DESC">Preis absteigend</option>
            <option value="NAME">Name A–Z</option>
          </select>
        </div>
      </div>

      {error && <ErrorBox>{error}</ErrorBox>}
      {!products && !error && <Loading />}
      {products && products.length === 0 && <p className="muted">Keine Produkte gefunden.</p>}

      <div className="grid">
        {products?.map((p) => {
          const soldOut = inCart(p) >= maxQuantity(p);
          return (
            <article key={p.id} className="card">
              <Link to={`/produkt/${p.slug}`} className="card__link">
                <ProductTile product={p} />
                <h2>{p.name}</h2>
                <p className="muted">{p.shortDescription}</p>
              </Link>
              <div className="card__meta">
                <strong className="price">{formatPrice(p.priceCents)}</strong>
                <StockBadge stock={p.stock} />
              </div>
              <button type="button" className="btn btn--block" onClick={() => add(p)} disabled={soldOut}>
                {added === p.id ? "✓ Hinzugefügt" : p.stock === 0 ? "Ausverkauft" : "In den Warenkorb"}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
