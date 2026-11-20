import type { ReactNode } from "react";

export function Loading() {
  return <p className="muted">Wird geladen …</p>;
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <div className="error" role="alert">
      {children}
    </div>
  );
}
