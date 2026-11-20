import { demoApi } from "./demo";
import { createHttpApi } from "./http";
import type { ShopApi } from "./types";

// Mit VITE_API_URL spricht das Frontend mit dem Spring-Boot-Backend, ohne läuft die Browser-Demo.
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export const api: ShopApi = apiUrl ? createHttpApi(apiUrl) : demoApi;
