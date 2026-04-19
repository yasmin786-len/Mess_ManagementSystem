import StudentLayout from "../components/StudentLayout";
import { Upload, LogOut, Trash2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ fullName: user?.fullName || "", email: user?.email || "" });
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ newPass: "", confirmPass: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/student/update/${user.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: form.fullName, email: form.email })
      });
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      alert("Profile updated ✅");
    } catch (err) { alert("Update failed ❌"); }
  };

  const handlePasswordSave = async () => {
    if (password.newPass !== password.confirmPass) { alert("Passwords do not match ❌"); return; }
    try {
      const res = await fetch(`http://localhost:8080/api/student/change-password/${user.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.newPass })
      });
      if (!res.ok) throw new Error();
      alert("Password updated ✅");
      setPassword({ newPass: "", confirmPass: "" });
    } catch (err) { alert("Password update failed ❌"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete account permanently?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/student/${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("Account deleted ✅");
      localStorage.removeItem("user"); navigate("/");
    } catch (err) { alert("Delete failed ❌"); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  useEffect(() => {
    fetch(`http://localhost:8080/api/student/${user.id}`)
        .then(res => res.json())
        .then(data => { setUserData(data); setForm({ fullName: data.fullName, email: data.email }); })
        .catch(err => console.log(err));
  }, []);

  const cardStyle = {
    background: "#ffffff", borderRadius: "16px", padding: "24px",
    border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)", marginBottom: "16px"
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #c7d2fe", outline: "none", background: "#f5f3ff",
    fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#2b2b2b",
    boxSizing: "border-box"
  };

  return (
      <StudentLayout active="settings">

        <button onClick={() => navigate("/student-dashboard")} style={{
          background: "rgba(99,102,241,0.1)", border: "none", padding: "8px 16px",
          borderRadius: "10px", color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
        }}>← Back</button>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: "0 0 24px" }}>Settings</h1>

        <div style={{ maxWidth: "600px", margin: "0 auto" }}>

          {/* PROFILE */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>Profile</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", position: "relative" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "3px solid #c7d2fe" }}>
                {image ? (
                    <img src={URL.createObjectURL(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #6366f1, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: "#fff" }}>
                      {form.fullName?.charAt(0)}
                    </div>
                )}
              </div>
              <label style={{ position: "absolute", bottom: 0, right: "calc(50% - 48px)", background: "#6366f1", padding: "6px", borderRadius: "50%", cursor: "pointer" }}>
                <Upload size={14} color="#fff" />
                <input type="file" hidden onChange={e => setImage(e.target.files[0])} />
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" style={inputStyle} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
            </div>
            <button onClick={handleSave} style={{
              marginTop: "16px", padding: "10px 24px", borderRadius: "10px",
              background: "linear-gradient(to right, #6366f1, #ec4899)",
              border: "none", color: "#fff", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif"
            }}>Save Changes</button>
          </div>

          {/* ACCOUNT INFO */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Account Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[{ label: "Student ID", value: userData?.userId }, { label: "Mess No", value: userData?.messNo }].map(item => (
                  <div key={item.label} style={{ background: "#f5f3ff", borderRadius: "10px", padding: "14px 16px", border: "1px solid #c7d2fe" }}>
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 4px" }}>{item.label}</p>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#6366f1", margin: 0 }}>{item.value}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* PASSWORD */}
          <div style={cardStyle}>
            <button onClick={() => setShowPassword(!showPassword)} style={{
              display: "flex", justifyContent: "space-between", width: "100%",
              background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              fontSize: "14px", fontWeight: 600, color: "#2b2b2b", alignItems: "center"
            }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={16} color="#6366f1" /> Change Password
            </span>
              <span style={{ color: "#6366f1" }}>{showPassword ? "↑" : "↓"}</span>
            </button>
            {showPassword && (
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="password" placeholder="New Password" value={password.newPass}
                         onChange={e => setPassword({ ...password, newPass: e.target.value })} style={inputStyle} />
                  <input type="password" placeholder="Confirm Password" value={password.confirmPass}
                         onChange={e => setPassword({ ...password, confirmPass: e.target.value })} style={inputStyle} />
                  <button onClick={handlePasswordSave} style={{
                    padding: "10px 20px", borderRadius: "10px", width: "fit-content",
                    background: "linear-gradient(to right, #22c55e, #16a34a)",
                    border: "none", color: "#fff", fontWeight: 600, fontSize: "13px",
                    cursor: "pointer", fontFamily: "'Poppins', sans-serif"
                  }}>Save Password</button>
                </div>
            )}
          </div>

          {/* ACTIONS */}
          <div style={{ ...cardStyle, display: "flex", gap: "12px" }}>
            <button onClick={handleLogout} style={{
              flex: 1, padding: "12px", borderRadius: "10px",
              background: "#eff6ff", border: "1.5px solid #bfdbfe",
              color: "#3b82f6", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}><LogOut size={16} /> Logout</button>
            <button onClick={handleDelete} style={{
              flex: 1, padding: "12px", borderRadius: "10px",
              background: "#fff1f2", border: "1.5px solid #fecdd3",
              color: "#ef4444", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}><Trash2 size={16} /> Delete Account</button>
          </div>
        </div>
      </StudentLayout>
  );
}