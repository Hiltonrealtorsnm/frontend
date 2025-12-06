// src/pages/AdminEditProperty.js

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sortable from "sortablejs";

import {
  getProperty,
  updateProperty,
  uploadPropertyImages,
  deleteImage,
  replaceImage,
  reorderImages,
} from "../api/api";

import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_edit_property.css";

export default function AdminEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [saving, setSaving] = useState(false);
  const [addingFiles, setAddingFiles] = useState([]);

  const imageListRef = useRef(null);
  const sortableRef = useRef(null);

  // ============================
  // LOAD PROPERTY
  // ============================
  const loadData = async () => {
    try {
      const res = await getProperty(id);
      setProperty(res.data);
    } catch (err) {
      alert("Failed to load property");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // ============================
  // SORTABLE IMAGE REORDER
  // ============================
  useEffect(() => {
    if (!imageListRef.current) return;

    if (sortableRef.current) sortableRef.current.destroy();

    if (!property?.images || property.images.length === 0) return;

    sortableRef.current = Sortable.create(imageListRef.current, {
      animation: 150,
      handle: ".drag-handle",
      onEnd: async () => {
        const ordered = Array.from(imageListRef.current.children).map((el) =>
          parseInt(el.dataset.id)
        );
        try {
          await reorderImages(property.propertyId, ordered);
          await loadData();
        } catch (err) {
          alert("Failed to reorder images");
        }
      },
    });
  }, [property]);

  // ============================
  // HANDLE FIELD CHANGES
  // ============================
  const handleChange = (field, value) => {
    setProperty((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setProperty((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleSellerChange = (field, value) => {
    setProperty((prev) => ({
      ...prev,
      seller: { ...prev.seller, [field]: value },
    }));
  };

  // ============================
  // SAVE PROPERTY
  // ============================
  const saveChanges = async () => {
    if (!property.title) return alert("Title is required");
    if (property.listingType === "sale" && !property.price)
      return alert("Price is required for Sale");
    if (property.listingType === "rent" && !property.monthlyRent)
      return alert("Monthly Rent is required");

    setSaving(true);

    try {
      await updateProperty(id, property);
      alert("Updated Successfully!");
      navigate(`/admin/property/${id}`);
    } catch (err) {
      alert("Update Failed");
    }

    setSaving(false);
  };

  // ============================
  // DELETE IMAGE
  // ============================
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteImage(imageId);
      loadData();
    } catch {
      alert("Failed to delete image");
    }
  };

  // ============================
  // REPLACE IMAGE
  // ============================
  const handleReplaceImage = async (imageId, file) => {
    if (!file) return;
    try {
      await replaceImage(imageId, file);
      loadData();
    } catch {
      alert("Failed to replace");
    }
  };

  // ============================
  // UPLOAD NEW IMAGES
  // ============================
  const uploadNewImages = async () => {
    if (addingFiles.length === 0) return;
    try {
      await uploadPropertyImages(property.propertyId, addingFiles);
      setAddingFiles([]);
      loadData();
    } catch (err) {
      alert("Upload Failed");
    }
  };

  if (!property) {
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="edit-container">

        {/* BACK BUTTON */}
        <button className="btn-back" onClick={() => navigate(`/admin/property/${id}`)}>
          ← Back
        </button>

        <h1>Edit Property</h1>

        {/* ============================ */}
        {/* IMAGE REORDER / DELETE / REPLACE */}
        {/* ============================ */}
        <h3>Images (Drag to reorder)</h3>

        <div className="image-reorder-area">
          <div className="image-list" ref={imageListRef}>
            {property.images?.map((img) => (
              <div className="image-item" key={img.imageId} data-id={img.imageId}>
                <span className="drag-handle">☰</span>
                <img src={img.imageUrl} alt="img" />

                <div className="image-controls">
                  <label className="replace-label">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleReplaceImage(img.imageId, e.target.files[0])
                      }
                    />
                  </label>

                  <button
                    className="btn-delete-img"
                    onClick={() => handleDeleteImage(img.imageId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div className="edit-group">
          <label>Add Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setAddingFiles([...e.target.files])}
          />
          {addingFiles.length > 0 && (
            <button className="btn-upload" onClick={uploadNewImages}>
              Upload {addingFiles.length} Images
            </button>
          )}
        </div>

        {/* ============================ */}
        {/* BASIC PROPERTY FIELDS */}
        {/* ============================ */}
        <div className="edit-group">
          <label>Title</label>
          <input
            value={property.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* LISTING TYPE (SALE / RENT) */}
        <div className="edit-group">
          <label>Listing Type</label>
          <select
            value={property.listingType}
            onChange={(e) => handleChange("listingType", e.target.value)}
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* PRICE FIELDS */}
        {property.listingType === "sale" && (
          <div className="edit-group">
            <label>Price (₹)</label>
            <input
              type="number"
              value={property.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
        )}

        {property.listingType === "rent" && (
          <div className="edit-row">
            <div className="edit-group">
              <label>Monthly Rent (₹)</label>
              <input
                type="number"
                value={property.monthlyRent || ""}
                onChange={(e) =>
                  handleChange("monthlyRent", Number(e.target.value))
                }
              />
            </div>

            <div className="edit-group">
              <label>Security Deposit (₹)</label>
              <input
                type="number"
                value={property.securityDeposit || ""}
                onChange={(e) =>
                  handleChange("securityDeposit", Number(e.target.value))
                }
              />
            </div>
          </div>
        )}

        {/* OTHER PROPERTY FIELDS */}
        <div className="edit-row">
          <div className="edit-group">
            <label>Bedrooms</label>
            <input
              type="number"
              value={property.bedrooms}
              onChange={(e) => handleChange("bedrooms", Number(e.target.value))}
            />
          </div>

          <div className="edit-group">
            <label>Bathrooms</label>
            <input
              type="number"
              value={property.bathrooms}
              onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="edit-group">
          <label>Area (Sqft)</label>
          <input
            type="number"
            value={property.areaSqft}
            onChange={(e) => handleChange("areaSqft", Number(e.target.value))}
          />
        </div>

        <div className="edit-group">
          <label>Furnishing</label>
          <input
            value={property.furnishing}
            onChange={(e) => handleChange("furnishing", e.target.value)}
          />
        </div>

        <div className="edit-group">
          <label>Description</label>
          <textarea
            value={property.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* ============================ */}
        {/* ADDRESS */}
        {/* ============================ */}
        <h2>Address</h2>

        <div className="edit-row">
          <div className="edit-group">
            <label>House No</label>
            <input
              value={property.address.houseNo}
              onChange={(e) => handleAddressChange("houseNo", e.target.value)}
            />
          </div>

          <div className="edit-group">
            <label>Street</label>
            <input
              value={property.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />
          </div>
        </div>

        <div className="edit-row">
          <div className="edit-group">
            <label>Area</label>
            <input
              value={property.address.area}
              onChange={(e) => handleAddressChange("area", e.target.value)}
            />
          </div>

          <div className="edit-group">
            <label>City</label>
            <input
              value={property.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />
          </div>
        </div>

        <div className="edit-row">
          <div className="edit-group">
            <label>State</label>
            <input
              value={property.address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
            />
          </div>

          <div className="edit-group">
            <label>Pincode</label>
            <input
              value={property.address.pincode}
              onChange={(e) => handleAddressChange("pincode", e.target.value)}
            />
          </div>
        </div>

        {/* ============================ */}
        {/* SELLER INFO */}
        {/* ============================ */}
        <h2>Seller Information</h2>

        <div className="edit-row">
          <div className="edit-group">
            <label>Name</label>
            <input
              value={property.seller.sellerName}
              onChange={(e) => handleSellerChange("sellerName", e.target.value)}
            />
          </div>

          <div className="edit-group">
            <label>Email</label>
            <input
              value={property.seller.email}
              onChange={(e) => handleSellerChange("email", e.target.value)}
            />
          </div>

          <div className="edit-group">
            <label>Phone</label>
            <input
              value={property.seller.phone}
              onChange={(e) => handleSellerChange("phone", e.target.value)}
            />
          </div>
        </div>

        {/* ============================ */}
        {/* ACTION BUTTONS */}
        {/* ============================ */}
        <div className="actions-row">
          <button className="btn-save" disabled={saving} onClick={saveChanges}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="btn-cancel"
            onClick={() => navigate(`/admin/property/${id}`)}
          >
            Cancel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
