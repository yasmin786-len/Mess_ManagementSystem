import { CookingPot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StaffSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messNo, setMessNo] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!fullName || !userId || !password || !confirmPassword || !messNo) {
      setMessage("Please fill all fields"); return;
    }
    if (password !== confirmPassword) { setMessage("Passwords do not match"); return; }
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, userId, password, role: "STAFF", messNo })
      });
      if (!response.ok) {
        const text = await response.text();
        setMessage(text || "User already exists"); return;
      }
      navigate("/staff-login");
    } catch {
      setMessage("Server error. Try again.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #fed7aa", outline: "none",
    background: "#fff7f0", fontFamily: "'Poppins', sans-serif",
    fontSize: "14px", color: "#2b2b2b", boxSizing: "border-box"
  };

  return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#fff4ec",
        fontFamily: "'Poppins', sans-serif", padding: "20px"
      }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          position: "absolute", top: "24px", left: "24px",
          background: "rgba(249,115,22,0.1)", border: "none",
          padding: "8px 16px", borderRadius: "10px",
          color: "#f97316", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500
        }}>
          ← Back
        </button>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "420px", background: "#ffffff",
          padding: "40px 32px", borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(249,115,22,0.12)",
          border: "1.5px solid rgba(249,115,22,0.18)"
        }}>

          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CookingPot size={32} color="#fff" />
            </div>
          </div>

          <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "22px", color: "#2b2b2b", marginBottom: "4px" }}>
            Staff Sign Up
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>
            Create your staff account
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input type="text" placeholder="Full Name" value={fullName}
                   autoComplete="off" onChange={(e) => setFullName(e.target.value)} style={inputStyle} />

            <input type="text" placeholder="Staff ID (e.g. STF-2026-0001)" value={userId}
                   autoComplete="off" onChange={(e) => setUserId(e.target.value)} style={inputStyle} />

            <select value={messNo} onChange={(e) => setMessNo(e.target.value)} style={inputStyle}>
              <option value="">Select Mess</option>
              <option value="Mess-1">Mess-1</option>
              <option value="Mess-2">Mess-2</option>
              <option value="Mess-3">Mess-3</option>
              <option value="Mess-4">Mess-4</option>
              <option value="Mess-5">Mess-5</option>
              <option value="Mess-6">Mess-6</option>
            </select>

            <input type="password" placeholder="Password" value={password}
                   autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Confirm Password" value={confirmPassword}
                   autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

            <button onClick={handleRegister} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #f97316, #ef4444)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", marginTop: "4px"
            }}>
              Create Account
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/staff-login")}
                    style={{ color: "#f97316", cursor: "pointer", fontWeight: 600 }}>
              Login
            </span>
            </p>

            {message && (
                <p style={{ textAlign: "center", color: "#ef4444", fontSize: "13px", margin: 0 }}>
                  {message}
                </p>
            )}

          </div>
        </div>
      </div>
  );
}