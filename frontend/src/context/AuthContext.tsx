import { createContext } from "react";

export interface AuthContextType {
  user: any;
}

export const AuthContext = createContext<AuthContextType>({
  user: null
});
