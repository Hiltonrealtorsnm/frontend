import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProperty } from "../api/api";
import "../styles/pages/propertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getProperty(id);
        setProperty(res.data);

        // Check wishlist
        const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setLiked(saved.includes(Number(id)));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const toggleWishlist = () => {
    let saved = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (liked) {
      saved = saved.filter((pid) => pid !== Number(id));
    } else {
      saved.push(Number(id));
    }

    localStorage.setItem("wishlist", JSON.stringify(saved));
    setLiked(!liked);
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Not Found</div>;

  const images = property.images || [];

  return (
    <div className="tokopedia-page">

      {/* Back button */}
      <button className="toko-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* MAIN PRODUCT CARD */}
      <div className="toko-product-card">

        {/* LEFT IMAGES */}
        <div className="toko-left">
          <img
            src={images[current]?.imageUrl}
            className="toko-main-img"
            alt=""
          />

          {/* THUMBNAILS */}
          <div className="toko-thumb-strip">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.imageUrl}
                className={`toko-thumb ${current === i ? "active" : ""}`}
                onClick={() => setCurrent(i)}
                alt=""
              />
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="toko-right">
          <h2 className="toko-title">
            {property.title} — #{property.propertyId}
          </h2>

          <p className="toko-rating">{property.description}</p>

          <h1 className="toko-price">
            ₹{" "}
            {property.listingType === "sale"
              ? property.price?.toLocaleString()
              : property.monthlyRent?.toLocaleString()}
          </h1>

          {/* Wishlist */}
          <button
            className={`toko-wishlist-btn ${liked ? "liked" : ""}`}
            onClick={toggleWishlist}
          >
            ❤️
          </button>

          {/* DETAILS BOX */}
          <div className="toko-tabs">
            <div className="toko-tab selected">Details</div>

            <div className="toko-content-box">
              <div className="toko-info-grid">

                <div className="toko-info-col">
                  <p><b>Bedrooms:</b> {property.bedrooms}</p>
                  <p><b>Bathrooms:</b> {property.bathrooms}</p>
                  <p><b>Sqft:</b> {property.areaSqft}</p>
                </div>

                {/* RIGHT SIDE COLUMN WITH STATE ADDED */}
                <div className="toko-info-col">
                  <p><b>Furnishing:</b> {property.furnishing}</p>
                  <p><b>City:</b> {property.address?.city}</p>
                  <p><b>Area:</b> {property.address?.area}</p>
                  <p><b>State:</b> {property.address?.state}</p>
                </div>

              </div>

              <p className="toko-desc">{property.description}</p>
            </div>
          </div>

          {/* CONTACT BUTTON */}
          <button
            className="toko-contact-btn"
            onClick={() => navigate(`/contact-agent/${property.propertyId}`)}
          >
            Contact Agent
          </button>

        </div>
      </div>
    </div>
  );
}
