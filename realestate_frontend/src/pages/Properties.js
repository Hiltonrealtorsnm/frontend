import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CategoryBar from "../components/CategoryBar";
import FilterBar from "../components/FilterBar";
import PropertyCard from "../components/PropertyCard";

import { getProperties, searchProperty } from "../api/api";

import "../styles/pages/properties.css";

export default function Properties() {
  const location = useLocation();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const params = new URLSearchParams(location.search);
  const filterType = params.get("type");

  /* ------------------- RESPONSIVE PAGE SIZE ------------------- */
  const getPageSize = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 15;
    if (w >= 600) return 9;
    return 5;
  };

  const [pageSize, setPageSize] = useState(getPageSize());

  useEffect(() => {
    const r = () => setPageSize(getPageSize());
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  /* -------------------------- LOAD DATA -------------------------- */
  const loadData = () => {
    setLoading(true);

    const hasFilter =
      filters.city ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.bedrooms ||
      filters.bathrooms ||
      searchQuery.trim() !== "";

    // SEARCH MODE
    if (hasFilter) {
      searchProperty({
        city: filters.city || null,
        type: null,
        minPrice: filters.minPrice ? Number(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
        bedrooms: filters.bedrooms ? Number(filters.bedrooms) : null,
        bathrooms: filters.bathrooms ? Number(filters.bathrooms) : null,
        page,
        size: pageSize,
      })
        .then((res) => {
          let data = Array.isArray(res.data?.content)
            ? res.data.content
            : Array.isArray(res.data)
            ? res.data
            : [];

          data = data.filter((p) => p?.status === "approved");

          if (filterType === "sale")
            data = data.filter((p) => p.listingType === "sale");

          if (filterType === "rent")
            data = data.filter((p) => p.listingType === "rent");

          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            data = data.filter((p) =>
              [p.title, p.description, p.address?.city, p.address?.area]
                .filter(Boolean)
                .some((f) => f.toLowerCase().includes(q))
            );
          }

          setList(data);
          setTotalPages(res.data?.totalPages || 1);
        })
        .finally(() => setLoading(false));

      return;
    }

    // NORMAL MODE
    getProperties(page, pageSize)
      .then((res) => {
        let data = res.data?.content || [];
        data = data.filter((p) => p?.status === "approved");

        if (filterType === "sale")
          data = data.filter((p) => p.listingType === "sale");

        if (filterType === "rent")
          data = data.filter((p) => p.listingType === "rent");

        setList(data);
        setTotalPages(res.data?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [page, filterType, pageSize]);

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  /* -------------- Skeleton -------------- */
  const Skeleton = () => (
    <div className="card skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  );

  /* -------------------------- UI -------------------------- */
  return (
    <div className="properties-page">

      <h2 className="properties-title">Looking for? </h2>
      
      {/* ⭐ CATEGORY BAR FLOATS UNDER NAVBAR (LIKE HOME PAGE) */}
      <div className="properties-category-wrapper">
        <CategoryBar
          onSelect={(option) => {
            if (option === "buy") navigate("/properties?type=sale");
            if (option === "rent") navigate("/properties?type=rent");
            if (option === "sale") navigate("/sell");
          }}
        />
      </div>

      {/* ⭐ MAIN IMMERSIVE CONTENT BLOCK */}
      <div className="dark-section">

        {/* Search + Filter */}
        <div className="search-filter-row">
          <input
            type="text"
            placeholder="Search city, area, title..."
            className="search-wide"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onApply={loadData}
            isInlineButton={true}
          />
        </div>

        {/* GRID */}
        <div className="property-grid" style={{ marginTop: 30 }}>
          {loading
            ? [...Array(pageSize)].map((_, i) => <Skeleton key={i} />)
            : list.map(
                (p) => p?.propertyId && <PropertyCard key={p.propertyId} p={p} />
              )}
        </div>

        {/* PAGINATION */}
        {!loading && (
          <div className="pagination-box">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ‹ Prev
            </button>

            <div className="page-count">
              Page <strong>{page + 1}</strong> of{" "}
              <strong>{totalPages}</strong>
            </div>

            <button
              className="page-btn"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
