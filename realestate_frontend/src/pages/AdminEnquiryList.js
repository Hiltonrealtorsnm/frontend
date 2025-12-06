import React, { useEffect, useState } from "react";
import {
  getAllEnquiries,
  markPropertySold,
  approveProperty
} from "../api/api";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin/admin_enquiry.css";
import { color } from "chart.js/helpers";

export default function AdminEnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const propertyFilter = params.get("property");

  const load = async () => {
    try {
      const res = await getAllEnquiries(0, 500);
      let list = res.data.content || [];

      if (propertyFilter) {
        list = list.filter(
          (e) => e.property?.propertyId === Number(propertyFilter)
        );
      }

      setEnquiries(list);
    } catch (err) {
      console.error("Failed to load enquiries", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [propertyFilter]);

  // ⭐ Move property to SOLD
  const moveToSold = async (propertyId) => {
    if (!window.confirm("Mark this property as SOLD?")) return;

    try {
      await markPropertySold(propertyId);
      alert("Property marked as SOLD");
      load();
    } catch (err) {
      alert("Failed to update property");
    }
  };

  // ⭐ Move SOLD → APPROVED again
  const moveToApproved = async (propertyId) => {
    if (!window.confirm("Move this property back to APPROVED?")) return;

    try {
      await approveProperty(propertyId);
      alert("Property moved to APPROVED");
      load();
    } catch (err) {
      alert("Failed to update property");
    }
  };

  const downloadEnquiryCSV = () => {
    if (enquiries.length === 0) {
      alert("No enquiries available");
      return;
    }

    const headers = [
      "Enquiry ID",
      "Buyer Name",
      "Phone",
      "Email",
      "Message",
      "Property ID",
      "Property Title",
      "Created At"
    ];

    const rows = enquiries.map((e) => [
      e.enquiryId,
      `"${(e.buyerName || "").replace(/"/g, '""')}"`,
      e.phone || "",
      e.email || "",
      `"${(e.message || "").replace(/"/g, '""')}"`,
      e.property?.propertyId || "",
      `"${(e.property?.title || "").replace(/"/g, '""')}"`,
      e.createdAt ? new Date(e.createdAt).toLocaleString() : ""
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = propertyFilter
      ? `enquiries_property_${propertyFilter}.csv`
      : "enquiries.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="enquiry-container">
        <h1 style={{ color: "black" }}>
          Enquiries {propertyFilter ? `(Property ${propertyFilter})` : ""}
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : enquiries.length === 0 ? (
          <p>No enquiries found</p>
        ) : (
          <>
            <table className="enquiry-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Buyer Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Property ID</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {enquiries.map((e) => {
                  const p = e.property;

                  return (
                    <tr key={e.enquiryId}>
                      <td>{e.enquiryId}</td>
                      <td>{e.buyerName}</td>
                      <td>{e.phone}</td>
                      <td>{e.email}</td>
                      <td>{p?.propertyId}</td>

                      {/* Status: SOLD / move to SOLD / move to APPROVED */}
                      <td>
                        {p?.status === "sold" ? (
                          <>
                            <span className="sold-badge">SOLD</span>
                            <button
                              className="btn-approve"
                              style={{ marginLeft: 8 }}
                              onClick={() => moveToApproved(p.propertyId)}
                            >
                              Move to APPROVED
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-sold"
                            onClick={() => moveToSold(p.propertyId)}
                          >
                            Mark as SOLD
                          </button>
                        )}
                      </td>

                      <td>
                        <Link className="view-btn" to={`/admin/enquiry/${e.enquiryId}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ marginTop: 12 }}>
              <button className="download-btn" onClick={downloadEnquiryCSV}>
                ⬇ Download Enquiries CSV
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
