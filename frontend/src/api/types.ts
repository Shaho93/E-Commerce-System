export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  stock: number;
  emoji: string;
  color: string;
}

export type Sort = "RELEVANCE" | "PRICE_ASC" | "PRICE_DESC" | "NAME";

export type PaymentMethod = "PAYPAL" | "INVOICE";

export type OrderStatus = "CREATED" | "PAID" | "SHIPPED" | "CANCELLED";

export interface OrderLine {
  productId: number;
  productName: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  street: string;
  zip: string;
  city: string;
  paymentMethod: PaymentMethod;
  paymentReference: string | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
  items: OrderLine[];
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  street: string;
  zip: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: { productId: number; quantity: number }[];
}

/** Fehler der API im Format „Problem Details“ (RFC 9457) */
export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/** Schnittstelle, die sowohl das echte Backend als auch die Browser-Demo erfüllen */
export interface ShopApi {
  readonly mode: "demo" | "backend";
  listProducts(params: { category?: string; q?: string; sort?: Sort }): Promise<Product[]>;
  getProduct(slug: string): Promise<Product>;
  categories(): Promise<string[]>;
  createOrder(request: CreateOrderRequest, idempotencyKey: string): Promise<Order>;
  getOrder(orderNumber: string): Promise<Order>;
  /** nur Demo: Bestand und Bestellungen zurücksetzen */
  reset?(): void;
}
