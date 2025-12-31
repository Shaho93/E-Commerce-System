import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Products from "../pages/products/Products";
import Login from "../pages/login/Login";
import PermissionProvider from "./PermissionProvider";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <PermissionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </PermissionProvider>
    </BrowserRouter>
  );
}
