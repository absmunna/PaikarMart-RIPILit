import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

const apiBase =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
    : "";
if (apiBase) {
  setBaseUrl(apiBase);
}

// Theme is now controlled by <ThemeProvider> (reads localStorage). We seed
// "dark" pre-mount so first paint isn't a flash of unstyled light.
if (typeof document !== "undefined") {
  try {
    const stored = window.localStorage.getItem("pm.theme.v1");
    const cls = stored && ["dark", "light"].includes(stored) ? stored : "dark";
    document.documentElement.classList.add(cls);
  } catch {
    document.documentElement.classList.add("dark");
  }
}

createRoot(document.getElementById("root")!).render(<App />);
