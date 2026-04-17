import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminFetch, getToken } from "./api.js";
import { apiUrl } from "../apiBase.js";
import { useAdminData } from "./AdminContext.jsx";

const empty = {
  slug: "",
  title: "",
  author: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  excerpt: "",
  body: "",
  categories: "",
  image: "",
};

export default function AdminArticleEdit() {
  const { slug: slugParam } = useParams();
  const isNew = slugParam === "new";
  const navigate = useNavigate();
  const { data, reload } = useAdminData();
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);

  useEffect(() => {
    if (!data) return;
    if (isNew) {
      setForm(empty);
      return;
    }
    const a = data.articles.find((x) => x.slug === slugParam);
    if (!a) {
      setErr("Article not found.");
      return;
    }
    setErr(null);
    setForm({
      slug: a.slug,
      title: a.title,
      author: a.author,
      publishedAt: a.publishedAt?.slice(0, 10) || "",
      excerpt: a.excerpt,
      body: a.body,
      categories: (a.categories || []).join(", "),
      image: a.image || "",
    });
  }, [data, slugParam, isNew]);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadErr(null);
    setUploading(true);
    const token = getToken();
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(apiUrl("/api/admin/upload"), {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("image", data.url);
    } catch (ex) {
      setUploadErr(ex.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    const categories = form.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const payload = {
      slug: form.slug.trim().toLowerCase(),
      title: form.title.trim(),
      author: form.author.trim(),
      publishedAt: form.publishedAt.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body,
      categories,
      image: form.image.trim() || null,
    };
    setSaving(true);
    try {
      if (isNew) {
        await adminFetch("/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(`/articles/${encodeURIComponent(slugParam)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      setOk("Saved.");
      await reload();
      if (isNew || payload.slug !== slugParam) {
        navigate(`/admin/articles/${encodeURIComponent(payload.slug)}`, { replace: true });
      }
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>{isNew ? "New article" : "Edit article"}</h1>
        <Link className="admin-btn" to="/admin/articles">
          ← All articles
        </Link>
      </div>
      {err && (
        <p className="admin-msg admin-msg--err" role="alert">
          {err}
        </p>
      )}
      {ok && (
        <p className="admin-msg admin-msg--ok" role="status">
          {ok}
        </p>
      )}
      <form className="admin-form" onSubmit={save}>
        <div className="admin-field">
          <label htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            disabled={!isNew}
            title="Lowercase letters, numbers, hyphens"
          />
          <p className="admin-hint">Cannot be changed after create (delete and re-add to rename).</p>
        </div>
        <div className="admin-field">
          <label htmlFor="title">Title</label>
          <input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div className="admin-field">
          <label htmlFor="author">Author</label>
          <input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} required />
        </div>
        <div className="admin-field">
          <label htmlFor="publishedAt">Published date</label>
          <input
            id="publishedAt"
            type="date"
            value={form.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="categories">Categories</label>
          <input
            id="categories"
            value={form.categories}
            onChange={(e) => set("categories", e.target.value)}
            placeholder="featured, culture, arts-education"
            required
          />
          <p className="admin-hint">Comma-separated. Use <code>featured</code> for homepage hero list.</p>
        </div>
        <div className="admin-field">
          <label htmlFor="image">Image URL</label>
          <p className="admin-hint">
            Paste any image URL, or use <strong>Upload image</strong> — files are saved under{" "}
            <code>server/uploads/</code> on the machine running the API, and this field is set to{" "}
            <code>/uploads/your-file.jpg</code> (served at the same host as the site).
          </p>
          <div className="admin-image-row">
            <input
              id="image"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://… or /uploads/…"
            />
            <input
              id="article-image-file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
              className="sr-only"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <label
              htmlFor="article-image-file"
              className={`admin-btn${uploading ? " admin-btn--disabled" : ""}`}
              style={{ cursor: uploading ? "wait" : "pointer", flexShrink: 0 }}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </label>
          </div>
          {uploadErr && (
            <p className="admin-msg admin-msg--err" style={{ marginTop: "0.5rem" }} role="alert">
              {uploadErr}
            </p>
          )}
          {form.image ? (
            <div className="admin-image-preview">
              <img src={form.image} alt="" />
            </div>
          ) : null}
        </div>
        <div className="admin-field">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} required />
        </div>
        <div className="admin-field">
          <label htmlFor="body">Body (HTML allowed)</label>
          <textarea
            id="body"
            className="admin-textarea--lg"
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </>
  );
}
