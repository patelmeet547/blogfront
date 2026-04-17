import { Link } from "react-router-dom";
import "./StaticPage.css";

export default function NotFound() {
  return (
    <div className="static-page container static-page--center">
      <h1 className="section-title">404</h1>
      <p className="static-page__prose">That page does not exist.</p>
      <p>
        <Link className="btn btn-primary" to="/">
          Go home
        </Link>
      </p>
    </div>
  );
}
