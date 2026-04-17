const RAW_API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "";
const API_ORIGIN = RAW_API_ORIGIN.replace(/\/+$/, "");

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_ORIGIN ? `${API_ORIGIN}${normalizedPath}` : normalizedPath;
}
