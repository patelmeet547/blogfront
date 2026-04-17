import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "./api.js";
import { AdminDataProvider, useAdminData } from "./AdminContext.jsx";
import "./admin.css";

function AdminShell() {
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminDataProvider>
      <AdminFrame />
    </AdminDataProvider>
  );
}

function AdminFrame() {
  const { loading, error, reload } = useAdminData();
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__brand">Counterbalance Admin</p>
        <nav className="admin-nav">
          <NavLink
            end
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/articles"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Articles
          </NavLink>
          <NavLink
            to="/admin/navigation"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Navigation
          </NavLink>
          <NavLink
            to="/admin/home-sections"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Home sections
          </NavLink>
          <NavLink
            to="/admin/mosaic"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Home mosaic
          </NavLink>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <a href="/" className="admin-btn" style={{ width: "100%", textAlign: "center" }}>
            View site
          </a>
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            style={{ width: "100%", marginTop: "0.5rem" }}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        {loading && <p className="admin-hint">Loading data…</p>}
        {error && (
          <div className="admin-msg admin-msg--err" style={{ marginBottom: "1rem" }}>
            {error}{" "}
            <button type="button" className="admin-btn" onClick={() => reload()}>
              Retry
            </button>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return <AdminShell />;
}
