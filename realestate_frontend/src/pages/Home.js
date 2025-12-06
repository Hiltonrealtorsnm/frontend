// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PropertyCard from "../components/PropertyCard";
import HeroSection from "../components/HeroSection";
import { getProperties } from "../api/api";

import "../styles/pages/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const searchNow = () =>
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);

  const handleSelect = (option) => {
    if (option === "sale") navigate("/sell");
    if (option === "buy") navigate("/properties?type=sale");
    if (option === "rent") navigate("/properties?type=rent");
  };

  useEffect(() => {
    getProperties(0, 50)
      .then((res) => {
        let list = res.data?.content || [];
        list = list.filter((p) => p?.status === "approved");
        const top10 = list.sort((a, b) => b.price - a.price).slice(0, 10);
        setRecommended(top10);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-wrapper">
      {/* ⭐ HERO SECTION NOW INCLUDES CATEGORY BAR */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchNow}
        onSelect={handleSelect}   // ← important
      />

      {/* ⭐ IMMERSIVE SECTION */}
      <section className="immersive-section">
        <h2 className="section-title">Immersive Tours</h2>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="property-grid">
            {recommended.map((p) => (
              <PropertyCard key={p.propertyId} p={p} immersive />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
