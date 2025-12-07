// src/pages/AdminProperties.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  searchProperty,
  getEnquiriesByProperty,
} from "../api/api";

import AdminLayout from "../components/AdminLayout";
import FilterBar from "../components/FilterBar";   // ✅ FILTER BAR ADDED
import "../styles/admin/admin_properties.css";

export default function AdminProperties() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "propertyId",
    direction: "asc",
  });

  // ✅ FILTER STATE FOR FILTER BAR
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const mountedRef = useRef(true);

  // ✅ Prevent multi-click spam
  const [actionLoading, setActionLoading] = useState(false);

  const safe = (v, fallback = "") =>
    v === null || v === undefined ? fallback : v;

  // ================================
  // LOAD DATA
  // ================================
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProperties(0, 200);

      const data = Array.isArray(res?.data?.content)
        ? res.data.content
        : Array.isArray(res?.data)
        ? res.data
        : res?.data?.content ?? [];

      if (!mountedRef.current) return;

      setList(data);
      applySorting(data, sortConfig);
      loadEnquiryCounts(data);
    } catch (err) {
      console.error("loadData error:", err);
      if (mountedRef.current) {
        setList([]);
        setSortedList([]);
        setEnquiryCounts({});
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [sortConfig]);

  // ================================
  // LOAD ENQUIRY COUNTS
  // ================================
  const loadEnquiryCounts = async (properties = []) => {
    setLoadingCounts(true);
    try {
      const calls = properties.map((p) =>
        getEnquiriesByProperty(p.propertyId, 0, 1)
          .then((res) => {
            const data = res?.data;
            if (!data) return { id: p.propertyId, count: 0 };

            if (typeof data.totalElements === "number")
              return { id: p.propertyId, count: data.totalElements };

            if (Array.isArray(data?.content))
              return {
                id: p.propertyId,
                count: data.totalElements ?? data.content.length,
              };

            return { id: p.propertyId, count: 0 };
          })
          .catch(() => ({ id: p.propertyId, count: 0 }))
      );

      const results = await Promise.all(calls);
      if (!mountedRef.current) return;

      const counts = {};
      results.forEach((r) => (counts[r.id] = r.count));
      setEnquiryCounts(counts);
    } catch (err) {
      console.error("loadEnquiryCounts error:", err);
      if (mountedRef.current) setEnquiryCounts({});
    } finally {
      if (mountedRef.current) setLoadingCounts(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [loadData]);

  // ================================
  // SORTING
  // ================================
  const applySorting = (data, config) => {
    const sorted = [...(data || [])].sort((a, b) => {
      let v1, v2;

      switch (config.key) {
        case "title":
          v1 = safe(a.title).toLowerCase();
          v2 = safe(b.title).toLowerCase();
          break;
        case "seller":
          v1 = safe(a.seller?.sellerName).toLowerCase();
          v2 = safe(b.seller?.sellerName).toLowerCase();
          break;
        case "city":
          v1 = safe(a.address?.city).toLowerCase();
          v2 = safe(b.address?.city).toLowerCase();
          break;
        case "price":
          v1 =
            a.listingType === "rent"
              ? Number(a.monthlyRent || 0)
              : Number(a.price || 0);
          v2 =
            b.listingType === "rent"
              ? Number(b.monthlyRent || 0)
              : Number(b.price || 0);
          break;
        default:
          v1 = a[config.key] ?? "";
          v2 = b[config.key] ?? "";
      }

      if (v1 < v2) return config.direction === "asc" ? -1 : 1;
      if (v1 > v2) return config.direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedList(sorted);
  };

  const sortBy = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    const newConfig = { key, direction };
    setSortConfig(newConfig);
    applySorting(list, newConfig);
  };

  // ================================
  // ✅ APPLY FILTERS (FROM FILTER BAR)
  // ================================
  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.bathrooms) params.bathrooms = filters.bathrooms;

      const res = await searchProperty(params);

      const data = Array.isArray(res?.data?.content)
        ? res.data.content
        : Array.isArray(res?.data)
        ? res.data
        : res?.data?.content ?? [];

      if (!mountedRef.current) return;

      setList(data);
      applySorting(data, sortConfig);
      loadEnquiryCounts(data);
    } catch (err) {
      console.error("applyFilters error:", err);
      if (mountedRef.current) {
        setList([]);
        setSortedList([]);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // ================================
  // ✅ SAFE ACTION HANDLER
  // ================================
  const safeAction = async (callback) => {
    if (actionLoading) return;
    setActionLoading(true);
    await callback();
    setActionLoading(false);
  };

  const handleApprove = (id) =>
    safeAction(async () => {
      await approveProperty(id);
      await loadData();
    });

  const handleReject = (id) =>
    safeAction(async () => {
      await rejectProperty(id);
      await loadData();
    });

  const handleDelete = (id) =>
    safeAction(async () => {
      if (!window.confirm("Delete this property?")) return;
      await deleteProperty(id);
      await loadData();
    });

  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅";

  // ================================
  // ✅ RENDER
  // ================================
  return (
    <AdminLayout>
      <div className="admin-properties-container">
        <h1>Manage Properties</h1>

        {/* ✅ FILTER BAR POPUP BUTTON */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          isInlineButton
        />

        {/* ✅ TABLE */}
        <div className="table-wrap">
          {loading ? (
            <div className="table-loading">Loading properties…</div>
          ) : sortedList.length === 0 ? (
            <div className="table-empty">No properties found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("propertyId")}>
                    ID {sortArrow("propertyId")}
                  </th>
                  <th onClick={() => sortBy("title")}>
                    Title {sortArrow("title")}
                  </th>
                  <th>Seller</th>
                  <th>Listing</th>
                  <th>Price / Rent</th>
                  <th>Status</th>
                  <th>Enquiries</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedList.map((p) => (
                  <tr key={p.propertyId}>
                    <td data-label="ID">{p.propertyId}</td>

                    <td data-label="Title">
                      <a
                        href={`/admin/property/${p.propertyId}`}
                        className="admin-view-link"
                      >
                        {p.title || "—"}
                      </a>
                    </td>

                    <td data-label="Seller">{p.seller?.sellerName ?? "—"}</td>

                    <td data-label="Listing">
                      {p.listingType === "rent" ? "Rent" : "Sale"}
                    </td>

                    <td data-label="Price">
                      {p.listingType === "sale" && p.price
                        ? `₹ ${Number(p.price).toLocaleString()}`
                        : ""}
                      {p.listingType === "rent" && p.monthlyRent
                        ? `₹ ${Number(p.monthlyRent).toLocaleString()}`
                        : ""}
                    </td>

                    <td data-label="Status">
                      <span className={`status-badge status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>

                    <td data-label="Enquiries">
                      {enquiryCounts[p.propertyId] ?? 0}
                      <a
                        href={`/admin/enquiries?property=${p.propertyId}`}
                        style={{ marginLeft: 8 }}
                      >
                        View
                      </a>
                    </td>

                    {/* ✅ MOBILE SAFE BUTTON STACK */}
                    <td className="actions-cell mobile-actions" data-label="Actions">
                      {p.status === "pending" && (
                        <>
                          <button
                            className="action-btn btn-approve"
                            onClick={() => handleApprove(p.propertyId)}
                          >
                            Approve
                          </button>
                          <button
                            className="action-btn btn-reject"
                            onClick={() => handleReject(p.propertyId)}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {p.status === "approved" && (
                        <button
                          className="action-btn btn-reject"
                          onClick={() => handleReject(p.propertyId)}
                        >
                          Move to REJECTED
                        </button>
                      )}

                      {p.status === "rejected" && (
                        <button
                          className="action-btn btn-approve"
                          onClick={() => handleApprove(p.propertyId)}
                        >
                          Move to APPROVED
                        </button>
                      )}

                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(p.propertyId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
