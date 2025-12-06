// src/pages/AdminProjectView.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  getProjectById,
  getProjectImages,
  deleteProject,
  deleteImage,
  replaceImage,
  updateProjectStatus,
} from "../api/api";

import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_projectView.css";

export default function AdminProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);

  // 🔥 BUTTON LOADING STATE (per action, per image)
  const [loadingAction, setLoadingAction] = useState({});
  const setBtnLoading = (key, value) =>
    setLoadingAction((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    loadProject();
    loadImages();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await getProjectById(id);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load project");
    }
  };

  const loadImages = async () => {
    try {
      const res = await getProjectImages(id);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =============================================
  // DELETE PROJECT (with loading protection)
  // =============================================
  const handleDeleteProject = async () => {
    if (loadingAction["delete_project"]) return;

    if (!window.confirm("Delete this project permanently?")) return;

    setBtnLoading("delete_project", true);

    try {
      await deleteProject(id);
      alert("Project Deleted");
      navigate("/admin/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    } finally {
      setBtnLoading("delete_project", false);
    }
  };

  // =============================================
  // DELETE IMAGE (per-image loading)
  // =============================================
  const handleDeleteImage = async (imageId) => {
    if (loadingAction[`delete_img_${imageId}`]) return;

    if (!window.confirm("Delete this image?")) return;

    setBtnLoading(`delete_img_${imageId}`, true);

    try {
      await deleteImage(imageId);
      await loadImages();
    } catch (err) {
      console.error(err);
      alert("Failed to delete image");
    } finally {
      setBtnLoading(`delete_img_${imageId}`, false);
    }
  };

  // =============================================
  // REPLACE IMAGE (per-image loading)
  // =============================================
  const handleReplaceImage = async (imageId, file) => {
    if (!file) return;
    if (loadingAction[`replace_img_${imageId}`]) return;

    setBtnLoading(`replace_img_${imageId}`, true);

    try {
      await replaceImage(imageId, file);
      await loadImages();
    } catch (err) {
      console.error(err);
      alert("Failed to replace image");
    } finally {
      setBtnLoading(`replace_img_${imageId}`, false);
    }
  };

  // =============================================
  // CHANGE STATUS (loading protected)
  // =============================================
  const handleStatusChange = async (newStatus) => {
    if (loadingAction[`status_${newStatus}`]) return;

    setBtnLoading(`status_${newStatus}`, true);

    try {
      await updateProjectStatus(id, newStatus);
      alert("Status Updated");
      loadProject();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setBtnLoading(`status_${newStatus}`, false);
    }
  };

  if (!project)
    return (
      <AdminLayout>
        <div style={{ padding: 20 }}>Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="admin-project-container">

        {/* BACK BUTTON */}
        <button
          className="admin-back-btn"
          onClick={() => navigate("/admin/projects")}
        >
          ← Back to Projects
        </button>

        {/* HEADER */}
        <div className="header-row">
          <h1>Project Details</h1>

          <Link className="btn-edit" to={`/admin/project/edit/${id}`}>
            ✏️ Edit Project
          </Link>
        </div>

        {/* INFO BOX */}
        <div className="pd-box">
          <h2>{project.title}</h2>

          <p><b>Location:</b> {project.location}</p>
          <p><b>Type:</b> {project.type}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={`status-badge status-${project.status}`}>
              {project.status}
            </span>
          </p>

          <p>
            <b>Price:</b> ₹ {project.priceRange || project.priceBigint}
          </p>

          <hr />

          <h3>Description</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{project.description}</p>
        </div>

        {/* STATUS BUTTONS */}
        <div className="status-btn-row">

          <button
            className="action-btn btn-ready"
            onClick={() => handleStatusChange("READY")}
            disabled={loadingAction["status_READY"]}
          >
            {loadingAction["status_READY"] ? "Updating…" : "Mark READY"}
          </button>

          <button
            className="action-btn btn-construction"
            onClick={() => handleStatusChange("UNDER_CONSTRUCTION")}
            disabled={loadingAction["status_UNDER_CONSTRUCTION"]}
          >
            {loadingAction["status_UNDER_CONSTRUCTION"]
              ? "Updating…"
              : "Mark UNDER CONSTRUCTION"}
          </button>

          <button
            className="action-btn btn-upcoming"
            onClick={() => handleStatusChange("UPCOMING")}
            disabled={loadingAction["status_UPCOMING"]}
          >
            {loadingAction["status_UPCOMING"] ? "Updating…" : "Mark UPCOMING"}
          </button>

          <button
            className="action-btn btn-completed"
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loadingAction["status_COMPLETED"]}
          >
            {loadingAction["status_COMPLETED"] ? "Updating…" : "Mark COMPLETED"}
          </button>

          <button
            className="action-btn btn-delete"
            onClick={handleDeleteProject}
            disabled={loadingAction["delete_project"]}
          >
            {loadingAction["delete_project"] ? "Deleting…" : "Delete Project"}
          </button>
        </div>

        {/* IMAGE GALLERY */}
        <h2>Project Images</h2>

        <div className="image-gallery">
          {images.map((img) => {
            const deleteKey = `delete_img_${img.imageId}`;
            const replaceKey = `replace_img_${img.imageId}`;

            return (
              <div className="img-wrapper" key={img.imageId}>
                <img src={img.imageUrl} alt="" />

                {/* DELETE IMAGE BUTTON */}
                <button
                  className="delete-img-btn"
                  onClick={() => handleDeleteImage(img.imageId)}
                  disabled={loadingAction[deleteKey]}
                >
                  {loadingAction[deleteKey] ? "…" : "✕"}
                </button>

                {/* REPLACE IMAGE INPUT */}
                <input
                  type="file"
                  disabled={loadingAction[replaceKey]}
                  onChange={(e) =>
                    handleReplaceImage(img.imageId, e.target.files[0])
                  }
                  className="replace-input"
                />

                {loadingAction[replaceKey] && (
                  <div className="img-loading-text">Replacing…</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
