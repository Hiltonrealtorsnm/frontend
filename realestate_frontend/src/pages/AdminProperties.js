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

  const [filters, setFilters] = useState({
    city: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  const mountedRef = useRef(true);
  const filterTimer = useRef(null);

  // Prevent multi-click spam
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

            if (Array.isArray(data)) return { id: p.propertyId, count: data.length };

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
  // CSV EXPORT
  // ================================
  const exportPropertiesCSV = () => {
    if (!sortedList.length) {
      alert("No properties to download");
      return;
    }

    const headers = [
      "Property ID",
      "Title",
      "Listing Type",
      "Price/MonthlyRent",
      "City",
      "Bedrooms",
      "Bathrooms",
      "Status",
      "Enquiry Count",
    ];

    const rows = sortedList.map((p) => [
      p.propertyId,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      p.listingType,
      p.listingType === "rent" ? p.monthlyRent || "" : p.price || "",
      p.address?.city || "",
      p.bedrooms ?? "",
      p.bathrooms ?? "",
      p.status || "",
      enquiryCounts[p.propertyId] ?? 0,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "properties.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ================================
  // FILTERS
  // ================================
  const applyFilters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.status) params.status = filters.status;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;

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

  const resetFilters = () => {
    setFilters({
      city: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    });
    loadData();
  };

  // ================================
  // ACTION HANDLERS (multi-click safe)
  // ================================
  const safeAction = async (callback) => {
    if (actionLoading) return;
    setActionLoading(true);
    await callback();
    setActionLoading(false);
  };

  const handleApprove = (id) =>
    safeAction(async () => {
      try {
        await approveProperty(id);
        await loadData();
        alert("Approved");
      } catch {
        alert("Failed to approve");
      }
    });

  const handleReject = (id) =>
    safeAction(async () => {
      try {
        await rejectProperty(id);
        await loadData();
        alert("Rejected");
      } catch {
        alert("Failed to reject");
      }
    });

  const handleDelete = (id) =>
    safeAction(async () => {
      if (!window.confirm("Delete this property?")) return;
      try {
        await deleteProperty(id);
        await loadData();
        alert("Deleted");
      } catch {
        alert("Failed to delete");
      }
    });

  const sortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "⇅";

  // ================================
  // RENDER
  // ================================
  return (
    <AdminLayout>
      <div className="admin-properties-container">
        <h1 style={{ color: "black" }}>Manage Properties</h1>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            className="filter-btn export"
            onClick={exportPropertiesCSV}
            disabled={actionLoading}
          >
            ⬇ Download Properties CSV
          </button>

          <div style={{ color: "#666" }}>
            {loadingCounts
              ? "Loading enquiry counts..."
              : `Loaded ${Object.keys(enquiryCounts).length} enquiry counts`}
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <input
            placeholder="City"
            value={filters.city}
            onChange={(e) =>
              setFilters({ ...filters, city: e.target.value })
            }
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={(e) =>
              setFilters({ ...filters, bedrooms: e.target.value })
            }
          />

          <button
            className="filter-btn apply"
            onClick={applyFilters}
            disabled={actionLoading}
          >
            Apply
          </button>

          <button
            className="filter-btn reset"
            onClick={resetFilters}
            disabled={actionLoading}
          >
            Reset
          </button>
        </div>

        {/* TABLE */}
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
                  <th onClick={() => sortBy("seller")}>
                    Seller {sortArrow("seller")}
                  </th>
                  <th onClick={() => sortBy("listingType")}>
                    Listing {sortArrow("listingType")}
                  </th>
                  <th onClick={() => sortBy("price")}>
                    Price / Rent {sortArrow("price")}
                  </th>
                  <th onClick={() => sortBy("status")}>
                    Status {sortArrow("status")}
                  </th>
                  <th>Enquiries</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedList.map((p) => (
                  <tr key={p.propertyId}>
                    <td>{p.propertyId}</td>

                    <td>
                      <a
                        href={`/admin/property/${p.propertyId}`}
                        className="admin-view-link"
                      >
                        {p.title || "—"}
                      </a>
                    </td>

                    <td>{p.seller?.sellerName ?? "—"}</td>

                    <td>{p.listingType === "rent" ? "Rent" : "Sale"}</td>

                    <td>
                      {p.listingType === "sale" && p.price
                        ? `₹ ${Number(p.price).toLocaleString()}`
                        : ""}
                      {p.listingType === "rent" && p.monthlyRent
                        ? `₹ ${Number(p.monthlyRent).toLocaleString()}`
                        : ""}
                    </td>

                    <td>
                      <span className={`status-badge status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>

                    <td>
                      {enquiryCounts[p.propertyId] ?? 0}
                      <a
                        href={`/admin/enquiries?property=${p.propertyId}`}
                        style={{ marginLeft: 8, fontSize: 12 }}
                      >
                        View
                      </a>
                    </td>

                    <td className="actions-cell">
                      {/* PENDING */}
                      {p.status === "pending" && (
                        <>
                          <button
                            className="action-btn btn-approve"
                            onClick={() => handleApprove(p.propertyId)}
                            disabled={actionLoading}
                          >
                            Approve
                          </button>
                          <button
                            className="action-btn btn-reject"
                            onClick={() => handleReject(p.propertyId)}
                            disabled={actionLoading}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* APPROVED */}
                      {p.status === "approved" && (
                        <button
                          className="action-btn btn-reject"
                          onClick={() => handleReject(p.propertyId)}
                          disabled={actionLoading}
                        >
                          Move to REJECTED
                        </button>
                      )}

                      {/* REJECTED */}
                      {p.status === "rejected" && (
                        <button
                          className="action-btn btn-approve"
                          onClick={() => handleApprove(p.propertyId)}
                          disabled={actionLoading}
                        >
                          Move to APPROVED
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(p.propertyId)}
                        disabled={actionLoading}
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
