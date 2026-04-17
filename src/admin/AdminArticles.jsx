import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { adminFetch } from "./api.js";
import { useAdminData } from "./AdminContext.jsx";

export default function AdminArticles() {
  const { data, reload } = useAdminData();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allCategories = useMemo(() => {
    const set = new Set();
    for (const a of data?.articles || []) {
      for (const c of a.categories || []) {
        if (c) set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data?.articles]);

  async function remove(slug) {
    if (!window.confirm(`Delete article “${slug}”? This cannot be undone.`)) return;
    setMsg(null);
    setErr(null);
    try {
      await adminFetch(`/articles/${encodeURIComponent(slug)}`, { method: "DELETE" });
      setMsg("Deleted.");
      await reload();
    } catch (e) {
      setErr(e.message);
    }
  }

  let articles = data?.articles ? [...data.articles] : [];
  articles.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  if (categoryFilter !== "all") {
    articles = articles.filter((a) => (a.categories || []).includes(categoryFilter));
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Articles</h1>
        <Link className="admin-btn admin-btn--primary" to="/admin/articles/new">
          New article
        </Link>
      </div>
      <p className="admin-hint">
        The <strong>homepage photo grid</strong> uses <Link to="/admin/mosaic">Home mosaic</Link> (five article
        slugs). Each tile shows that article&apos;s <strong>Image URL</strong> from the article editor—change the
        picture there, or pick different articles in Mosaic.
      </p>
      <div className="admin-toolbar admin-toolbar--filters">
        <label className="admin-filter">
          <span className="admin-filter__label">Category</span>
          <select
            className="admin-filter__select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="admin-hint" style={{ margin: 0 }}>
          Showing <strong>{articles.length}</strong> article{articles.length === 1 ? "" : "s"}
          {categoryFilter !== "all" ? ` in “${categoryFilter}”` : ""}.
        </span>
      </div>
      {msg && (
        <p className="admin-msg admin-msg--ok" role="status">
          {msg}
        </p>
      )}
      {err && (
        <p className="admin-msg admin-msg--err" role="alert">
          {err}
        </p>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table__th-narrow">Image</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Categories</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.slug}>
                <td className="admin-table__td-thumb">
                  {a.image ? (
                    <img className="admin-thumb" src={a.image} alt="" loading="lazy" />
                  ) : (
                    <div className="admin-thumb admin-thumb--empty" title="No image URL on this article">
                      —
                    </div>
                  )}
                </td>
                <td>{a.title}</td>
                <td>
                  <code>{a.slug}</code>
                </td>
                <td>{(a.categories || []).join(", ")}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link className="admin-btn" to={`/admin/articles/${encodeURIComponent(a.slug)}`}>
                    Edit
                  </Link>{" "}
                  <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(a.slug)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
