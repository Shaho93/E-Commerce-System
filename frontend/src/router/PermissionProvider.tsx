import type { ReactNode } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function PermissionProvider({ children }: Props) {
  const { user } = useContext(AuthContext);

  if (!user) {
      return <Navigate to="/login" replace />;
  }

  return children;
}
