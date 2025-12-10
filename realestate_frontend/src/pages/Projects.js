import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // =============================
  // FETCH PROJECTS FROM BACKEND
  // =============================
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://hiltonbackend.onrender.com/project/all?page=0&size=20&sort=projectId,desc"
      );

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      // API returns Page<Project>
      setProjects(data.content || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("Error fetching project data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-page">
      <h1 className="projects-title">New & Upcoming Projects</h1>

      <div className="projects-grid">
        {projects.map((p) => {
          const firstImage =
            p.images?.length > 0
              ? p.images[0].imageUrl
              : "https://via.placeholder.com/600x400?text=No+Image";

          const projectStatus = p.status?.replace("_", " ") || "Unknown";

          return (
            <div className="project-card" key={p.id}>
              <div className="project-img-box">
                <img
                  src={firstImage}
                  alt={p.title}
                  className="project-img"
                />

                <span
                  className={`project-status ${
                    p.status === "READY"
                      ? "ready"
                      : p.status === "UNDER_CONSTRUCTION"
                      ? "construction"
                      : "pre"
                  }`}
                >
                  {projectStatus}
                </span>
              </div>

              <div className="project-info">
                <h3 className="project-name">{p.title}</h3>

                <p className="project-location">
                  {p.location || "Location not available"}
                </p>

                <p className="project-type">{p.type || "Type not mentioned"}</p>

                <div className="project-price">
                  ₹ {p.priceRange || p.priceBigint || "N/A"}
                </div>

                <button
                  className="project-btn"
                  onClick={() => navigate(`/project/${p.id}`)}
                >
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
