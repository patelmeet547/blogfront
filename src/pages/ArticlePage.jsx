import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticle } from "../api.js";
import "./ArticlePage.css";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setArticle(null);
    setError(null);
    getArticle(slug)
      .then(setArticle)
      .catch(() => setError("Article not found."));
  }, [slug]);

  if (error) {
    return (
      <div className="container article-page article-page--center">
        <p>{error}</p>
        <Link className="btn" to="/">
          Back home
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container article-page article-page--center">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <article className="article-page">
      <div className="container article-page__inner">
        <nav className="article-page__crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          <Link to={`/articles?category=${article.categories[0] || "all"}`}>
            {article.categories[0] || "Articles"}
          </Link>
        </nav>
        <header className="article-page__header">
          <p className="article-page__meta">
            <span>{article.author}</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <h1 className="article-page__title">{article.title}</h1>
          <p className="article-page__excerpt">{article.excerpt}</p>
        </header>
        {article.image && (
          <figure className="article-page__figure">
            <img src={article.image} alt="" />
          </figure>
        )}
        <div
          className="article-page__body"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />
        <footer className="article-page__footer">
          <Link className="btn" to="/">
            ← More stories
          </Link>
        </footer>
      </div>
    </article>
  );
}
