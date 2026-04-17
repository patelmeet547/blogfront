import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CookieBanner from "./CookieBanner.jsx";

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      const path = `${location.pathname}${location.search}`;
      if (path.startsWith("/admin")) return;
      fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
        keepalive: true,
      }).catch(() => {});
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [location.pathname, location.search]);

  return null;
}

export default function Layout() {
  return (
    <div className="page">
      <PageViewTracker />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
