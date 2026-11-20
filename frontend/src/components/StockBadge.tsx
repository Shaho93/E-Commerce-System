export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="badge badge--out">Ausverkauft</span>;
  if (stock <= 5) return <span className="badge badge--low">Nur noch {stock} Stück</span>;
  return <span className="badge badge--ok">Auf Lager</span>;
}
