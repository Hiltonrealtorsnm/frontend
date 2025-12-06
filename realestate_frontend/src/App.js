import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import "./styles/global.css";
import "./styles/lazy.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";   // ⭐ IMPORT FOOTER
import AdminProtected from "./components/AdminProtected";

/* Public Pages */
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Sell from "./pages/Sell";
import RentProperties from "./pages/RentProperties";
import ContactAgent from "./pages/ContactAgent";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

/* Admin Pages */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProperties from "./pages/AdminProperties";
import AdminPropertyView from "./pages/AdminPropertyView";
import AdminEditProperty from "./pages/AdminEditProperty";
import AdminProjects from "./pages/AdminProjects";
import AdminProjectAdd from "./pages/AdminProjectAdd";
import AdminProjectEdit from "./pages/AdminProjectEdit";
import AdminProjectView from "./pages/AdminProjectView";
import AdminEnquiryList from "./pages/AdminEnquiryList";
import AdminEnquiryDetails from "./pages/AdminEnquiryDetails";


function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="app-content">
        {children}
      </div>
      {!hideNavbar && <Footer />}   {/* ⭐ FOOTER ADDED */}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    document.documentElement.setAttribute("color-theme", saved || "dark");
  }, []);

  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/rent-properties" element={<RentProperties />} />
          <Route path="/contact-agent/:id" element={<ContactAgent />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetails />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={<AdminProtected><AdminDashboard /></AdminProtected>}
          />

          <Route
            path="/admin/properties"
            element={<AdminProtected><AdminProperties /></AdminProtected>}
          />

          <Route
            path="/admin/property/:id"
            element={<AdminProtected><AdminPropertyView /></AdminProtected>}
          />

          <Route
            path="/admin/property/edit/:id"
            element={<AdminProtected><AdminEditProperty /></AdminProtected>}
          />

          <Route
            path="/admin/projects"
            element={<AdminProtected><AdminProjects /></AdminProtected>}
          />

          <Route
            path="/admin/project/add"
            element={<AdminProtected><AdminProjectAdd /></AdminProtected>}
          />

          <Route
            path="/admin/project/:id"
            element={<AdminProtected><AdminProjectView /></AdminProtected>}
          />

          <Route
            path="/admin/project/edit/:id"
            element={<AdminProtected><AdminProjectEdit /></AdminProtected>}
          />

          <Route
            path="/admin/enquiries"
            element={<AdminProtected><AdminEnquiryList /></AdminProtected>}
          />

          <Route
            path="/admin/enquiry/:id"
            element={<AdminProtected><AdminEnquiryDetails /></AdminProtected>}
          />

        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}
