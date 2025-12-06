import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/pages/projectDetails.css";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchProject(), fetchProjectImages()]);
    setLoading(false);
  };

  // -----------------------------
  // LOAD PROJECT
  // -----------------------------
  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:8080/project/${id}`);
      if (!res.ok) throw new Error("Project not found");

      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  // -----------------------------
  // LOAD IMAGES
  // -----------------------------
  const fetchProjectImages = async () => {
    try {
      const res = await fetch(`http://localhost:8080/project/getImages/${id}`);
      const data = await res.json();
      setImages(data);

      // Set first image as active
      if (data.length > 0) setCurrentImg(0);

    } catch (err) {
      console.error("Error loading images:", err);
    }
  };

  // -----------------------------
  // LOADING SPINNER
  // -----------------------------
  if (loading) return <div className="loading">Loading...</div>;

  // -----------------------------
  // IF PROJECT NOT FOUND
  // -----------------------------
  if (!project)
    return <div className="error">Project not found</div>;

  return (
    <div className="pd-page">
      {/* BACK BUTTON */}
      <button className="pd-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* HERO IMAGE */}
      <div className="pd-hero">
        <img
          src={images[currentImg] || "/placeholder.jpg"}
          alt=""
          className="pd-hero-img"
        />

        <span
          className={`pd-status ${
            project.status === "READY"
              ? "ready"
              : project.status === "UNDER_CONSTRUCTION"
              ? "construction"
              : "pre"
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      {/* THUMBNAILS */}
      <div className="pd-thumbs">
        {images.length === 0 && <p>No images uploaded</p>}

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={() => setCurrentImg(i)}
            className={`pd-thumb ${currentImg === i ? "active" : ""}`}
            alt=""
          />
        ))}
      </div>

      {/* TITLE */}
      <h1 className="pd-title">{project.title}</h1>
      <p className="pd-location">{project.location}</p>

      {/* PRICE */}
      <div className="pd-price">₹ {project.priceRange}</div>

      {/* OVERVIEW */}
      <div className="pd-box">
        <h2 className="pd-heading">Project Overview</h2>

        <div className="pd-grid">
          <div><b>Type:</b> {project.type}</div>
          <div><b>Status:</b> {project.status}</div>
          <div><b>Price Bigint:</b> {project.priceBigint}</div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="pd-box">
        <h2 className="pd-heading">About the Project</h2>
        <p className="pd-desc">{project.description}</p>
      </div>

      {/* CONTACT BUTTON */}
      <button className="pd-contact-btn">
        Contact Builder →
      </button>
    </div>
  );
}
