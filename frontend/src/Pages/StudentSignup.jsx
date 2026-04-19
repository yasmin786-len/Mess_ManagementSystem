import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StudentSignup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!fullName || !userId || !email || !password || !confirmPassword || !gender || !branch) {
      setMessage("Please fill all fields"); return;
    }
    if (password !== confirmPassword) { setMessage("Passwords do not match"); return; }
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, userId, email, password, gender, branch, role: "STUDENT" })
      });
      if (!response.ok) { const errorText = await response.text(); setMessage(errorText); return; }
      localStorage.removeItem("user");
      const responseData = await response.json();
      localStorage.setItem("user", JSON.stringify({
        id: responseData.id, fullName: responseData.fullName,
        userId: responseData.userId, role: "STUDENT"
      }));
      navigate("/student-dashboard");
    } catch (error) {
      setMessage("Server error. Try again.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #c7d2fe", outline: "none",
    background: "#f5f3ff", fontFamily: "'Poppins', sans-serif",
    fontSize: "14px", color: "#2b2b2b", boxSizing: "border-box"
  };

  return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#eef1ff",
        fontFamily: "'Poppins', sans-serif", padding: "20px"
      }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          position: "absolute", top: "24px", left: "24px",
          background: "rgba(99,102,241,0.1)", border: "none",
          padding: "8px 16px", borderRadius: "10px",
          color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500
        }}>
          ← Back
        </button>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "420px", background: "#ffffff",
          padding: "40px 32px", borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(99,102,241,0.12)",
          border: "1.5px solid rgba(99,102,241,0.18)"
        }}>

          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <GraduationCap size={32} color="#fff" />
            </div>
          </div>

          <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: "22px", color: "#2b2b2b", marginBottom: "4px" }}>
            Student Sign Up
          </h2>
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", marginBottom: "28px" }}>
            Create your student account
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            <input type="text" placeholder="Full Name" value={fullName}
                   autoComplete="off" onChange={(e) => setFullName(e.target.value)} style={inputStyle} />

            <input type="text" placeholder="Student ID (e.g. STU-2026-0001)" value={userId}
                   autoComplete="off" onChange={(e) => setUserId(e.target.value)} style={inputStyle} />

            <input type="email" placeholder="Enter your email" value={email}
                   autoComplete="off" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

            <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select value={branch} onChange={(e) => setBranch(e.target.value)} style={inputStyle}>
              <option value="">Select Academic Level</option>
              <option value="PUC-1">PUC-1</option>
              <option value="PUC-2">PUC-2</option>
              <option value="BTECH-1">BTech 1st Year</option>
              <option value="BTECH-2">BTech 2nd Year</option>
              <option value="BTECH-3">BTech 3rd Year</option>
              <option value="BTECH-4">BTech 4th Year</option>
            </select>

            <input type="password" placeholder="Password" value={password}
                   autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

            <input type="password" placeholder="Confirm Password" value={confirmPassword}
                   autoComplete="new-password" onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

            <button onClick={handleRegister} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #6366f1, #ec4899)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", marginTop: "4px"
            }}>
              Create Account
            </button>

            <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", margin: 0 }}>
              Already have an account?{" "}
              <span onClick={() => navigate("/student-login")}
                    style={{ color: "#6366f1", cursor: "pointer", fontWeight: 600 }}>
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