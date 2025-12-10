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
    price: "",       // SALE
    rentPrice: "",   // RENT
    deposit: "",     // RENT
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!seller.sellerName.trim()) return "Seller name is required!";
    if (!seller.phone.trim()) return "Seller phone is required!";
    if (!seller.email.trim()) return "Seller email is required!";

    if (!property.title.trim()) return "Property title is required!";
    if (!property.description.trim()) return "Description required!";
    if (!property.bedrooms) return "Bedrooms required!";
    if (!property.bathrooms) return "Bathrooms required!";
    if (!property.areaSqft) return "Area is required!";

    if (property.listingType === "sale" && !property.price)
      return "Sale price is required!";

    if (property.listingType === "rent") {
      if (!property.rentPrice) return "Monthly rent is required!";
      if (!property.deposit) return "Deposit amount is required!";
    }

    const a = property.address;
    if (!a.houseNo.trim()) return "House No required!";
    if (!a.street.trim()) return "Street required!";
    if (!a.area.trim()) return "Area required!";
    if (!a.city.trim()) return "City required!";
    if (!a.state.trim()) return "State required!";
    if (!a.pincode.trim()) return "Pincode required!";

    if (images.length === 0) return "At least 1 image is required!";

    return null;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (isSubmitting) return;

    const err = validate();
    if (err) return alert(err);

    setIsSubmitting(true);

    try {
      const sellerRes = await addOrUpdateSeller(seller);
      const sellerId = sellerRes.data.sellerId;

      const finalProperty = {
        ...property,
        seller: { sellerId },

        price:
          property.listingType === "sale"
            ? Number(property.price)
            : Number(property.rentPrice),

        rentPrice:
          property.listingType === "rent"
            ? Number(property.rentPrice)
            : null,

        deposit:
          property.listingType === "rent"
            ? Number(property.deposit)
            : null,

        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        areaSqft: Number(property.areaSqft),
      };

      const propertyRes = await addProperty(finalProperty);
      const propertyId = propertyRes.data.propertyId;

      if (images.length > 0) {
        const files = images.map((i) => i.file);
        await uploadPropertyImages(propertyId, files);
      }

      alert("✅ Property submitted successfully!");
      window.location.href = "/properties";

    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="sell-wrapper">
      <h1 className="sell-title">List Your Property</h1>

      <div className="sell-card">
        {/* ------------ PROPERTY INFO ------------ */}
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
            <input required value={property.title}
              onChange={(e) => setProperty({ ...property, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea required value={property.description}
              onChange={(e) => setProperty({ ...property, description: e.target.value })}
            />
          </div>

          {/* ----- SALE / RENT LOGIC ----- */}
          <div className="form-row">
            <div className="form-group half">
              <label>Listing Type</label>
              <select
                value={property.listingType}
                onChange={(e) =>
                  setProperty({
                    ...property,
                    listingType: e.target.value,
                    price: "",
                    rentPrice: "",
                    deposit: "",
                  })
                }
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            {property.listingType === "sale" && (
              <div className="form-group half">
                <label>Sale Price</label>
                <input required type="number"
                  value={property.price}
                  onChange={(e) =>
                    setProperty({ ...property, price: e.target.value })
                  }
                />
              </div>
            )}

            {property.listingType === "rent" && (
              <>
                <div className="form-group half">
                  <label>Monthly Rent</label>
                  <input required type="number"
                    value={property.rentPrice}
                    onChange={(e) =>
                      setProperty({ ...property, rentPrice: e.target.value })
                    }
                  />
                </div>

                <div className="form-group half">
                  <label>Deposit</label>
                  <input required type="number"
                    value={property.deposit}
                    onChange={(e) =>
                      setProperty({ ...property, deposit: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Bedrooms</label>
              <input required type="number"
                value={property.bedrooms}
                onChange={(e) =>
                  setProperty({ ...property, bedrooms: e.target.value })
                }
              />
            </div>

            <div className="form-group half">
              <label>Bathrooms</label>
              <input required type="number"
                value={property.bathrooms}
                onChange={(e) =>
                  setProperty({ ...property, bathrooms: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Area (sqft)</label>
            <input required type="number"
              value={property.areaSqft}
              onChange={(e) =>
                setProperty({ ...property, areaSqft: e.target.value })
              }
            />
          </div>

          {/* ------------ ADDRESS ------------ */}
          <h3 className="section-label small">Address</h3>
          <div className="address-grid">
            {["houseNo", "street", "area", "city", "state", "pincode"].map(
              (field) => (
                <div className="form-group" key={field}>
                  <label>{field.toUpperCase()}</label>
                  <input required
                    value={property.address[field]}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        address: { ...property.address, [field]: e.target.value },
                      })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* ------------ SELLER INFO ------------ */}
        <div className="sell-col">
          <h3 className="section-label">Seller Info</h3>

          <div className="form-group">
            <label>Full Name</label>
            <input required value={seller.sellerName}
              onChange={(e) =>
                setSeller({ ...seller, sellerName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input required value={seller.phone}
              onChange={(e) =>
                setSeller({ ...seller, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input required type="email" value={seller.email}
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

          {/* ------------ IMAGES ------------ */}
          <h3 className="section-label small">Upload Images</h3>

          <input type="file" multiple required accept="image/*"
            className="file-input"
            onChange={(e) => {
              const files = [...e.target.files].map((file) => ({
                file,
                url: URL.createObjectURL(file),
              }));
              setImages((prev) => [...prev, ...files]);
            }}
          />

          <div className="image-grid">
            {images.map((img, index) => (
              <div key={index} className="img-box">
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

        {/* ------------ SUBMIT ------------ */}
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
