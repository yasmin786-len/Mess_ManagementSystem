import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminAlerts() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendAlert = async () => {
    if (!title.trim() || !message.trim()) { setStatus("Please enter both title and message"); return; }
    try {
      const res = await fetch("http://localhost:8080/api/admin/send-notification", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message })
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("✅ Alert sent to all students");
      setTitle(""); setMessage("");
    } catch (err) { setStatus("❌ Failed to send alert"); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #bbf7d0", outline: "none", background: "#f0fdf4",
    fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#2b2b2b",
    boxSizing: "border-box", marginBottom: "14px"
  };

  return (
      <AdminLayout title="Send Alerts" backTo="/admin-dashboard">
        <div style={{ maxWidth: "560px" }}>
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "32px",
            border: "1.5px solid #bbf7d0", boxShadow: "0 4px 16px rgba(34,197,94,0.07)"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>
              Send Message to All Students
            </h2>

            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="Enter title (e.g. Dinner Menu)" style={inputStyle} />

            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter message (e.g. Dinner menu changed today)"
                      rows={4} style={{ ...inputStyle, resize: "vertical" }} />

            <button onClick={sendAlert} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #22c55e, #16a34a)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "15px", cursor: "pointer", fontFamily: "'Poppins', sans-serif"
            }}>Send Alert</button>

            {status && (
                <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: status.startsWith("✅") ? "#22c55e" : "#ef4444" }}>
                  {status}
                </p>
            )}
          </div>
        </div>
      </AdminLayout>
  );
}