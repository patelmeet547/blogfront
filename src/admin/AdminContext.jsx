import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "./api.js";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await adminFetch("/bootstrap");
      setData(d);
    } catch (e) {
      if (e.code === "UNAUTHORIZED") {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(e.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = { data, loading, error, reload };
  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData outside provider");
  return ctx;
}
