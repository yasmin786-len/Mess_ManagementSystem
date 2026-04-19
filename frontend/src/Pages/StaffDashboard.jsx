import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, ChefHat, Trash2, AlertTriangle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [food, setFood] = useState(0);
  const [mealType, setMealType] = useState("");
  const [prepared, setPrepared] = useState(0);
  const [leftover, setLeftover] = useState(0);
  const [complaints, setComplaints] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchDashboardData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`http://localhost:8080/api/staff/meals/today/${user.messNo}`)
        .then(res => res.json())
        .then(data => { setCount(data?.studentsEating || 0); setFood(data?.foodRequiredKg || 0); setMealType(data?.mealType || ""); });
    fetch(`http://localhost:8080/api/staff/meals/today-total/${user.messNo}`)
        .then(res => res.json())
        .then(data => { setPrepared(data.prepared || 0); setLeftover(data.wastage || 0); })
        .catch(err => console.error(err));
    fetch(`http://localhost:8080/api/staff/complaints/${user.messNo}`)
        .then(res => res.json())
        .then(data => { setComplaints(Array.isArray(data) ? data.slice(0, 5) : []); });
    fetch(`http://localhost:8080/api/staff/meals/wastage-trend/${user.messNo}`)
        .then(res => res.json())
        .then(data => { setChartData(Array.isArray(data) ? data : []); });
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const sidebarItem = {
    padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
    fontSize: "14px", color: "#2b2b2b", fontWeight: 500,
    transition: "background 0.2s"
  };

  return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#fff4ec" }}>

        {/* SIDEBAR */}
        <div style={{
          width: "220px", background: "#ffffff", padding: "28px 20px",
          display: "flex", flexDirection: "column",
          borderRight: "1.5px solid #fed7aa", flexShrink: 0
        }}>


          {/* Logo */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", margin: 0 }}>🍳 Staff Portal</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

            {/* Active */}
            <div style={{
              ...sidebarItem,
              background: "linear-gradient(to right, #f97316, #ef4444)",
              color: "#ffffff"
            }}>
              Dashboard
            </div>

            <div onClick={() => navigate("/staff-menu")}
                 style={sidebarItem}
                 onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Menu
            </div>

            <div onClick={() => navigate("/staff-meals")}
                 style={sidebarItem}
                 onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Meals
            </div>

            <div onClick={() => navigate("/staff-wastage")}
                 style={sidebarItem}
                 onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Wastage
            </div>

            <div onClick={() => navigate("/staff-complaints")}
                 style={sidebarItem}
                 onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Complaints
            </div>
          </div>

          {/* Logout at bottom */}
          <div style={{ marginTop: "auto" }}>
            <div onClick={() => navigate("/")}
                 style={{ ...sidebarItem, color: "#ef4444", background: "#fff1f2" }}
                 onMouseEnter={e => e.currentTarget.style.background = "#ffe4e6"}
                 onMouseLeave={e => e.currentTarget.style.background = "#fff1f2"}>
              ← Logout
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          <button
              onClick={() => navigate("/")}
              style={{
                background: "rgba(249,115,22,0.1)", border: "none",
                padding: "8px 16px", borderRadius: "10px",
                color: "#f97316", cursor: "pointer",
                fontFamily: "'Poppins', sans-serif", fontWeight: 500,
                fontSize: "14px", marginBottom: "20px"
              }}
          >
            ← Back
          </button>
          {/* HEADER */}
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>
            Staff Dashboard
          </h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "32px" }}>
            Manage meals and monitor operations
          </p>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>

            {/* Meals Required */}
            <div style={{
              background: "#ffffff", borderRadius: "16px", padding: "24px",
              border: "1.5px solid #fed7aa",
              boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
            }}>
              <UtensilsCrossed size={22} color="#f97316" style={{ marginBottom: "10px" }} />
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>
                Meals Required {mealType && `(${mealType})`}
              </p>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{count}</h2>
            </div>

            {/* Food Prepared */}
            <div style={{
              background: "#ffffff", borderRadius: "16px", padding: "24px",
              border: "1.5px solid #fed7aa",
              boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
            }}>
              <ChefHat size={22} color="#22c55e" style={{ marginBottom: "10px" }} />
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>Food Prepared (kg)</p>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{prepared}</h2>
            </div>

            {/* Wastage */}
            <div style={{
              background: "#ffffff", borderRadius: "16px", padding: "24px",
              border: "1.5px solid #fed7aa",
              boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
            }}>
              <Trash2 size={22} color="#ef4444" style={{ marginBottom: "10px" }} />
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>Wastage (kg)</p>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{leftover}</h2>
            </div>

          </div>

          {/* CHART */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "24px",
            border: "1.5px solid #fed7aa", marginBottom: "24px",
            boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
          }}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px", fontSize: "15px" }}>
              Wastage Trend
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #fed7aa", fontSize: "13px" }}
                />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* COMPLAINTS */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "24px",
            border: "1.5px solid #fed7aa",
            boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
          }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>
              <AlertTriangle size={16} color="#f97316" />
              Recent Complaints
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {complaints.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>No complaints</p>
              ) : (
                  complaints.map(c => (
                      <div key={c.id} style={{
                        background: "#fff7f0", borderRadius: "10px",
                        padding: "12px 16px", display: "flex",
                        justifyContent: "space-between", alignItems: "center",
                        border: "1px solid #fed7aa"
                      }}>
                        <div>
                          <p style={{ fontSize: "14px", color: "#2b2b2b", margin: "0 0 2px" }}>{c.description}</p>
                          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                            {c.user?.fullName || "Student"}
                          </p>
                        </div>
                        <span style={{
                          padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                          background: c.status === "Resolved" ? "#dcfce7" : "#fef9c3",
                          color: c.status === "Resolved" ? "#16a34a" : "#a16207"
                        }}>
                    {c.status}
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