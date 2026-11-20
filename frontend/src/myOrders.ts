// Bestellnummern dieses Browsers (Gast-Bestellungen ohne Kundenkonto)
const KEY = "kindi-shop-my-orders";

export function myOrderNumbers(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function rememberOrder(orderNumber: string): void {
  try {
    const list = [orderNumber, ...myOrderNumbers().filter((n) => n !== orderNumber)].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignorieren
  }
}

export function forgetOrders(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignorieren
  }
}
