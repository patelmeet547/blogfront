import { Link } from "react-router-dom";
import "./ArticleCard.css";

export default function ArticleCard({ article, featured }) {
  return (
    <article className={`article-card${featured ? " article-card--featured" : ""}`}>
      <Link to={`/articles/${article.slug}`} className="article-card__link">
        {article.image && (
          <div className="article-card__media">
            <img src={article.image} alt="" loading="lazy" />
          </div>
        )}
        <div className="article-card__body">
          <p className="article-card__meta">
            <span>{article.author}</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </p>
          <h3 className="article-card__title">{article.title}</h3>
          {!featured && (
            <p className="article-card__excerpt">{article.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
