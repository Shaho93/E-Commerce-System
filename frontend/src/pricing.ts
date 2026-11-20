// Preisregeln wie im Backend (PricingRules.java)
export const SHIPPING_CENTS = 490;
export const FREE_SHIPPING_FROM_CENTS = 4900;
export const MAX_QUANTITY_PER_ITEM = 10;

export function shippingFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;
}

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export function formatPrice(cents: number): string {
  return euro.format(cents / 100);
}
