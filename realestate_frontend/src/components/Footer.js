import React from "react";
import "../styles/components/footer.css";   // FIXED PATH
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* BRAND / LOGO */}
        <div className="footer-col">
          <h2 className="footer-logo">🏠 HiltonRealtorsNM</h2>
          <p>Your trusted partner for buying, renting & selling properties.</p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/sell">Sell / Post Property</Link>
        </div>

        {/* SUPPORT LINKS */}
        <div className="footer-col">
          <h3>Support</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contact-agent/1">Contact Agent</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h3>Contact</h3>

          <p>📞 +91 8976489111</p>
          <p>📧 office@hiltonrealtorsnm.com</p>
          <p>📍 Shop No.01, Mayuresh Delta, Plot No.01, Sector 10-B, Ulwe, Navi Mumbai (MH) – 410206</p>

          <div className="footer-social">
            <a href="#">🌐</a>
            <a href="#">📘</a>
            <a href="#">🐦</a>
            <a href="#">📸</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Fintalks. All rights reserved.
      </div>
    </footer>
  );
}
