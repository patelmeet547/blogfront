import { Link } from "react-router-dom";

export default function HomeTeaserCard({ article }) {
  return (
    <article className="home-teaser">
      <Link to={`/articles/${article.slug}`} className="home-teaser__link">
        {article.image && (
          <div className="home-teaser__media">
            <img
              src={article.image}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <h3 className="home-teaser__title">{article.title}</h3>
        <span className="home-teaser__more">Read More →</span>
      </Link>
    </article>
  );
}
