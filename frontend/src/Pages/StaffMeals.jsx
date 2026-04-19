import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#7c3a00", transition: "all 0.2s"
};

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: "10px",
  border: "1.5px solid #fed7aa", outline: "none", background: "#fff7f0",
  fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#2b2b2b", boxSizing: "border-box"
};

export default function StaffMeals() {
  const navigate = useNavigate();
  const [prepared, setPrepared] = useState("");
  const [leftover, setLeftover] = useState("");
  const [entries, setEntries] = useState([]);
  const [mealType, setMealType] = useState("Breakfast");

  const fetchEntries = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.messNo) return;
    fetch(`http://localhost:8080/api/staff/meals/today-entry/${user.messNo}`)
        .then(res => res.json())
        .then(data => setEntries(Array.isArray(data) ? data : data ? [data] : []))
        .catch(err => console.error(err));
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!prepared || !leftover) { alert("Please enter values"); return; }
    fetch("http://localhost:8080/api/staff/meals/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messNo: user.messNo, mealType, preparedKg: Number(prepared), leftoverKg: Number(leftover) })
    }).then(() => { alert(`${mealType} saved! ✅`); setPrepared(""); setLeftover(""); fetchEntries(); })
        .catch(err => console.error(err));
  };

  return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#fff4ec" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #fed7aa", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", marginBottom: "32px" }}>🍳 Staff Portal</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Dashboard",  path: "/staff-dashboard" },
              { label: "Menu",       path: "/staff-menu" },
              { label: "Wastage",    path: "/staff-wastage" },
              { label: "Complaints", path: "/staff-complaints" },
            ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)} style={sidebarItem}
                     onMouseEnter={e => { e.currentTarget.style.background = "#fff7f0"; }}
                     onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  {item.label}
                </div>
            ))}
            <div style={{ ...sidebarItem, background: "linear-gradient(to right, #f97316, #ef4444)", color: "#fff", fontWeight: 600 }}>
              Meals
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

          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Manage Meals</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "28px" }}>Log food preparation and wastage</p>

          {/* FORM */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "28px",
            border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.08)",
            maxWidth: "860px", marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>Log Meal Data</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} style={inputStyle}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
              <input value={prepared} onChange={(e) => setPrepared(e.target.value)} placeholder="Food Prepared (kg)" style={inputStyle} />
              <input value={leftover} onChange={(e) => setLeftover(e.target.value)} placeholder="Leftover (kg)" style={inputStyle} />
            </div>
            <button onClick={handleSave} style={{
              padding: "12px 28px", borderRadius: "10px",
              background: "linear-gradient(to right, #f97316, #ef4444)",
              border: "none", color: "#fff", fontWeight: 600,
              fontSize: "14px", cursor: "pointer", fontFamily: "'Poppins', sans-serif"
            }}>Save Entry</button>
          </div>

          {/* ENTRIES */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "28px",
            border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.08)", maxWidth: "860px"
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Today's Entries</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {entries.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>No entries yet</p>
              ) : (
                  entries.map(e => (
                      <div key={e.id} style={{
                        background: "#fff7f0", borderRadius: "10px", padding: "14px 20px",
                        border: "1px solid #fed7aa", display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}>
                        <span style={{ fontWeight: 600, color: "#f97316" }}>{e.mealType}</span>
                        <span style={{ fontSize: "13px", color: "#2b2b2b" }}>
                    Prepared: <b>{e.preparedKg}kg</b> | Leftover: <b>{e.leftoverKg}kg</b> | Wastage: <b style={{ color: "#ef4444" }}>{e.wastageKg}kg</b>
                  </span>
                      </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
  );
}