import { useEffect, useState } from "react";
import { adminFetch } from "./api.js";
import { useAdminData } from "./AdminContext.jsx";

function rowFromItem(item) {
  return {
    label: item.label || "",
    to: item.to || "",
    external: Boolean(item.external),
  };
}

export default function AdminNavigation() {
  const { data, reload } = useAdminData();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.navigation) setRows(data.navigation.map(rowFromItem));
  }, [data]);

  function update(i, patch) {
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  async function save() {
    setErr(null);
    setOk(null);
    setSaving(true);
    try {
      const payload = rows.map((r) => ({
        label: r.label.trim(),
        to: r.to.trim(),
        ...(r.external ? { external: true } : {}),
      }));
      await adminFetch("/navigation", { method: "PUT", body: JSON.stringify(payload) });
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
        <h1>Navigation</h1>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-btn"
            onClick={() => setRows((r) => [...r, { label: "", to: "/", external: false }])}
          >
            Add link
          </button>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save navigation"}
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
        Match the public header: keep <strong>Donate</strong> as the last item with <strong>External</strong> checked
        for off-site URLs.
      </p>
      <div className="admin-table-wrap admin-table-wrap--editable" style={{ marginTop: "1rem" }}>
        <table className="admin-table admin-table--editable">
          <thead>
            <tr>
              <th scope="col" className="admin-table__col-label">
                Label
              </th>
              <th scope="col" className="admin-table__col-path">
                Path or URL
              </th>
              <th scope="col" className="admin-table__col-external">
                External
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
                    value={row.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    placeholder="e.g. Home"
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    className="admin-table-input"
                    value={row.to}
                    onChange={(e) => update(i, { to: e.target.value })}
                    placeholder="/path or https://…"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </td>
                <td className="admin-table__td-external">
                  <label className="admin-check-cell" title="Use for off-site links (e.g. Donate)">
                    <input
                      type="checkbox"
                      checked={row.external}
                      onChange={(e) => update(i, { external: e.target.checked })}
                    />
                  </label>
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
