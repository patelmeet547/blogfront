import { Link } from "react-router-dom";
import "./HomeMosaic.css";

const cells = ["a", "b", "c", "d", "e"];

export default function HomeMosaic({ items }) {
  if (!items?.length) return null;
  return (
    <div className="home-mosaic" aria-label="Featured story grid">
      {cells.map((key, i) => {
        const article = items[i];
        if (!article?.slug) return null;
        return (
          <Link
            key={`${key}-${article.slug}`}
            to={`/articles/${article.slug}`}
            className={`home-mosaic__cell home-mosaic__cell--${key}`}
          >
            {article.image && (
              <img
                src={article.image}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            <span className="sr-only">{article.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
