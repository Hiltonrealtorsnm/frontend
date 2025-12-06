import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/admin/admin_layout.css";
import "../styles/admin/admin_sidebar.css";

export default function AdminLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin/enquiries") {
      return location.pathname.startsWith("/admin/enquiries");
    }
    if (path === "/admin/projects") {
      return location.pathname.startsWith("/admin/projects") ||
             location.pathname.startsWith("/admin/project/");
    }
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">
          RealEstate <br /> Admin
        </h2>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "nav-item active" : "nav-item"}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/properties"
            className={isActive("/admin/properties") ? "nav-item active" : "nav-item"}
          >
            🏠 Manage Properties
          </Link>

          <Link
            to="/admin/projects"
            className={isActive("/admin/projects") ? "nav-item active" : "nav-item"}
          >
            🏗 Manage Projects
          </Link>

          <Link
            to="/admin/enquiries"
            className={isActive("/admin/enquiries") ? "nav-item active" : "nav-item"}
          >
            ✉️ Enquiries
          </Link>
        </nav>

        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
