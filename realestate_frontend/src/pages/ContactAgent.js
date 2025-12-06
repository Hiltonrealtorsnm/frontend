import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendEnquiry } from "../api/api";
import "../styles/pages/contactAgent.css";

export default function ContactAgent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    buyerName: "",
    phone: "",
    email: "",
    message: "",
    propertyId: Number(id)
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ------------------ VALIDATION ------------------ */
  const validate = () => {
    if (!form.buyerName.trim()) return "Please enter your name";
    if (!/^[0-9]{10}$/.test(form.phone))
      return "Phone number must be 10 digits";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Please enter a valid email";
    if (!form.message.trim()) return "Please enter a message";
    return null;
  };

  /* ------------------ SUBMIT FORM ------------------ */
  const submit = async () => {
    if (loading) return; // Prevent double click

    const error = validate();
    if (error) return alert(error);

    setLoading(true);
    try {
      await sendEnquiry(form);
      alert("Enquiry sent successfully!");

      // Reset form after submit
      setForm({
        buyerName: "",
        phone: "",
        email: "",
        message: "",
        propertyId: Number(id)
      });

    } catch (err) {
      alert("Error sending enquiry. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="contact-page">

      {/* Back Button */}
      <button className="contact-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="contact-title">Contact Agent</h1>

      <div className="contact-box">
        <input
          name="buyerName"
          value={form.buyerName}
          onChange={handleChange}
          placeholder="Your Name"
          className="contact-input"
          disabled={loading}
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="contact-input"
          disabled={loading}
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="contact-input"
          disabled={loading}
        />

        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          className="contact-textarea"
          disabled={loading}
        />

        <button
          className="contact-submit-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Enquiry"}
        </button>
      </div>
    </div>
  );
}
