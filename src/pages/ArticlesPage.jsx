import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getArticles } from "../api.js";
import ArticleCard from "../components/ArticleCard.jsx";
import "./ArticlesPage.css";

const labels = {
  all: "All articles",
  culture: "Culture",
  "arts-education": "Arts education",
  "marginalized-voices": "Centering marginalized voices",
  "creative-employment": "Creative employment",
  "cultural-diplomacy": "Cultural diplomacy",
  politics: "Politics",
  lifestyle: "Lifestyle",
  wellness: "Wellness",
  podcasts: "Podcasts",
  reviews: "Reviews",
  squad: "Squad",
};

export default function ArticlesPage() {
  const [params] = useSearchParams();
  const category = params.get("category") || "all";
  const [list, setList] = useState(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getArticles(
      category === "all" ? { q: q || undefined } : { category, q: q || undefined }
    )
      .then(setList)
      .catch(() => setError("Could not load articles."));
  }, [category, q]);

  const title = labels[category] || labels.all;

  return (
    <div className="articles-page container">
      <header className="articles-page__header">
        <h1 className="section-title">{title}</h1>
        <p className="section-sub">
          Browse stories from The Counterbalance replica. Filter by section using
          the main navigation.
        </p>
        <label className="articles-page__search">
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search title, author…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </header>
      {error && <p className="articles-page__err">{error}</p>}
      {!list && !error && <p className="articles-page__loading">Loading…</p>}
      {list && list.length === 0 && (
        <p className="articles-page__empty">No articles match this filter.</p>
      )}
      {list && list.length > 0 && (
        <div className="article-grid">
          {list.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
