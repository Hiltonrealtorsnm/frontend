import React from "react";

export default function AdminProtected({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "/admin/login";
    return null;
  }

  return children;
}
