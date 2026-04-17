import { useEffect, useState } from "react";
import "./CookieBanner.css";

const KEY = "counterbalance-cookie-ok";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) document.body.classList.add("has-cookie-banner");
    else document.body.classList.remove("has-cookie-banner");
    return () => document.body.classList.remove("has-cookie-banner");
  }, [visible]);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <p className="cookie-banner__text">
        By using this website you agree to our{" "}
        <a
          href="https://www.thecounterbalance.org/"
          target="_blank"
          rel="noreferrer"
        >
          use of cookies
        </a>
        . We use cookies to provide you with a great experience and to help our
        website run effectively.
      </p>
      <button type="button" className="cookie-banner__btn" onClick={accept}>
        Cool, I accept!
      </button>
    </div>
  );
}
