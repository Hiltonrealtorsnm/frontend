import React from "react";
import "../styles/components/heroSection.css";
import heroImg from "../images/hero.jpg";
import CategoryBar from "./CategoryBar";

export default function HeroSection({ searchQuery, setSearchQuery, onSearch, onSelect }) {
  return (
    <section className="hero-section">
      <img src={heroImg} alt="hero" className="hero-bg" />
      <div className="hero-gradient"></div>

      {/* TEXT + SEARCH */}
      <div className="hero-content">
        <h1>
          FIND YOUR FUTURE HOME.<br />
          INTERACTIVELY.
        </h1>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Search city, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button onClick={onSearch}>Search</button>
        </div>
      </div>

      {/* ⭐ CATEGORY BAR FLOATING AT BOTTOM CENTER OF IMAGE */}
      <div className="hero-bottom-category">
        <CategoryBar onSelect={onSelect} />
      </div>

    </section>
  );
}
