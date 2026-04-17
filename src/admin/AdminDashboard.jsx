import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminData } from "./AdminContext.jsx";
import { adminFetch } from "./api.js";
import "./admin.css";

export default function AdminDashboard() {
  const { data } = useAdminData();
  const [analytics, setAnalytics] = useState(null);
  const [aErr, setAErr] = useState(null);

  useEffect(() => {
    adminFetch("/analytics")
      .then(setAnalytics)
      .catch((e) => setAErr(e.message));
  }, []);

  const nArticles = data?.articles?.length ?? 0;
  const nNav = data?.navigation?.length ?? 0;
  const nSections = data?.homeSections?.length ?? 0;
  const nMosaic = data?.homeMosaicSlugs?.length ?? 0;
  const featuredCount =
    data?.articles?.filter((a) => a.categories?.includes("featured")).length ?? 0;

  return (
    <>
      <div className="admin-toolbar">
        <h1>Dashboard</h1>
        <Link className="admin-btn admin-btn--primary" to="/admin/articles">
          Edit articles
        </Link>
      </div>
      <p className="admin-hint admin-dash__intro">
        Changes save to <code>server/data/store.json</code>. Public page views are counted when
        visitors browse the site (admin routes are excluded).
      </p>

      {aErr && (
        <p className="admin-msg admin-msg--err" style={{ marginBottom: "1rem" }}>
          {aErr}
        </p>
      )}

      <div className="admin-dash__cards">
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Total page views</span>
          <span className="admin-stat-card__value">{analytics?.totalPageViews ?? "—"}</span>
          <span className="admin-stat-card__hint">All time · stored in JSON</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Page views today</span>
          <span className="admin-stat-card__value">{analytics?.todayViews ?? "—"}</span>
          <span className="admin-stat-card__hint">By UTC calendar day</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Last 7 days</span>
          <span className="admin-stat-card__value">{analytics?.weekViews ?? "—"}</span>
          <span className="admin-stat-card__hint">Rolling 7-day sum</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__label">Featured posts</span>
          <span className="admin-stat-card__value">{featuredCount}</span>
          <span className="admin-stat-card__hint">Articles with “featured” tag</span>
        </div>
      </div>

      <section className="admin-dash__panel">
        <div className="admin-dash__panel-head">
          <h2>Traffic · last 14 days</h2>
        </div>
        <div className="admin-dash__chart">
          {analytics?.series14?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.series14} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" tick={{ fill: "#888", fontSize: 10 }} interval={1} height={36} />
                <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 11 }} width={36} />
                <Tooltip
                  contentStyle={{
                    background: "#141414",
                    border: "1px solid #333",
                    borderRadius: 8,
                    color: "#eaeaea",
                  }}
                  labelStyle={{ color: "#ccc" }}
                />
                <Bar dataKey="views" fill="#f5e400" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="admin-hint">No chart data yet. Open the public site in another tab to record views.</p>
          )}
        </div>
      </section>

      <div className="admin-dash__grid2">
        <section className="admin-dash__panel">
          <div className="admin-dash__panel-head">
            <h2>Content snapshot</h2>
          </div>
          <ul className="admin-dash__list">
            <li>
              <strong>{nArticles}</strong> articles
            </li>
            <li>
              <strong>{nNav}</strong> nav links
            </li>
            <li>
              <strong>{nSections}</strong> home sections
            </li>
            <li>
              <strong>{nMosaic}</strong> mosaic slots
            </li>
          </ul>
        </section>

        <section className="admin-dash__panel">
          <div className="admin-dash__panel-head">
            <h2>Recent visits</h2>
            <span className="admin-dash__panel-sub">Latest paths</span>
          </div>
          {!analytics?.recent?.length ? (
            <p className="admin-hint">No visits recorded yet.</p>
          ) : (
            <ul className="admin-dash__recent">
              {analytics.recent.map((row, i) => (
                <li key={`${row.at}-${i}`}>
                  <code>{row.path}</code>
                  <time dateTime={row.at}>
                    {new Date(row.at).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="admin-dash__panel admin-dash__panel--actions">
        <div className="admin-dash__panel-head">
          <h2>Quick actions</h2>
        </div>
        <div className="admin-dash__actions">
          <Link className="admin-btn" to="/admin/articles">
            Articles
          </Link>
          <Link className="admin-btn" to="/admin/navigation">
            Navigation
          </Link>
          <Link className="admin-btn" to="/admin/home-sections">
            Home sections
          </Link>
          <Link className="admin-btn" to="/admin/mosaic">
            Mosaic
          </Link>
          <a className="admin-btn" href="/" target="_blank" rel="noreferrer">
            Open site ↗
          </a>
        </div>
      </section>
    </>
  );
}
