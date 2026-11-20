import { ApiError, type CreateOrderRequest, type Order, type Product, type ShopApi, type Sort } from "./types";

// Verbindung zum Spring-Boot-Backend
export function createHttpApi(baseUrl: string): ShopApi {
  const base = baseUrl.replace(/\/$/, "");

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(base + path, init);
    } catch {
      throw new ApiError(0, "Der Server ist gerade nicht erreichbar.");
    }
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { detail?: string; fields?: Record<string, string> } | null;
      throw new ApiError(response.status, body?.detail ?? "Unbekannter Fehler.", body?.fields ?? {});
    }
    return (await response.json()) as T;
  }

  return {
    mode: "backend",
    listProducts({ category, q, sort }: { category?: string; q?: string; sort?: Sort }) {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q) params.set("q", q);
      if (sort) params.set("sort", sort);
      return request<Product[]>(`/api/products?${params}`);
    },
    getProduct: (slug: string) => request<Product>(`/api/products/${encodeURIComponent(slug)}`),
    categories: () => request<string[]>("/api/categories"),
    createOrder: (body: CreateOrderRequest, idempotencyKey: string) =>
      request<Order>("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(body),
      }),
    getOrder: (orderNumber: string) => request<Order>(`/api/orders/${encodeURIComponent(orderNumber)}`),
  };
}
