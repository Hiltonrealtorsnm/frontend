// src/components/PropertyCard.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaHeart } from "react-icons/fa";
import "../styles/components/propertyCard.css";

export default function PropertyCard({ p }) {
  if (!p || typeof p !== "object" || !p.propertyId) return null;

  const navigate = useNavigate();

  // ---------------- MAIN IMAGE ----------------
  const mainImage =
    p.images?.[0]?.imageUrl ||
    p.images?.[0] ||
    "/placeholder.jpg";

  // ---------------- WISHLIST ----------------
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setLiked(saved.includes(p.propertyId));
  }, [p.propertyId]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    let saved = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (saved.includes(p.propertyId)) {
      saved = saved.filter((id) => id !== p.propertyId);
      setLiked(false);
    } else {
      saved.push(p.propertyId);
      setLiked(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(saved));
  };

  return (
    <div
      className="property-card"
      onClick={() => navigate(`/property/${p.propertyId}`)}
    >
      {/* TAG */}
      <span className={`tag ${p.listingType === "rent" ? "rent" : "sale"}`}>
        {p.listingType === "rent" ? "For Rent" : "For Sale"}
      </span>

      {/* ------------ ONLY ONE IMAGE ------------ */}
      <div className="image-wrapper">
        <img src={mainImage} alt="property" />
      </div>

      {/* ------------ DETAILS ------------ */}
      <div className="property-body">
        <h3 className="property-title">{p.title}</h3>

        <p className="property-location">
          {p.address?.area}, {p.address?.city}
        </p>

        <div className="property-meta">
          <span>
            <FaBed /> {p.bedrooms} Beds
          </span>
          <span>
            <FaBath /> {p.bathrooms} Baths
          </span>
        </div>

        {/* PRICE LOGIC */}
        {p.listingType === "rent" ? (
          <>
            <h3 className="property-price">
              ₹ {p.monthlyRent?.toLocaleString()} / month
            </h3>
            <p className="property-deposit">
              Deposit: ₹ {p.securityDeposit?.toLocaleString()}
            </p>
          </>
        ) : (
          <h3 className="property-price">₹ {p.price?.toLocaleString()}</h3>
        )}

        {/* FOOTER */}
        <div className="card-footer">
          <button
            className="btn-view"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${p.propertyId}`);
            }}
          >
            View
          </button>

          <button
            className={`heart-btn ${liked ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </div>
  );
}
