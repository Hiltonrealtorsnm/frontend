// src/pages/AdminProjectEdit.js
import React, { useEffect, useState } from "react";

import {
  getProjectById,
  updateProject,
  getProjectImages,
  uploadProjectImages,
  deleteImage,
} from "../api/api";

import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_properties.css";
import "../styles/admin/admin_projectEdit.css";

export default function AdminProjectEdit() {
  const id = window.location.pathname.split("/").pop();

  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewNew, setPreviewNew] = useState([]);

  useEffect(() => {
    loadProject();
    loadImages();
  }, []);

  const loadProject = async () => {
    const res = await getProjectById(id);
    setForm(res.data);
  };

  const loadImages = async () => {
    const res = await getProjectImages(id);
    setImages(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewNew(urls);
  };

  const handleSave = async () => {
    try {
      await updateProject(id, form);

      // Upload new images
      if (newImages.length > 0) {
        await uploadProjectImages(id, newImages);
      }

      alert("Project updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteImage(imageId);
      loadImages();
    } catch (error) {
      console.error(error);
      alert("Failed to delete image");
    }
  };

  if (!form) return "Loading...";

  return (
    <AdminLayout>
      <div className="admin-properties-container">

        {/* BACK BUTTON */}
        <div
          className="admin-back-btn"
          onClick={() => (window.location.href = "/admin/projects")}
        >
          ← Back to Projects
        </div>

        <h1>Edit Project #{id}</h1>

        <div className="form-box">

          {/* FORM FIELDS */}
          <label>Title</label>
          <input name="title" value={form.title || ""} onChange={handleChange} />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
          />

          <label>Price Range</label>
          <input
            name="priceRange"
            value={form.priceRange || ""}
            onChange={handleChange}
          />

          <label>Price Bigint</label>
          <input
            type="number"
            name="priceBigint"
            value={form.priceBigint || ""}
            onChange={handleChange}
          />

          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="UPCOMING">UPCOMING</option>
            <option value="UNDER_CONSTRUCTION">UNDER CONSTRUCTION</option>
            <option value="READY">READY</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <label>Type</label>
          <input name="type" value={form.type || ""} onChange={handleChange} />

          <hr />

          {/* EXISTING IMAGES */}
          <h3>Existing Images</h3>

          <div className="image-grid">
            {images.map((img) => (
              <div className="image-box" key={img.imageId}>
                <img src={img.imageUrl} alt="" />
                <button
                  className="delete-img-btn"
                  onClick={() => handleDeleteImage(img.imageId)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <hr />

          {/* NEW IMAGES */}
          <h3>Add New Images</h3>
          <input type="file" multiple onChange={handleNewImages} />

          <div className="preview-container">
            {previewNew.map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
          </div>

          <hr />

          <button className="filter-btn apply" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
