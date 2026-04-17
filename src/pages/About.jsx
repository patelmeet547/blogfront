import { Link } from "react-router-dom";
import "./StaticPage.css";

export default function About() {
  return (
    <div className="static-page container">
      <h1 className="section-title">About</h1>
      <div className="static-page__prose">
        <p>
          This application is a <strong>developer educational replica</strong> of the
          public structure and tone of{" "}
          <a href="https://www.thecounterbalance.org/" target="_blank" rel="noreferrer">
            The Counterbalance
          </a>
          , the official blog of{" "}
          <a href="https://wblinc.org/" target="_blank" rel="noreferrer">
            Words Beats & Life
          </a>
          . It is not affiliated with, endorsed by, or connected to WBL.
        </p>
        <p>
          The real Counterbalance publishes journalism, podcasts, reviews, and
          community stories across culture, education, politics, wellness, and
          global hip-hop. This stack uses a <strong>React</strong> front end and a{" "}
          <strong>Node.js (Express)</strong> API with seeded sample content so you can
          extend it with a database, CMS, or auth when you are ready.
        </p>
        <p>
          <Link className="btn btn-primary" to="/">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
