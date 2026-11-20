import { seedProducts } from "../data/products";
import { MAX_QUANTITY_PER_ITEM, shippingFor } from "../pricing";
import { ApiError, type CreateOrderRequest, type Order, type Product, type ShopApi, type Sort } from "./types";

// Browser-Demo: verhält sich wie das Spring-Boot-Backend, speichert aber nur im localStorage des Besuchers.
const STOCK_KEY = "kindi-shop-stock";
const ORDERS_KEY = "kindi-shop-orders";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // z. B. privater Modus: Demo läuft dann ohne Speichern weiter
  }
}

const memory: { stock: Record<number, number>; orders: Order[] } = {
  stock: load<Record<number, number>>(STOCK_KEY, {}),
  orders: load<Order[]>(ORDERS_KEY, []),
};

function withStock(p: Product): Product {
  const stock = memory.stock[p.id];
  return stock === undefined ? { ...p } : { ...p, stock };
}

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function orderNumber(): string {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `KI-${date}-${suffix}`;
}

function validate(req: CreateOrderRequest): void {
  const fields: Record<string, string> = {};
  if (!req.customerName.trim()) fields.customerName = "Bitte Namen angeben";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.customerEmail.trim())) fields.customerEmail = "Bitte gültige E-Mail angeben";
  if (!req.street.trim()) fields.street = "Bitte Straße und Hausnummer angeben";
  if (!/^\d{5}$/.test(req.zip.trim())) fields.zip = "PLZ muss 5 Ziffern haben";
  if (!req.city.trim()) fields.city = "Bitte Ort angeben";
  if (Object.keys(fields).length > 0) throw new ApiError(400, "Bitte prüfen Sie die markierten Felder.", fields);
  if (req.items.length === 0) throw new ApiError(400, "Der Warenkorb ist leer.");
}

export const demoApi: ShopApi = {
  mode: "demo",

  async listProducts({ category, q, sort }: { category?: string; q?: string; sort?: Sort }) {
    await delay(150);
    const query = (q ?? "").trim().toLowerCase();
    const list = seedProducts
      .map(withStock)
      .filter((p) => !category || p.category === category)
      .filter((p) => !query || p.name.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query));
    switch (sort) {
      case "PRICE_ASC":
        return list.sort((a, b) => a.priceCents - b.priceCents);
      case "PRICE_DESC":
        return list.sort((a, b) => b.priceCents - a.priceCents);
      case "NAME":
        return list.sort((a, b) => a.name.localeCompare(b.name, "de"));
      default:
        return list;
    }
  },

  async getProduct(slug: string) {
    await delay(100);
    const p = seedProducts.find((x) => x.slug === slug);
    if (!p) throw new ApiError(404, `Produkt „${slug}“ wurde nicht gefunden.`);
    return withStock(p);
  },

  async categories() {
    return [...new Set(seedProducts.map((p) => p.category))];
  },

  async createOrder(req: CreateOrderRequest, idempotencyKey: string) {
    await delay(600);
    const existing = memory.orders.find((o) => (o as Order & { key?: string }).key === idempotencyKey);
    if (existing) return existing;
    validate(req);

    // gleiche Artikel zusammenfassen
    const quantities = new Map<number, number>();
    for (const item of req.items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);

    const lines = [...quantities].map(([productId, quantity]) => {
      const product = seedProducts.map(withStock).find((p) => p.id === productId);
      if (!product) throw new ApiError(404, `Produkt mit ID ${productId} wurde nicht gefunden.`);
      if (quantity > MAX_QUANTITY_PER_ITEM) throw new ApiError(400, `Höchstens ${MAX_QUANTITY_PER_ITEM} Stück pro Artikel.`);
      if (quantity > product.stock) {
        throw new ApiError(
          409,
          product.stock === 0
            ? `„${product.name}“ ist leider ausverkauft.`
            : `Von „${product.name}“ sind nur noch ${product.stock} Stück verfügbar.`,
        );
      }
      return { product, quantity };
    });

    // erst wenn alles passt, Bestand reduzieren (wie die Transaktion im Backend)
    for (const { product, quantity } of lines) memory.stock[product.id] = product.stock - quantity;

    const subtotalCents = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
    const shippingCents = shippingFor(subtotalCents);
    const order: Order & { key: string } = {
      key: idempotencyKey,
      orderNumber: orderNumber(),
      status: "PAID",
      customerName: req.customerName.trim(),
      customerEmail: req.customerEmail.trim(),
      street: req.street.trim(),
      zip: req.zip.trim(),
      city: req.city.trim(),
      paymentMethod: req.paymentMethod,
      paymentReference: `SIM-${req.paymentMethod}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      createdAt: new Date().toISOString(),
      items: lines.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        unitPriceCents: product.priceCents,
        quantity,
        lineTotalCents: product.priceCents * quantity,
      })),
    };
    memory.orders.unshift(order);
    save(STOCK_KEY, memory.stock);
    save(ORDERS_KEY, memory.orders);
    return order;
  },

  async getOrder(orderNumber: string) {
    await delay(100);
    const order = memory.orders.find((o) => o.orderNumber === orderNumber);
    if (!order) throw new ApiError(404, `Bestellung ${orderNumber} wurde nicht gefunden.`);
    return order;
  },

  reset() {
    memory.stock = {};
    memory.orders = [];
    save(STOCK_KEY, memory.stock);
    save(ORDERS_KEY, memory.orders);
  },
};
