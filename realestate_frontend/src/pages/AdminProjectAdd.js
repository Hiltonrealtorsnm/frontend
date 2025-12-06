// src/pages/AdminProjectAdd.js
import React, { useState } from "react";
import { createProject, uploadProjectImages } from "../api/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_properties.css";

export default function AdminProjectAdd() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    priceRange: "",
    priceBigint: "",
    type: "",
    status: "UPCOMING",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Preview
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreview(urls);
  };

  const handleSubmit = async () => {
    try {
      // Step 1 → Create project
      const res = await createProject(form);
      const newProjectId = res.data?.id;

      if (!newProjectId) {
        alert("Failed to create project");
        return;
      }

      // Step 2 → Upload images
      if (images.length > 0) {
        await uploadProjectImages(newProjectId, images);
      }

      alert("Project created successfully!");
      window.location.href = "/admin/projects";
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-properties-container">
        <h1 style={{ color: "black" }}>Add New Project</h1>

        <div className="form-box">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />

          <label>Price Range</label>
          <input
            name="priceRange"
            value={form.priceRange}
            onChange={handleChange}
          />

          <label>Price Bigint</label>
          <input
            type="number"
            name="priceBigint"
            value={form.priceBigint}
            onChange={handleChange}
          />

          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="UNDER_CONSTRUCTION">UNDER_CONSTRUCTION</option>
            <option value="READY">READY</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <label>Project Type</label>
          <input name="type" value={form.type} onChange={handleChange} />

          <label>Upload Images</label>
          <input multiple type="file" onChange={handleImageSelect} />

          {/* PREVIEW IMAGES */}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                style={{ width: 120, height: 90, borderRadius: 6 }}
              />
            ))}
          </div>

          <button className="filter-btn apply" onClick={handleSubmit}>
            ➕ Create Project
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
