// src/pages/AdminDashboard.js

import React, { useEffect, useState } from "react";
import {
  getProperties,
  getAllEnquiries,
  getProjects,
} from "../api/api"; // ADDED getProjects
import AdminLayout from "../components/AdminLayout";
import "../styles/pages/admin_dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    projects: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    enquiries: 0,
  });

  // ============= NUMBER ANIMATION =============
  const animate = (target, setFn) => {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setFn(current);
    }, 16);
  };

  // ============= LOAD STATS =============
  const loadStats = async () => {
    try {
      // ---- Load properties ----
      const propRes = await getProperties(0, 500);
      const propList = propRes?.data?.content || propRes?.data || [];

      // ---- Load enquiries ----
      const enquiryRes = await getAllEnquiries(0, 500);
      const enquiryCount =
        enquiryRes?.data?.totalElements ??
        enquiryRes?.data?.content?.length ??
        enquiryRes?.data?.length ??
        0;

      // ---- Load projects ----
      const projectRes = await getProjects(0, 200);
      const projectList = projectRes?.data?.content || projectRes?.data || [];

      const counts = {
        properties: propList.length,
        projects: projectList.length,
        pending: propList.filter((p) => p.status === "pending").length,
        approved: propList.filter((p) => p.status === "approved").length,
        rejected: propList.filter((p) => p.status === "rejected").length,
        enquiries: enquiryCount,
      };

      // Animate each card
      animate(counts.properties, (num) =>
        setStats((s) => ({ ...s, properties: num }))
      );
      animate(counts.projects, (num) =>
        setStats((s) => ({ ...s, projects: num }))
      );
      animate(counts.pending, (num) =>
        setStats((s) => ({ ...s, pending: num }))
      );
      animate(counts.approved, (num) =>
        setStats((s) => ({ ...s, approved: num }))
      );
      animate(counts.rejected, (num) =>
        setStats((s) => ({ ...s, rejected: num }))
      );
      animate(counts.enquiries, (num) =>
        setStats((s) => ({ ...s, enquiries: num }))
      );
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-dash-container">
        <h1>Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="admin-cards">

          {/* TOTAL PROPERTIES */}
          <div className="dash-card total">
            <h2>{stats.properties}</h2>
            <p>Total Properties</p>
          </div>

          {/* TOTAL PROJECTS */}
          <div className="dash-card blue">
            <h2>{stats.projects}</h2>
            <p>Total Projects</p>
          </div>

          {/* PENDING */}
          <div className="dash-card pending">
            <h2>{stats.pending}</h2>
            <p>Pending Approval</p>
          </div>

          {/* APPROVED */}
          <div className="dash-card approved">
            <h2>{stats.approved}</h2>
            <p>Approved</p>
          </div>

          {/* REJECTED */}
          <div className="dash-card rejected">
            <h2>{stats.rejected}</h2>
            <p>Rejected</p>
          </div>

          {/* ENQUIRIES */}
          <div className="dash-card enquiries">
            <h2>{stats.enquiries}</h2>
            <p>Total Enquiries</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="admin-actions">
          <button
            className="btn-view"
            onClick={() => (window.location.href = "/admin/properties")}
          >
            Manage Properties
          </button>

          <button
            className="btn-view"
            onClick={() => (window.location.href = "/admin/projects")}
          >
            Manage Projects
          </button>

          <button
            className="btn-view outline"
            onClick={() => (window.location.href = "/admin/enquiries")}
          >
            View Enquiries
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
