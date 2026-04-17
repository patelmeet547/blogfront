import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { fetchJson } from "../api.js";
import "./Header.css";

function linkTone(item) {
  if (item.tone === "light" || item.tone === "gold") return item.tone;
  const light = ["Home", "Counterbalance?", "About", "Donate"];
  return light.includes(item.label) ? "light" : "gold";
}

function NavItem({ item, onNavigate, tone }) {
  const cls = ({ isActive }) =>
    `primary-nav__link primary-nav__link--${tone}${isActive ? " is-active" : ""}`;

  if (item.external) {
    return (
      <a
        href={item.to}
        className={`primary-nav__link primary-nav__link--${tone}`}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }

  if (item.to.startsWith("/articles?")) {
    return (
      <NavLink to={item.to} className={cls} onClick={onNavigate}>
        {item.label}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={cls}
      end={item.to === "/"}
      onClick={onNavigate}
    >
      {item.label}
    </NavLink>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState([]);

  useEffect(() => {
    fetchJson("/api/navigation")
      .then(setNav)
      .catch(() =>
        setNav([
          { label: "Home", to: "/" },
          { label: "About", to: "/about" },
        ])
      );
  }, []);

  const { home, donate, topRow } = useMemo(() => {
    const donateItem = nav.find((i) => i.label === "Donate");
    const withoutDonate = nav.filter((i) => i.label !== "Donate");
    const homeItem = withoutDonate.find((i) => i.label === "Home") ?? null;
    let top = withoutDonate.filter((i) => i.label !== "Home");
    if (!homeItem && donateItem) top = [...top, donateItem];
    return {
      home: homeItem,
      donate: donateItem,
      topRow: top,
    };
  }, [nav]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-logo" onClick={close}>
          <span className="site-logo__the" aria-hidden="true">
            The
          </span>
          <span className="site-logo__main">Counterbalance</span>
          <span className="sr-only">The Counterbalance — home</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="nav-toggle__bars" aria-hidden />
        </button>
        <nav
          id="primary-nav"
          className={`primary-nav ${open ? "primary-nav--open" : ""}`}
          aria-label="Primary"
        >
          <div className="primary-nav__desktop">
            {home && (
              <div className="primary-nav__stack">
                <NavItem item={home} onNavigate={close} tone={linkTone(home)} />
                {donate && (
                  <NavItem item={donate} onNavigate={close} tone={linkTone(donate)} />
                )}
              </div>
            )}
            <ul className="primary-nav__top-row">
              {topRow.map((item) => (
                <li key={item.label}>
                  <NavItem item={item} onNavigate={close} tone={linkTone(item)} />
                </li>
              ))}
            </ul>
          </div>
          <ul className="primary-nav__mobile-list">
            {nav.map((item) => (
              <li key={item.label}>
                <NavItem item={item} onNavigate={close} tone={linkTone(item)} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
