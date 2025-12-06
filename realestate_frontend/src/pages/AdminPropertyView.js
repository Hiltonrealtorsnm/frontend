import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProperty,
  approveProperty,
  rejectProperty,
} from "../api/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_property_view.css";

export default function AdminPropertyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  const loadData = async () => {
    try {
      const res = await getProperty(id);
      setProperty(res.data);
    } catch (err) {
      console.error("Failed to load property", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!property) return <AdminLayout>Loading...</AdminLayout>;

  const handleApprove = async () => {
    try {
      await approveProperty(property.propertyId);
      alert("Property moved to APPROVED");
      loadData();
    } catch (err) {
      alert(err.response?.data || "Failed to approve");
    }
  };

  const handleReject = async () => {
    try {
      await rejectProperty(property.propertyId);
      alert("Property moved to REJECTED");
      loadData();
    } catch (err) {
      alert(err.response?.data || "Failed to reject");
    }
  };

  return (
    <AdminLayout>
      <div className="property-view-container">

        {/* BACK BUTTON */}
        <button
          className="pv-back-btn"
          onClick={() => navigate("/admin/properties")}
        >
          ← Back to Manage Properties
        </button>

        <h1>{property.title}</h1>

        <div className="pv-top">

          {/* PROPERTY IMAGES */}
          <div className="pv-images">
            {property.images?.length > 0 ? (
              property.images.map((img) => (
                <img key={img.imageId} src={img.imageUrl} alt="property" />
              ))
            ) : (
              <p>No images uploaded</p>
            )}
          </div>

          {/* PROPERTY DETAILS */}
          <div className="pv-info">
            {property.listingType === "sale" && (
              <h2>₹ {property.price?.toLocaleString()}</h2>
            )}

            {property.listingType === "rent" && (
              <>
                <h2>Monthly Rent: ₹ {property.monthlyRent?.toLocaleString()}</h2>
                <h3>Deposit: ₹ {property.securityDeposit?.toLocaleString()}</h3>
              </>
            )}

            <p>
              <b>Status: </b>
              <span className={`pv-status ${property.status}`}>
                {property.status.toUpperCase()}
              </span>
            </p>

            <p><b>Bedrooms:</b> {property.bedrooms}</p>
            <p><b>Bathrooms:</b> {property.bathrooms}</p>
            <p><b>Area:</b> {property.areaSqft} sqft</p>
            <p><b>Furnishing:</b> {property.furnishing}</p>
            <p><b>Type:</b> {property.propertyType}</p>

            {/* ACTION BUTTONS */}
            <div className="pv-btns">
              {property.status === "pending" && (
                <>
                  <button className="btn-approve" onClick={handleApprove}>Approve</button>
                  <button className="btn-reject" onClick={handleReject}>Reject</button>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/admin/property/edit/${property.propertyId}`)
                    }
                  >
                    Edit Property
                  </button>
                </>
              )}

              {property.status === "approved" && (
                <>
                  <button className="btn-reject" onClick={handleReject}>
                    Move to REJECTED
                  </button>

                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/admin/property/edit/${property.propertyId}`)
                    }
                  >
                    Edit Property
                  </button>
                </>
              )}

              {property.status === "rejected" && (
                <>
                  <button className="btn-approve" onClick={handleApprove}>
                    Move to APPROVED
                  </button>

                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/admin/property/edit/${property.propertyId}`)
                    }
                  >
                    Edit Property
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <h3>Description</h3>
        <p className="pv-description">{property.description}</p>

        {/* ADDRESS + SELLER DETAILS SIDE BY SIDE */}
        <div className="address-seller-wrapper">

          {/* ADDRESS */}
          <div className="address-box">
            <h3>Address</h3>
            <p>
              {property.address.houseNo}, {property.address.street},<br />
              {property.address.area}, {property.address.city},<br />
              {property.address.state} - {property.address.pincode}
            </p>
          </div>

          {/* SELLER DETAILS */}
          <div className="seller-box">
            <h3>Seller Details</h3>

            <p><b>Seller Type:</b> {property.seller.sellerType}</p>
            <p><b>Name:</b> {property.seller.sellerName}</p>
            <p><b>Email:</b> {property.seller.email}</p>
            <p><b>Phone:</b> {property.seller.phone}</p>

            <div className="seller-contact-btns">
              <a href={`tel:${property.seller.phone}`} className="seller-call-btn">
                📞 Call Seller
              </a>

              <a
                href={`mailto:${property.seller.email}?subject=Regarding your property listing (${property.title})`}
                className="seller-mail-btn"
              >
                ✉️ Email Seller
              </a>
              <a
                href={`whatsapp://send?phone=91${property.seller.phone}&text=Hi ${property.seller.sellerName}, I am contacting you regarding your property: ${property.title}`}
                className="seller-whatsapp-btn"
              >
                🟢 WhatsApp
              </a>


            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
