// src/pages/AdminProjects.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getProjects,
  deleteProject,
  updateProjectStatus,
  getProjectImages,
} from "../api/api";

import "../styles/admin/admin_properties.css";

export default function AdminProjects() {
  const [list, setList] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [imageCounts, setImageCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  const mountedRef = useRef(true);

  const safe = (v, fallback = "") =>
    v === null || v === undefined ? fallback : v;

  // ============================= LOAD PROJECTS =============================
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProjects(0, 200);
      const data = res?.data?.content || [];

      if (!mountedRef.current) return;

      setList(data);
      applySorting(data, sortConfig);
      loadImageCounts(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [sortConfig]);

  // ============================= IMAGE COUNTS =============================
  const loadImageCounts = async (projects) => {
    setLoadingCounts(true);
    try {
      const calls = projects.map((p) =>
        getProjectImages(p.id)
          .then((r) => ({
            id: p.id,
            count: Array.isArray(r.data) ? r.data.length : 0,
          }))
          .catch(() => ({ id: p.id, count: 0 }))
      );

      const results = await Promise.all(calls);

      if (!mountedRef.current) return;

      const map = {};
      results.forEach((r) => (map[r.id] = r.count));

      setImageCounts(map);
    } catch (err) {
      console.error("Error loading image count");
    } finally {
      if (mountedRef.current) setLoadingCounts(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => (mountedRef.current = false);
  }, [loadData]);

  // ============================= SORTING =============================
  const applySorting = (data, config) => {
    const sorted = [...data].sort((a, b) => {
      let v1, v2;

      switch (config.key) {
        case "title":
          v1 = safe(a.title, "").toLowerCase();
          v2 = safe(b.title, "").toLowerCase();
          break;

        case "location":
          v1 = safe(a.location, "").toLowerCase();
          v2 = safe(b.location, "").toLowerCase();
          break;

        case "status":
          v1 = safe(a.status, "").toLowerCase();
          v2 = safe(b.status, "").toLowerCase();
          break;

        case "price":
          v1 = Number(a.priceBigint ?? 0);
          v2 = Number(b.priceBigint ?? 0);
          break;

        default:
          v1 = a[config.key];
          v2 = b[config.key];
      }

      if (v1 < v2) return config.direction === "asc" ? -1 : 1;
      if (v1 > v2) return config.direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedList(sorted);
  };

  const sortBy = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";

    const newConfig = { key, direction };
    setSortConfig(newConfig);
    applySorting(list, newConfig);
  };

  const sortArrow = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : "⇅";

  // ============================= DELETE PROJECT =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      await loadData();
      alert("Project deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // ============================= UPDATE STATUS =============================
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateProjectStatus(id, status);
      await loadData();
      alert("Status updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // ============================= EXPORT CSV =============================
  const exportCSV = () => {
    if (!sortedList.length) return alert("No data");

    const headers = [
      "ID",
      "Title",
      "Location",
      "Price",
      "Status",
      "Type",
      "ImageCount",
    ];

    const rows = sortedList.map((p) => [
      p.id,
      `"${p.title?.replace(/"/g, '""')}"`,
      p.location,
      p.priceBigint,
      p.status,
      p.type,
      imageCounts[p.id] || 0,
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="admin-properties-container">
        <h1 style={{ color: "black" }}>Manage Projects</h1>

        {/* ADD NEW PROJECT + CSV DOWNLOAD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <button
            className="filter-btn apply"
            onClick={() => (window.location.href = "/admin/project/add")}
          >
            ➕ Add New Project
          </button>

          <button className="filter-btn export" onClick={exportCSV}>
            ⬇ Download Projects CSV
          </button>
        </div>

        {loadingCounts && (
          <div style={{ fontSize: 14, color: "#666" }}>Loading image counts…</div>
        )}

        {/* TABLE */}
        <div className="table-wrap">
          {loading ? (
            <div className="table-loading">Loading projects…</div>
          ) : sortedList.length === 0 ? (
            <div className="table-empty">No projects found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("id")}>ID {sortArrow("id")}</th>
                  <th onClick={() => sortBy("title")}>Title {sortArrow("title")}</th>
                  <th onClick={() => sortBy("location")}>
                    Location {sortArrow("location")}
                  </th>
                  <th onClick={() => sortBy("price")}>Price {sortArrow("price")}</th>
                  <th onClick={() => sortBy("status")}>
                    Status {sortArrow("status")}
                  </th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedList.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>

                    <td>
                      <a href={`/admin/project/${p.id}`} className="admin-view-link">
                        {p.title}
                      </a>
                    </td>

                    <td>{p.location}</td>

                    <td>₹ {p.priceBigint?.toLocaleString()}</td>

                    <td>
                      <span className={`status-badge status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>

                    <td>{imageCounts[p.id] ?? 0}</td>

                    <td className="actions-cell">
                      {/* ALL STATUS OPTIONS */}
                      <button
                        className="action-btn btn-upcoming"
                        onClick={() => handleStatusUpdate(p.id, "UPCOMING")}
                      >
                        UPCOMING
                      </button>

                      <button
                        className="action-btn btn-construction"
                        onClick={() => handleStatusUpdate(p.id, "UNDER_CONSTRUCTION")}
                      >
                        UNDER CONSTRUCTION
                      </button>

                      <button
                        className="action-btn btn-ready"
                        onClick={() => handleStatusUpdate(p.id, "READY")}
                      >
                        READY
                      </button>

                      <button
                        className="action-btn btn-completed"
                        onClick={() => handleStatusUpdate(p.id, "COMPLETED")}
                      >
                        COMPLETED
                      </button>

                      {/* DELETE PROJECT */}
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(p.id)}
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
