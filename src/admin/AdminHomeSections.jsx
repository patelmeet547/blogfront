import { useEffect, useState } from "react";
import { adminFetch } from "./api.js";
import { useAdminData } from "./AdminContext.jsx";

const LAYOUTS = [
  { value: "inverse", label: "Inverse (dark band + pill)" },
  { value: "intro", label: "Intro line only" },
  { value: "tan", label: "Tan heading" },
];

export default function AdminHomeSections() {
  const { data, reload } = useAdminData();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.homeSections) {
      setRows(
        data.homeSections.map((s) => ({
          id: s.id || "",
          title: s.title || "",
          subtitle: s.subtitle || "",
          category: s.category || "",
          layout: s.layout || "inverse",
        }))
      );
    }
  }, [data]);

  function update(i, patch) {
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  async function save() {
    setErr(null);
    setOk(null);
    setSaving(true);
    try {
      await adminFetch("/home-sections", { method: "PUT", body: JSON.stringify(rows) });
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
        <h1>Home sections</h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-btn"
            onClick={() =>
              setRows((r) => [
                ...r,
                {
                  id: `section-${r.length + 1}`,
                  title: "New section",
                  subtitle: "",
                  category: "culture",
                  layout: "inverse",
                },
              ])
            }
          >
            Add section
          </button>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save sections"}
          </button>
        </div>
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
        <strong>Category</strong> must match article <code>categories</code> values so the carousel pulls the right
        stories.
      </p>
      <div className="admin-table-wrap admin-table-wrap--editable" style={{ marginTop: "1rem" }}>
        <table className="admin-table admin-table--editable">
          <thead>
            <tr>
              <th scope="col" className="admin-table__col-id">
                ID
              </th>
              <th scope="col" className="admin-table__col-title">
                Title
              </th>
              <th scope="col" className="admin-table__col-subtitle">
                Subtitle
              </th>
              <th scope="col" className="admin-table__col-cat">
                Category
              </th>
              <th scope="col" className="admin-table__col-layout">
                Layout
              </th>
              <th scope="col" className="admin-table__col-actions">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="admin-table-input"
                    value={row.id}
                    onChange={(e) => update(i, { id: e.target.value })}
                    placeholder="e.g. culture"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </td>
                <td>
                  <input
                    className="admin-table-input"
                    value={row.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    placeholder="Section title"
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    className="admin-table-input"
                    value={row.subtitle}
                    onChange={(e) => update(i, { subtitle: e.target.value })}
                    placeholder="Subtitle / intro line"
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    className="admin-table-input"
                    value={row.category}
                    onChange={(e) => update(i, { category: e.target.value })}
                    placeholder="e.g. culture"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </td>
                <td>
                  <select
                    className="admin-table-select"
                    value={row.layout}
                    onChange={(e) => update(i, { layout: e.target.value })}
                  >
                    {LAYOUTS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="admin-table__td-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--compact"
                    onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
                  >
                    Remove
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
