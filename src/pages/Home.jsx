import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHome } from "../api.js";
import HomeMosaic from "../components/HomeMosaic.jsx";
import SectionCarousel from "../components/SectionCarousel.jsx";
import "./Home.css";

function HomeSection({ section }) {
  const layout = section.layout || "inverse";

  return (
    <section
      className={`home-band home-band--${layout}`}
      aria-labelledby={`sec-${section.id}`}
    >
      {layout === "inverse" && (
        <div className="home-band__head home-band__head--inverse">
          <div className="home-band__head-inner">
            <h2 id={`sec-${section.id}`} className="home-band__title home-band__title--inverse">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="home-band__pill">{section.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {layout === "intro" && (
        <header className="home-band__intro-block">
          <h2 id={`sec-${section.id}`} className="sr-only">
            {section.title}
          </h2>
          <p className="home-band__intro-line">{section.subtitle}</p>
        </header>
      )}

      {layout === "tan" && (
        <header className="home-band__tan-head">
          <h2 id={`sec-${section.id}`} className="home-band__title home-band__title--tan">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="home-band__subtan">{section.subtitle}</p>
          )}
          <div className="home-band__rule" aria-hidden />
        </header>
      )}

      <div className="home-band__body">
        {section.articles.length === 0 ? (
          <p className="home-band__empty">More stories coming soon.</p>
        ) : (
          <SectionCarousel articles={section.articles} />
        )}
        <p className="home-band__more">
          <Link className="home-band__more-link" to={`/articles?category=${section.category}`}>
            View all in this section
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHome()
      .then(setData)
      .catch(() => setError("Could not load homepage."));
  }, []);

  if (error) {
    return (
      <div className="container home-error">
        <p>{error}</p>
        <p>Start the API: npm run dev --prefix server</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container home-loading">
        <p>Loading…</p>
      </div>
    );
  }

  const [hero, ...restFeatured] = data.featured;

  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Welcome">
        <div className="home-hero__overlay" aria-hidden />
        <div className="home-hero__content">
          <h1 className="home-hero__title">The Counterbalance</h1>
          <p className="home-hero__kicker">
            <span className="home-hero__kicker-line">The official blog of </span>
            <span className="home-hero__wbl">Words Beats & Life</span>
          </p>
        </div>
      </section>

      <HomeMosaic items={data.mosaic || []} />

      <div className="home-surface">
        <div className="container home-surface__inner">
          <section className="home-featured" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="home-featured__title">
              Featured Articles
            </h2>
            <div className="home-featured__grid">
              {hero && (
                <Link className="home-featured__hero-card" to={`/articles/${hero.slug}`}>
                  {hero.image && (
                    <div className="home-featured__hero-media">
                      <img src={hero.image} alt="" loading="lazy" />
                    </div>
                  )}
                  <div className="home-featured__hero-body">
                    <span className="home-featured__author">{hero.author}</span>
                    <span className="home-featured__hero-title">{hero.title}</span>
                  </div>
                </Link>
              )}
              <ul className="home-featured__list">
                {restFeatured.map((a) => (
                  <li key={a.slug}>
                    <Link className="home-featured__list-link" to={`/articles/${a.slug}`}>
                      <span className="home-featured__author">{a.author}</span>
                      <span className="home-featured__list-title">{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {data.sections.map((section) => (
            <HomeSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
