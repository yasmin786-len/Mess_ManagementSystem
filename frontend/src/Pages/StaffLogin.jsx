import { CookingPot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) { setMessage("Please fill all fields"); return; }
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });
      if (!response.ok) { setMessage("Invalid credentials"); return; }
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === "STAFF") navigate("/staff-dashboard");
      else setMessage("Not authorized as staff");
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
            Staff Login
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>
            Access your staff portal
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input type="text" placeholder="Enter your Staff ID"
                   value={userId} autoComplete="off"
                   onChange={(e) => setUserId(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Enter your password"
                   value={password} autoComplete="new-password"
                   onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

            <button onClick={handleLogin} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #f97316, #ef4444)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", marginTop: "4px"
            }}>
              Login
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/staff-signup")}
                    style={{ color: "#f97316", cursor: "pointer", fontWeight: 600 }}>
              Sign Up
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