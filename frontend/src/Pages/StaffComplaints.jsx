import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#7c3a00", transition: "all 0.2s"
};

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1.5px solid #fed7aa", outline: "none", background: "#fff7f0",
  fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#2b2b2b",
  boxSizing: "border-box", marginTop: "12px", resize: "vertical"
};

export default function StaffComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [responseMap, setResponseMap] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.messNo) return;
    fetch(`http://localhost:8080/api/staff/complaints/${user.messNo}`)
        .then(res => res.json()).then(data => setComplaints(data))
        .catch(err => console.log(err));
  }, []);

  const handleResolve = async (id) => {
    const response = responseMap[id] || "";
    try {
      await fetch(`http://localhost:8080/api/staff/complaints/resolve/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response })
      });
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved", response } : c));
    } catch (err) { console.log(err); }
  };

  const filtered = complaints.filter(c => filter === "ALL" || c.status === filter);

  return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#fff4ec" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #fed7aa", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", marginBottom: "32px" }}>🍳 Staff Portal</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Dashboard", path: "/staff-dashboard" },
              { label: "Menu",      path: "/staff-menu" },
              { label: "Meals",     path: "/staff-meals" },
              { label: "Wastage",   path: "/staff-wastage" },
            ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)} style={sidebarItem}
                     onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {item.label}
                </div>
            ))}
            <div style={{ ...sidebarItem, background: "linear-gradient(to right, #f97316, #ef4444)", color: "#fff", fontWeight: 600 }}>
              Complaints
            </div>
          </div>
          <div style={{ marginTop: "auto" }}>
            <div onClick={() => navigate("/")} style={{ ...sidebarItem, color: "#ef4444", background: "#fff1f2" }}
                 onMouseEnter={e => e.currentTarget.style.background = "#ffe4e6"}
                 onMouseLeave={e => e.currentTarget.style.background = "#fff1f2"}>
              ← Logout
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>

          <button onClick={() => navigate(-1)} style={{
            background: "rgba(249,115,22,0.1)", border: "none", padding: "8px 16px",
            borderRadius: "10px", color: "#f97316", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
          }}>← Back</button>

          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Complaints</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "20px" }}>View and manage student complaints</p>

          {/* FILTER */}
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{
            padding: "10px 16px", borderRadius: "10px", border: "1.5px solid #fed7aa",
            background: "#fff7f0", fontFamily: "'Poppins', sans-serif", fontSize: "13px",
            color: "#2b2b2b", outline: "none", marginBottom: "24px", cursor: "pointer"
          }}>
            <option value="ALL">All</option>
            <option value="Forwarded">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(c => (
                <div key={c.id} style={{
                  background: "#ffffff", borderRadius: "16px", padding: "24px",
                  border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.07)"
                }}>
                  {/* BADGES */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, background: "#fff7f0", color: "#f97316", border: "1px solid #fed7aa" }}>
                  {c.category}
                </span>
                    {c.priority && (
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                          background: c.priority === "High" ? "#fff1f2" : c.priority === "Medium" ? "#fffbeb" : "#f0fdf4",
                          color: c.priority === "High" ? "#ef4444" : c.priority === "Medium" ? "#f59e0b" : "#22c55e",
                        }}>
                    {c.priority}
                  </span>
                    )}
                    <span style={{
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                      background: c.status === "Resolved" ? "#f0fdf4" : "#fffbeb",
                      color: c.status === "Resolved" ? "#22c55e" : "#f59e0b",
                    }}>
                  {c.status}
                </span>
                    <span style={{ fontSize: "12px", color: "#6b7280", alignSelf: "center" }}>{c.date}</span>
                  </div>

                  <p style={{ fontSize: "14px", color: "#2b2b2b", margin: "0 0 4px" }}>{c.description}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>— {c.user?.fullName}</p>

                  {c.status !== "Resolved" && (
                      <>
                  <textarea
                      placeholder="Enter action taken..."
                      style={inputStyle}
                      onChange={(e) => setResponseMap({ ...responseMap, [c.id]: e.target.value })}
                  />
                        <button onClick={() => handleResolve(c.id)} style={{
                          marginTop: "12px", padding: "10px 24px", borderRadius: "10px",
                          background: "linear-gradient(to right, #22c55e, #16a34a)",
                          border: "none", color: "#fff", fontWeight: 600,
                          fontSize: "13px", cursor: "pointer", fontFamily: "'Poppins', sans-serif"
                        }}>
                          Resolve
                        </button>
                      </>
                  )}

                  {c.status === "Resolved" && c.response && (
                      <p style={{ marginTop: "12px", fontSize: "13px", color: "#22c55e", fontWeight: 500 }}>
                        ✔ {c.response}
                      </p>
                  )}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}