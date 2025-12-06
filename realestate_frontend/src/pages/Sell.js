// src/pages/Sell.js

import React, { useState } from "react";
import {
  addOrUpdateSeller,
  addProperty,
  uploadPropertyImages
} from "../api/api";

import "../styles/pages/sell.css";

export default function Sell() {
  const [seller, setSeller] = useState({
    sellerName: "",
    phone: "",
    email: "",
    sellerType: "OWNER",
  });

  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    areaSqft: "",
    listingType: "sale",
    propertyType: "House",
    address: {
      houseNo: "",
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    },
    seller: { sellerId: null },
  });

  const [images, setImages] = useState([]);

  // 🚫 Prevent Duplicate Submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ------------------------------------------------------
      VALIDATION
  ------------------------------------------------------ */
  const validate = () => {
    if (!seller.phone.trim()) return "Seller phone is required!";
    if (!property.title.trim()) return "Property title is required!";
    if (!property.description.trim()) return "Description required!";
    if (!property.price) return "Price required!";
    if (!property.bedrooms) return "Bedrooms required!";
    if (!property.bathrooms) return "Bathrooms required!";

    const a = property.address;
    if (!a.city.trim()) return "City required!";
    if (!a.state.trim()) return "State required!";
    if (!a.pincode.trim()) return "Pincode required!";

    return null;
  };

  /* ------------------------------------------------------
      SUBMIT PROPERTY (Prevent Multiple Submissions)
  ------------------------------------------------------ */
  const handleSubmit = async () => {
    if (isSubmitting) return; // 🔒 block extra clicks

    const err = validate();
    if (err) return alert(err);

    setIsSubmitting(true); // ⏳ start loading

    try {
      // 1️⃣ UPSERT SELLER
      const sellerRes = await addOrUpdateSeller(seller);
      const sellerId = sellerRes.data.sellerId;

      // 2️⃣ Prepare property payload
      const finalProperty = {
        ...property,
        seller: { sellerId },
        price: Number(property.price),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        areaSqft: Number(property.areaSqft),
      };

      // 3️⃣ CREATE PROPERTY
      const propertyRes = await addProperty(finalProperty);
      const propertyId = propertyRes.data.propertyId;

      // 4️⃣ UPLOAD IMAGES
      if (images.length > 0) {
        const files = images.map((i) => i.file);
        await uploadPropertyImages(propertyId, files);
      }

      alert("Property submitted successfully!");
      window.location.href = "/properties";

    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false); // ✔ unlock button
    }
  };

  /* ------------------------------------------------------
      UI RENDER
  ------------------------------------------------------ */
  return (
    <div className="sell-wrapper">

      <h1 className="sell-title">List Your Property</h1>

      <div className="sell-card">
        {/* ---------------------------------------------- */}
        {/* LEFT COLUMN — PROPERTY DETAILS */}
        {/* ---------------------------------------------- */}
        <div className="sell-col">
          <h3 className="section-label">Property Info</h3>

          <div className="form-group">
            <label>Property Type</label>
            <select
              value={property.propertyType}
              onChange={(e) =>
                setProperty({ ...property, propertyType: e.target.value })
              }
            >
              {[
                "House", "Condo", "Apartment", "Townhouse", "Duplex",
                "Mobile", "Land", "Office", "Retail", "Industrial", "Mixed"
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              placeholder="Property title"
              value={property.title}
              onChange={(e) =>
                setProperty({ ...property, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Write description"
              value={property.description}
              onChange={(e) =>
                setProperty({ ...property, description: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Price</label>
              <input
                type="number"
                value={property.price}
                onChange={(e) =>
                  setProperty({ ...property, price: e.target.value })
                }
              />
            </div>

            <div className="form-group half">
              <label>Listing Type</label>
              <select
                value={property.listingType}
                onChange={(e) =>
                  setProperty({ ...property, listingType: e.target.value })
                }
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Bedrooms</label>
              <input
                type="number"
                value={property.bedrooms}
                onChange={(e) =>
                  setProperty({ ...property, bedrooms: e.target.value })
                }
              />
            </div>

            <div className="form-group half">
              <label>Bathrooms</label>
              <input
                type="number"
                value={property.bathrooms}
                onChange={(e) =>
                  setProperty({ ...property, bathrooms: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Area (sqft)</label>
            <input
              type="number"
              value={property.areaSqft}
              onChange={(e) =>
                setProperty({ ...property, areaSqft: e.target.value })
              }
            />
          </div>

          <h3 className="section-label small">Address</h3>

          <div className="address-grid">
            {["houseNo", "street", "area", "city", "state", "pincode"].map(
              (field) => (
                <div className="form-group" key={field}>
                  <label>{field.toUpperCase()}</label>
                  <input
                    value={property.address[field]}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        address: {
                          ...property.address,
                          [field]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* ---------------------------------------------- */}
        {/* RIGHT COLUMN — SELLER INFO + IMAGES */}
        {/* ---------------------------------------------- */}
        <div className="sell-col">
          <h3 className="section-label">Seller Info</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input
              value={seller.sellerName}
              onChange={(e) =>
                setSeller({ ...seller, sellerName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input
              value={seller.phone}
              onChange={(e) =>
                setSeller({ ...seller, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              value={seller.email}
              onChange={(e) =>
                setSeller({ ...seller, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Seller Type</label>
            <select
              value={seller.sellerType}
              onChange={(e) =>
                setSeller({ ...seller, sellerType: e.target.value })
              }
            >
              <option value="OWNER">Owner</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>

          <h3 className="section-label small">Upload Images</h3>

          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input"
            onChange={(e) => {
              const files = [...e.target.files].map((file) => ({
                file,
                url: URL.createObjectURL(file),
              }));
              setImages((prev) => [...prev, ...files]);
            }}
          />

          <div className="image-grid" onDragOver={(e) => e.preventDefault()}>
            {images.map((img, index) => (
              <div
                key={index}
                className="img-box"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("dragIndex", index)
                }
                onDrop={(e) => {
                  const from = Number(e.dataTransfer.getData("dragIndex"));
                  const to = index;

                  const arr = [...images];
                  const moved = arr.splice(from, 1)[0];
                  arr.splice(to, 0, moved);

                  setImages(arr);
                }}
              >
                <img src={img.url} alt="" />
                <button
                  className="remove-img"
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------- */}
        {/* SUBMIT BUTTON — NOW HAS LOADING STATE */}
        {/* ---------------------------------------------- */}
        <div className="submit-row">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Property"}
          </button>
        </div>

      </div>
    </div>
  );
}
