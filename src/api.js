import { apiUrl } from "./apiBase.js";

export async function fetchJson(path) {
  const res = await fetch(apiUrl(path));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function getHome() {
  return fetchJson("/api/home");
}

export function getArticles(params = {}) {
  const q = new URLSearchParams(params).toString();
  return fetchJson(`/api/articles${q ? `?${q}` : ""}`);
}

export function getArticle(slug) {
  return fetchJson(`/api/articles/${encodeURIComponent(slug)}`);
}

export function subscribe(email) {
  return fetch(apiUrl("/api/subscribe"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Subscribe failed");
    return data;
  });
}
