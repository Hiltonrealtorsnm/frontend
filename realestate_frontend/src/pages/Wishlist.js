// src/pages/Wishlist.js

import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { getProperty } from "../api/api";
import "../styles/pages/wishlist.css";

export default function Wishlist() {
  const [items, setItems] = useState([]);

  // Load wishlist from localStorage and fetch properties
  async function loadWishlist() {
    const ids = JSON.parse(localStorage.getItem("wishlist") || "[]");

    let results = [];
    for (let id of ids) {
      try {
        const res = await getProperty(id);
        if (res?.data) results.push(res.data);
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    }
    setItems(results);
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  // Auto-refresh when localStorage changes in another tab/page
  useEffect(() => {
    const refresh = () => loadWishlist();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  // Remove item
  const removeItem = (id) => {
    let saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    saved = saved.filter((pid) => pid !== id);

    localStorage.setItem("wishlist", JSON.stringify(saved));
    sessionStorage.setItem("wishlist", JSON.stringify(saved));

    setItems((prev) => prev.filter((p) => p.propertyId !== id));
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        {/* If empty */}
        {!items.length ? (
          <div className="wishlist-empty">Your wishlist is empty.</div>
        ) : (
          <div className="wishlist-list">
            {items.map((p) => (
              <div key={p.propertyId} className="wishlist-item">

                <PropertyCard p={p} />

                <button
                  className="remove-btn"
                  onClick={() => removeItem(p.propertyId)}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
