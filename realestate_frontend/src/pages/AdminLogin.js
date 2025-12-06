import React, { useState } from "react";
import api from "../api/api";
import "../styles/admin/admin_login.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState("email");
  const [loading, setLoading] = useState(false);

  // ---------------- LOGIN FUNCTION ----------------
  const handleAdminLogin = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);

      alert("Welcome Admin!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      alert("Invalid Admin Credentials");
    }
    setLoading(false);
  };

  // ---------------- STEP 1 — SEND OTP ----------------
  const sendOtp = async () => {
    if (!fpEmail) {
      alert("Enter your registered admin email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/forgot-password", { email: fpEmail });
      alert("OTP sent to your email");
      setStage("otp");
    } catch (err) {
      alert("Email not found");
    }
    setLoading(false);
  };

  // ---------------- STEP 2 — RESET PASSWORD ----------------
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Enter OTP & New Password");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/reset-password", {
        email: fpEmail,
        otp,
        newPassword,
      });

      alert("Password reset successfully!");

      // Reset all fields
      closePopup();
    } catch (err) {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  // ---------------- CLOSE POPUP ----------------
  const closePopup = () => {
    setShowForgot(false);
    setStage("email");
    setFpEmail("");
    setOtp("");
    setNewPassword("");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Panel Login</h1>

        {/* LOGIN FORM */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-admin-login"
          onClick={handleAdminLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="forgot-password-link" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </p>
      </div>

      {/* ---------------- FORGOT PASSWORD POPUP ---------------- */}
      {showForgot && (
        <div className="forgot-popup">
          <div className="popup-box">

            {/* HEADER WITH CLOSE BUTTON RIGHT SIDE */}
            <div className="popup-header">
              <h2>Reset Password</h2>
              <button className="close-popup" onClick={closePopup}>×</button>
            </div>

            {/* STEP 1 – Enter Email */}
            {stage === "email" && (
              <>
                <input
                  type="text"
                  placeholder="Enter Registered Admin Email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                />

                <button
                  onClick={sendOtp}
                  className="btn-admin-login"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* STEP 2 – Enter OTP */}
            {stage === "otp" && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                  onClick={resetPassword}
                  className="btn-admin-login"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="resend-otp" onClick={sendOtp}>
                  Resend OTP
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
