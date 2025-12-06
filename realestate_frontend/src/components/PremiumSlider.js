import React, { useEffect, useState } from "react";
import "../styles/components/premiumSlider.css";

export default function PremiumSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="hero-slider">
      <div
        className="hero-slider-inner"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="hero-slide">
            <img src={img} alt="slide" className="hero-slide-img" />
            <div className="hero-overlay" />
            <h1 className="hero-text">Explore Premium Properties</h1>
          </div>
        ))}
      </div>

      <div className="hero-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`hero-dot ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>
    </div>
  );
}
