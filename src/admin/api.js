const TOKEN_KEY = "cb_admin_token";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch(path, opts = {}) {
  const token = getToken();
  const headers = {
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`/api/admin${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearToken();
    const err = new Error("Session expired. Please sign in again.");
    err.code = "UNAUTHORIZED";
    throw err;
  }
  if (!res.ok) throw new Error(data.error || res.statusText || "Request failed");
  return data;
}

export async function adminLogin(password) {
  let res;
  try {
    res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  } catch {
    throw new Error(
      "Cannot reach the API. Restart npm run dev and check the server line “API listening…”. Dev uses port 3041 (see client/.env.development). Password: admin."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Login failed");
  setToken(data.token);
  return data;
}
