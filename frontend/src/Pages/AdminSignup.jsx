import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");
    if (!fullName.trim() || !userId.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("Please fill all fields"); return;
    }
    if (password !== confirmPassword) { setMessage("Passwords do not match"); return; }
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(), userId: userId.trim(),
          email: email.trim(), password: password.trim(), role: "ADMIN"
        })
      });
      if (!response.ok) { const errorText = await response.text(); setMessage(errorText); return; }
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify({ id: data.id, fullName: data.fullName, role: data.role }));
      navigate("/admin-dashboard");
    } catch (error) {
      setMessage("Server error");
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
            Admin Sign Up
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>
            Create your admin account
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input type="text" placeholder="Full Name" value={fullName}
                   autoComplete="off" onChange={(e) => setFullName(e.target.value)} style={inputStyle} />

            <input type="text" placeholder="Admin ID (e.g. ADM-2026-0001)" value={userId}
                   autoComplete="off" onChange={(e) => setUserId(e.target.value)} style={inputStyle} />

            <input type="email" placeholder="Enter your email" value={email}
                   autoComplete="off" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Password" value={password}
                   autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Confirm Password" value={confirmPassword}
                   autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

            <button onClick={handleRegister} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #22c55e, #16a34a)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", marginTop: "4px"
            }}>
              Create Account
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/admin-login")}
                    style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>
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