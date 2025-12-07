import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/admin/admin_layout.css";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  const isActive = (path) => {
    if (path === "/admin/enquiries") {
      return location.pathname.startsWith("/admin/enquiries");
    }
    if (path === "/admin/projects") {
      return (
        location.pathname.startsWith("/admin/projects") ||
        location.pathname.startsWith("/admin/project/")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      
      {/* ✅ MOBILE MENU BUTTON */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* ✅ SIDEBAR */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <h2 className="admin-logo">
          RealEstate <br /> Admin
        </h2>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "nav-item active" : "nav-item"}
            onClick={() => setOpen(false)}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/admin/properties"
            className={isActive("/admin/properties") ? "nav-item active" : "nav-item"}
            onClick={() => setOpen(false)}
          >
            🏠 Manage Properties
          </Link>

          <Link
            to="/admin/projects"
            className={isActive("/admin/projects") ? "nav-item active" : "nav-item"}
            onClick={() => setOpen(false)}
          >
            🏗 Manage Projects
          </Link>

          <Link
            to="/admin/enquiries"
            className={isActive("/admin/enquiries") ? "nav-item active" : "nav-item"}
            onClick={() => setOpen(false)}
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

      {/* ✅ MAIN CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
