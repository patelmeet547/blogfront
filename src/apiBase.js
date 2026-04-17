const DEFAULT_PROD_API_ORIGIN = "https://server-six-mu-60.vercel.app";

function resolveApiOrigin() {
  const fromEnv = (import.meta.env.VITE_API_ORIGIN || "").trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  // In local dev, Vite proxy should handle /api and /uploads on same origin.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalHost = host === "localhost" || host === "127.0.0.1";
    if (isLocalHost) return "";
  }

  // Production fallback so frontend still works without env wiring.
  return DEFAULT_PROD_API_ORIGIN;
}

const API_ORIGIN = resolveApiOrigin();

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_ORIGIN ? `${API_ORIGIN}${normalizedPath}` : normalizedPath;
}
