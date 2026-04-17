import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "./api.js";
import { useAdminData } from "./AdminContext.jsx";

const SLOT_LABELS = [
  "Top left",
  "Bottom left",
  "Center (large)",
  "Top right",
  "Bottom right",
];

export default function AdminMosaic() {
  const { data, reload } = useAdminData();
  const [text, setText] = useState("");
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.homeMosaicSlugs) setText(data.homeMosaicSlugs.join("\n"));
  }, [data]);

  const previewRows = useMemo(() => {
    const lines = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    const bySlug = new Map((data?.articles || []).map((a) => [a.slug, a]));
    return SLOT_LABELS.map((label, i) => {
      const slug = lines[i] || "";
      const article = slug ? bySlug.get(slug) : null;
      return { label, slug, article };
    });
  }, [text, data?.articles]);

  async function save() {
    setErr(null);
    setOk(null);
    const slugs = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    setSaving(true);
    try {
      await adminFetch("/mosaic", { method: "PUT", body: JSON.stringify(slugs) });
      setOk("Saved.");
      await reload();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <h1>Home mosaic</h1>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save mosaic order"}
        </button>
      </div>
      {ok && (
        <p className="admin-msg admin-msg--ok" role="status">
          {ok}
        </p>
      )}
      {err && (
        <p className="admin-msg admin-msg--err" role="alert">
          {err}
        </p>
      )}
      <p className="admin-hint">
        This is what fills the <strong>five-cell image grid</strong> under the hero on the home page. Each line is an
        article <strong>slug</strong>. The <strong>image</strong> for each cell is that article&apos;s{" "}
        <strong>Image URL</strong> (edit the article to change the photo).
      </p>

      <section className="admin-dash__panel" style={{ marginTop: "1rem" }}>
        <div className="admin-dash__panel-head">
          <h2>Preview (from textarea below)</h2>
          <span className="admin-dash__panel-sub">Matches public layout: left column → center → right column</span>
        </div>
        <div className="admin-mosaic-mini" aria-hidden="true">
          <div className="admin-mosaic-mini__grid">
            {previewRows.map((row, i) => (
              <div
                key={row.label}
                className={`admin-mosaic-mini__cell admin-mosaic-mini__cell--${["a", "b", "c", "d", "e"][i]}`}
              >
                {row.article?.image ? (
                  <img src={row.article.image} alt="" />
                ) : (
                  <div className="admin-mosaic-mini__placeholder">
                    {row.slug ? "No image" : "Empty"}
                  </div>
                )}
                <span className="admin-mosaic-mini__badge">{row.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="admin-table-wrap" style={{ marginTop: "1.25rem" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table__th-narrow">Display</th>
              <th>Slot</th>
              <th>Slug</th>
              <th>Linked title</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row) => (
              <tr key={row.label}>
                <td className="admin-table__td-thumb">
                  {row.article?.image ? (
                    <img className="admin-thumb admin-thumb--wide" src={row.article.image} alt="" loading="lazy" />
                  ) : (
                    <div className="admin-thumb admin-thumb--empty admin-thumb--wide" title="Set Image URL on article">
                      —
                    </div>
                  )}
                </td>
                <td>{row.label}</td>
                <td>{row.slug ? <code>{row.slug}</code> : <span className="admin-hint">—</span>}</td>
                <td>{row.article?.title ?? (row.slug ? <em className="admin-hint">Unknown slug</em> : "—")}</td>
                <td>
                  {row.slug && row.article ? (
                    <Link className="admin-btn" to={`/admin/articles/${encodeURIComponent(row.slug)}`}>
                      Edit image & text
                    </Link>
                  ) : row.slug ? null : (
                    <span className="admin-hint">Add slug in list</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-field" style={{ marginTop: "1.25rem", maxWidth: 520 }}>
        <label htmlFor="mosaic">Slugs (one per line, max 5)</label>
        <textarea
          id="mosaic"
          className="admin-textarea--lg"
          style={{ minHeight: 200 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"vlatz-world-massive\nyour-slug-here\n…"}
        />
      </div>
      <p className="admin-hint">
        Tip: use the <strong>Articles</strong> list (with category filter) to find slugs; paste them here in order.
      </p>
    </>
  );
}
