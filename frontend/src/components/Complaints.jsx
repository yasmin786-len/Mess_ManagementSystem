import { useEffect, useState } from "react";
import StudentLayout from "../components/StudentLayout";
import { useNavigate } from "react-router-dom";

export default function Complaints() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [complaints, setComplaints] = useState([]);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("Food Quality");
  const [description, setDescription] = useState("");

  const fetchComplaints = async () => {
    const res = await fetch(`http://localhost:8080/api/complaints/user/${userId}`);
    setComplaints((await res.json()).reverse());
  };

  useEffect(() => { if (userId) fetchComplaints(); }, [userId]);

  const submitComplaint = async () => {
    if (!description) return alert("Enter description");
    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);
    const res = await fetch(`http://localhost:8080/api/complaints/submit/${userId}`, { method: "POST", body: formData });
    const data = await res.json();
    setComplaints(prev => [data, ...prev]);
    setDescription(""); setImage(null);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1.5px solid #c7d2fe", outline: "none", background: "#f5f3ff",
    fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#2b2b2b",
    boxSizing: "border-box"
  };

  const panelStyle = {
    background: "#ffffff", borderRadius: "16px", padding: "24px",
    border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)"
  };

  return (
      <StudentLayout active="complaints">

        <button onClick={() => navigate(-1)} style={{
          background: "rgba(99,102,241,0.1)", border: "none", padding: "8px 16px",
          borderRadius: "10px", color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
        }}>← Back</button>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: "0 0 24px" }}>Complaints</h1>

        <div style={{ display: "flex", gap: "20px" }}>

          {/* LEFT - SUBMIT */}
          <div style={{ ...panelStyle, flex: 1 }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>Submit a Complaint</h2>

            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, marginTop: "6px", marginBottom: "16px" }}>
              <option>Food Quality</option>
              <option>Hygiene</option>
              <option>Quantity</option>
            </select>

            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Describe your complaint..."
                      style={{ ...inputStyle, marginTop: "6px", marginBottom: "16px", height: "120px", resize: "vertical" }} />

            <label style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Attach Image (optional)</label>
            <div style={{
              marginTop: "6px", marginBottom: "16px", padding: "16px", borderRadius: "10px",
              border: "1.5px dashed #c7d2fe", background: "#f5f3ff", textAlign: "center"
            }}>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
                     style={{ fontSize: "13px", color: "#6366f1" }} />
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>⬆ Click to upload image</p>
              {image && <img src={URL.createObjectURL(image)} style={{ width: "80px", marginTop: "10px", borderRadius: "8px" }} />}
            </div>

            <button onClick={submitComplaint} style={{
              width: "100%", padding: "13px", borderRadius: "10px",
              background: "linear-gradient(to right, #6366f1, #ec4899)",
              border: "none", color: "#fff", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif"
            }}>✈ Submit Complaint</button>
          </div>

          {/* RIGHT - LIST */}
          <div style={{ ...panelStyle, flex: 1 }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>Your Complaints</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {complaints.map(c => (
                  <div key={c.id} style={{
                    background: "#f5f3ff", borderRadius: "12px", padding: "14px 16px",
                    border: "1px solid #c7d2fe", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: "#e0e7ff", color: "#6366f1" }}>
                      {c.category}
                    </span>
                        <span style={{
                          padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                          background: c.status === "Pending" ? "#fffbeb" : "#f0fdf4",
                          color: c.status === "Pending" ? "#f59e0b" : "#22c55e"
                        }}>{c.status}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#2b2b2b", margin: 0 }}>{c.description}</p>
                      {c.imageUrl && <img src={`http://localhost:8080/uploads/${c.imageUrl}`} style={{ marginTop: "8px", width: "80px", borderRadius: "8px" }} />}
                    </div>
                    <span style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap", marginLeft: "12px" }}>{c.date}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </StudentLayout>
  );
}