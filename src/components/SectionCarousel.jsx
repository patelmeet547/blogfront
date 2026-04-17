import { useRef } from "react";
import HomeTeaserCard from "./HomeTeaserCard.jsx";
import "./SectionCarousel.css";

export default function SectionCarousel({ articles }) {
  const scrollerRef = useRef(null);

  function scrollByPage(dir) {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(280, el.clientWidth * 0.72) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (!articles?.length) return null;

  return (
    <div className="section-carousel">
      <div className="section-carousel__toolbar">
        <button
          type="button"
          className="section-carousel__btn"
          aria-label="Scroll stories left"
          onClick={() => scrollByPage(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="section-carousel__btn"
          aria-label="Scroll stories right"
          onClick={() => scrollByPage(1)}
        >
          ›
        </button>
      </div>
      <div className="section-carousel__track" ref={scrollerRef} tabIndex={0}>
        {articles.map((a) => (
          <div key={a.slug} className="section-carousel__slide">
            <HomeTeaserCard article={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
