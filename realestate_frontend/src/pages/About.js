import React from "react";
import "../styles/pages/about.css";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-box">
        <h1 className="about-title">About Us</h1>

        <p className="about-text">
          Hilton Realtors NM has been a trusted name in the real estate
          industry since 1996. With over 29 years of experience and more than
          5000 happy families served, we are committed to providing transparent,
          professional, and customer-focused real estate services.
        </p>

        <p className="about-text">
          We specialize in buying, selling, renting, and leasing residential and
          commercial properties across Navi Mumbai. Our dedicated team works
          with integrity and passion to help you discover the perfect property
          that matches your dreams and needs.
        </p>

        <p className="about-text">
          Today, we proudly serve clients at our Ulwe location, offering
          personalized assistance and expert guidance throughout every step of
          your property journey. At Hilton Realtors NM, your dream property is
          our mission.
        </p>
      </div>
    </div>
  );
}
