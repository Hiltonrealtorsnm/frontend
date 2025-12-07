import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/pages/not_found.css";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
          The page <span>{location.pathname}</span> does not exist.
        </p>

        <button onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/")}>
          {isAdmin ? "Go to Admin Dashboard" : "Go to Home"}
        </button>
      </div>
    </div>
  );
}
