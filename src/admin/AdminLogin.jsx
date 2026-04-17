import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { adminLogin } from "./api.js";
import "./admin.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await adminLogin(password);
      navigate(from, { replace: true });
    } catch (ex) {
      setErr(ex.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Admin</h1>
        <p>
          Password: <strong>admin</strong> (unless <code>ADMIN_PASSWORD</code> is set on the server).
          In dev, the API should show <code>API listening on http://localhost:3041</code>—if login fails,
          the server is not running (check the terminal).
        </p>
        <form className="admin-form" onSubmit={onSubmit} style={{ maxWidth: "none" }}>
          {err && (
            <div className="admin-msg admin-msg--err" role="alert">
              {err}
            </div>
          )}
          <div className="admin-field">
            <label htmlFor="admin-pw">Password</label>
            <input
              id="admin-pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ marginTop: "1.25rem", marginBottom: 0, fontSize: "0.85rem" }}>
          <Link to="/" style={{ color: "#b8b8b8" }}>
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
