import React, { useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaCity,
  FaBath,
  FaBed,
  FaRupeeSign,
  FaUndo,
  FaFilter,
} from "react-icons/fa";
import "../styles/components/filterBar.css";

export default function FilterBar({ filters, setFilters, onApply, isInlineButton }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  /* ---------------- CLOSE WHEN CLICK OUTSIDE ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- UPDATE FILTER VALUE ---------------- */
  const update = (key, value) =>
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
    });
    onApply();
  };

  return (
    <div className="filter-wrapper">

      {/* ⭐ FILTER BUTTON (same design as Login Button) */}
      {isInlineButton && (
        <button className="filter-btn" onClick={() => setOpen(!open)}>
          <FaFilter /> Filters
        </button>
      )}

      {/* ⭐ FILTER POPUP */}
      {open && (
        <div className="filter-box" ref={boxRef}>

          <h3 className="filter-title">Filters</h3>

          {/* ⭐ LINE 1 — CITY */}
          <div className="filter-item">
            <FaCity className="filter-icon" />
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>

          {/* ⭐ LINE 2 — MIN PRICE + MAX PRICE */}
          <div className="filter-row-2">
            <div className="filter-item">
              <FaRupeeSign className="filter-icon" />
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => update("minPrice", e.target.value)}
              />
            </div>

            <div className="filter-item">
              <FaRupeeSign className="filter-icon" />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => update("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* ⭐ LINE 3 — BEDROOMS + BATHROOMS */}
          <div className="filter-row-2">
            <div className="filter-item">
              <FaBed className="filter-icon" />
              <select
                value={filters.bedrooms}
                onChange={(e) => update("bedrooms", e.target.value)}
              >
                <option value="">Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>
            </div>

            <div className="filter-item">
              <FaBath className="filter-icon" />
              <select
                value={filters.bathrooms}
                onChange={(e) => update("bathrooms", e.target.value)}
              >
                <option value="">Bathrooms</option>
                <option value="1">1 Bath</option>
                <option value="2">2 Bath</option>
                <option value="3">3 Bath</option>
                <option value="4">4+ Bath</option>
              </select>
            </div>
          </div>

          {/* ⭐ LINE 4 — APPLY + RESET (SIDE-BY-SIDE) */}
          <div className="filter-actions">
            <button
              className="filter-apply-btn"
              onClick={() => {
                setOpen(false);
                onApply();
              }}
            >
              <FaSearch /> Apply
            </button>

            <button
              className="filter-reset-btn"
              onClick={resetFilters}
            >
              <FaUndo /> Reset
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
