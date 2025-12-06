import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllEnquiries, deleteEnquiry, getProperty } from "../api/api";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_enquiry_details.css";

export default function AdminEnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getAllEnquiries(0, 500);
      const list = res.data.content || [];
      const found = list.find((e) => String(e.enquiryId) === String(id));

      setEnquiry(found || null);

      if (found?.property?.propertyId) {
        const p = await getProperty(found.property.propertyId);
        setProperty(p.data || null);
      }
    } catch (err) {
      console.error(err);
      setEnquiry(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      alert("Deleted");
      navigate("/admin/enquiries");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div style={{ padding: 20 }}>Loading...</div>
      </AdminLayout>
    );

  if (!enquiry)
    return (
      <AdminLayout>
        <div style={{ padding: 20 }}>Enquiry not found</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="enquiry-details-page">

        {/* LEFT PANEL */}
        <div className="enquiry-left panel">
          <h2 className="section-title">📩 Enquiry Details</h2>

          <div className="detail-item">
            <label>Name</label>
            <p>{enquiry.buyerName}</p>
          </div>

          <div className="detail-item">
            <label>Phone</label>
            <p>{enquiry.phone}</p>
          </div>

          <div className="detail-item">
            <label>Email</label>
            <p>{enquiry.email}</p>
          </div>

          <div className="detail-item">
            <label>Message</label>
            <p className="message-box">{enquiry.message}</p>
          </div>

          <div className="detail-item">
            <label>Created At</label>
            <p>{new Date(enquiry.createdAt).toLocaleString()}</p>
          </div>

          <div className="action-buttons">
            <button className="btn-back" onClick={() => navigate("/admin/enquiries")}>
              ⬅ Back
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              🗑 Delete
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="enquiry-right panel">
          <h2 className="section-title">🏠 Property Details</h2>

          {!property ? (
            <p>No property data</p>
          ) : (
            <>
              <div className="detail-item">
                <label>Title</label>
                <p>{property.title}</p>
              </div>

              <div className="detail-item">
                <label>Listing Type</label>
                <p>{property.listingType === "rent" ? "Rent" : "Sale"}</p>
              </div>

              <div className="detail-item">
                <label>Price</label>
                <p>
                  {property.listingType === "sale"
                    ? `₹ ${property.price?.toLocaleString()}`
                    : `₹ ${property.monthlyRent?.toLocaleString()} / month`}
                </p>
              </div>

              <div className="detail-item">
                <label>Location</label>
                <p>
                  {property.address?.houseNo}, {property.address?.street},{" "}
                  {property.address?.district}, {property.address?.city}
                </p>
              </div>

              <div className="detail-grid">
                <div>
                  <label>Bedrooms</label>
                  <p>{property.bedrooms}</p>
                </div>
                <div>
                  <label>Bathrooms</label>
                  <p>{property.bathrooms}</p>
                </div>
              </div>

              <div className="detail-item">
                <label>Seller</label>
                <p>{property.seller?.sellerName} ({property.seller?.email})</p>
              </div>

              {property.images?.length > 0 && (
                <div className="property-images">
                  {property.images.slice(0, 4).map((img, i) => (
                    <img key={i} src={img.url} alt="" />
                  ))}
                </div>
              )}

              <button
                className="btn-view"
                onClick={() =>
                  navigate(`/admin/property/${property.propertyId}`)
                }
              >
                View Full Property →
              </button>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
