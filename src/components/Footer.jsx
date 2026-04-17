import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribe } from "../api.js";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    try {
      await subscribe(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <h2 className="site-footer__title">Subscribe</h2>
          <p className="site-footer__lede">
            Sign up with your email address to receive news and updates.
          </p>
          <form className="subscribe-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="subscribe-email">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
          {status === "success" && (
            <p className="subscribe-form__msg subscribe-form__msg--ok">
              Thank you!
            </p>
          )}
          {status === "error" && (
            <p className="subscribe-form__msg subscribe-form__msg--err">
              Please enter a valid email.
            </p>
          )}
        </div>
        <div className="site-footer__meta">
          <h3 className="site-footer__kicker">The Counterbalance Blog</h3>
          <p className="site-footer__org">Published by Words Beats & Life Inc.</p>
          <address className="site-footer__address">
            1525 Newton St. NW,
            <br />
            Washington, D.C. 20010
          </address>
          <p className="site-footer__ein">
            REGISTERED 501(C)(3)
            <br />
            EIN: 27-0062812
          </p>
          <div className="site-footer__contact">
            <p>
              <strong>Contact</strong>
            </p>
            <a href="mailto:mazi@wblinc.org">mazi@wblinc.org</a>
            <br />
            <a href="tel:+12026671192">(202) 667-1192</a>
          </div>
          <p className="site-footer__about">
            <Link to="/about">About this project</Link>
          </p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>
            Educational replica of{" "}
            <a
              href="https://www.thecounterbalance.org/"
              target="_blank"
              rel="noreferrer"
            >
              thecounterbalance.org
            </a>
            —not affiliated with WBL.
          </span>
        </div>
      </div>
    </footer>
  );
}
