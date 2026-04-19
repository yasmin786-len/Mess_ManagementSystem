import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin() {
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
      navigate("/admin-dashboard");
    } catch (error) {
      setMessage("Server error. Try again.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #bbf7d0", outline: "none",
    background: "#f0fdf4", fontFamily: "'Poppins', sans-serif",
    fontSize: "14px", color: "#2b2b2b", boxSizing: "border-box"
  };

  return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#ecfff5",
        fontFamily: "'Poppins', sans-serif", padding: "20px"
      }}>

        {/* Back */}
        <button onClick={() => navigate("/")} style={{
          position: "absolute", top: "24px", left: "24px",
          background: "rgba(34,197,94,0.1)", border: "none",
          padding: "8px 16px", borderRadius: "10px",
          color: "#22c55e", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500
        }}>
          ← Back
        </button>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "420px", background: "#ffffff",
          padding: "40px 32px", borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(34,197,94,0.12)",
          border: "1.5px solid rgba(34,197,94,0.18)"
        }}>

          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <ShieldCheck size={32} color="#fff" />
            </div>
          </div>

          <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "22px", color: "#2b2b2b", marginBottom: "4px" }}>
            Admin Login
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>
            Access your admin portal
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input type="text" placeholder="Enter your Admin ID"
                   value={userId} autoComplete="off"
                   onChange={(e) => setUserId(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Enter your password"
                   value={password} autoComplete="new-password"
                   onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

            <button onClick={handleLogin} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #22c55e, #16a34a)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", marginTop: "4px"
            }}>
              Login
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/admin-signup")}
                    style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>
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