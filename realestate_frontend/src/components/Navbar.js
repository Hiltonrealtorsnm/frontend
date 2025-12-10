// src/components/Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import "../styles/components/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const drawerRef = useRef(null);

  /* ---------------------- THEME TOGGLE ---------------------- */
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("color-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("color-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  /* ---------------------- WISHLIST COUNT ---------------------- */
  useEffect(() => {
    const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishCount(w.length);
  }, []);

  useEffect(() => {
    const syncWishlist = () => {
      const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishCount(w.length);
    };

    window.addEventListener("storage", syncWishlist);
    return () => window.removeEventListener("storage", syncWishlist);
  }, []);

  /* ---------------------- SEARCH ---------------------- */
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      if (q.length > 0) navigate(`/properties?search=${encodeURIComponent(q)}`);
    }
  };

  /* ---------------------- CLICK OUTSIDE TO CLOSE ---------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* ⭐ NAVBAR FLOATING + CENTERED */}
      <header className="navbar" role="navigation">
        <div className="navbar-inner">

          <div className="nav-left">
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <FaBars size={18} />
            </button>

            <Link to="/" className="nav-logo">HiltonRealtorsNM</Link>
          </div>

          {/* Desktop Links */}
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/about">About Us</Link>
          </nav>

          <div className="nav-actions">

            {/* 🌗 Light/Dark Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="sun">☀️</span>
              <span className="moon">🌙</span>
            </button>

            {/* ❤️ Wishlist */}
            <Link to="/wishlist" className="icon-btn wish-badge" title="Wishlist">
              <FaHeart />
              {wishCount > 0 && <span className="wish-count">{wishCount}</span>}
            </Link>

            {/* Login */}
            <Link to="/admin/login" className="nav-login-btn">Login</Link>
          </div>

        </div>
      </header>

      {/* ⭐ MOBILE DRAWER */}
      <aside ref={drawerRef} className={`mobile-drawer ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          <FaTimes size={18} />
        </button>

        <input
          className="search"
          placeholder="Search homes..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpen(false);
              handleSearch(e);
            }
          }}
        />

        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/properties" onClick={() => setOpen(false)}>Properties</Link>
        <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
        <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>
        <Link to="/projects" onClick={() => setOpen(false)}>Projects</Link>

        <div style={{ marginTop: "auto" }}>
          <Link
            to="/admin/login"
            className="nav-login-btn"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      </aside>
    </>
  );
}
