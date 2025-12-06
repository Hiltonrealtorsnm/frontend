import React, { useEffect, useState } from "react";
import "../styles/components/heroSlider.css";
import img1 from "../images/house1.webp";
import img2 from "../images/house2.jpg";
import img3 from "../images/house3.webp";


const slides = [
  img1,
  img2,
  img3
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      
      <div
        className="hero-slider-inner"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((img, i) => (
          <div key={i} className="hero-slide">
            <img src={img} alt="banner" className="hero-slide-img" />
            <div className="hero-overlay" />
            <h1 className="hero-text">Find Your Dream Home</h1>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
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
