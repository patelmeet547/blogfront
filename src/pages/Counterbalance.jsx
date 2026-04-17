import { Link } from "react-router-dom";
import "./StaticPage.css";

export default function Counterbalance() {
  return (
    <div className="static-page container">
      <h1 className="section-title">Counterbalance?</h1>
      <div className="static-page__prose">
        <p>
          On the live site, this section introduces the idea of the blog as a{" "}
          <em>counterbalance</em>
          —a space where hip-hop education, youth voices, and cultural reporting
          push back against narrow narratives.
        </p>
        <p>
          In this replica, treat it as your editorial mission page: who you write
          for, what values guide coverage, and how readers can contribute or
          collaborate.
        </p>
        <ul>
          <li>Center youth, educators, and working artists.</li>
          <li>Connect local DMV stories to global hip-hop movements.</li>
          <li>Pair celebration with accountability.</li>
        </ul>
        <p>
          <Link className="btn" to="/articles">
            Browse articles
          </Link>
        </p>
      </div>
    </div>
  );
}
