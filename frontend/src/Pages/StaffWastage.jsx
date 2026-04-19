import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#7c3a00", transition: "all 0.2s"
};

export default function StaffWastage() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`http://localhost:8080/api/staff/meals/wastage-trend/${user.messNo}`)
        .then(res => res.json()).then(data => setChartData(Array.isArray(data) ? data : []));
    fetch(`http://localhost:8080/api/staff/meals/comparison/${user.messNo}`)
        .then(res => res.json()).then(data => setTableData(data.map(d => ({ date: d.day, b: d.b, l: d.l, d: d.d, t: d.t }))));
  }, []);

  return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#fff4ec" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #fed7aa", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", marginBottom: "32px" }}>🍳 Staff Portal</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Dashboard",  path: "/staff-dashboard" },
              { label: "Menu",       path: "/staff-menu" },
              { label: "Meals",      path: "/staff-meals" },
              { label: "Complaints", path: "/staff-complaints" },
            ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)} style={sidebarItem}
                     onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {item.label}
                </div>
            ))}
            <div style={{ ...sidebarItem, background: "linear-gradient(to right, #f97316, #ef4444)", color: "#fff", fontWeight: 600 }}>
              Wastage
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

          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Wastage Report</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "28px" }}>Daily food wastage tracking</p>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "24px" }}>
            {[
              { label: "This Week Total", value: "54 kg", iconColor: "#ef4444", bg: "#fff1f2" },
              { label: "Daily Average",   value: "10.8 kg", iconColor: "#f97316", bg: "#fff7f0" },
              { label: "Highest Day",     value: "18 kg",  iconColor: "#f59e0b", bg: "#fffbeb" },
            ].map(card => (
                <div key={card.label} style={{
                  background: "#ffffff", borderRadius: "16px", padding: "24px",
                  border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.08)",
                  display: "flex", alignItems: "center", gap: "16px"
                }}>
                  <div style={{ background: card.bg, padding: "12px", borderRadius: "12px" }}>
                    <Trash2 size={20} color={card.iconColor} />
                  </div>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>{card.label}</p>
                    <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{card.value}</h2>
                  </div>
                </div>
            ))}
          </div>

          {/* CHART */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "24px",
            border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.08)", marginBottom: "24px"
          }}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Wastage Trend</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #fed7aa", fontSize: "13px" }} />
                <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TABLE */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "24px",
            border: "1.5px solid #fed7aa", boxShadow: "0 4px 16px rgba(249,115,22,0.08)"
          }}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Daily Breakdown</p>
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
              <thead>
              <tr style={{ color: "#6b7280" }}>
                <th style={{ textAlign: "left", paddingBottom: "10px" }}>Date</th>
                <th style={{ textAlign: "center", paddingBottom: "10px" }}>Breakfast</th>
                <th style={{ textAlign: "center", paddingBottom: "10px" }}>Lunch</th>
                <th style={{ textAlign: "center", paddingBottom: "10px" }}>Dinner</th>
                <th style={{ textAlign: "center", paddingBottom: "10px" }}>Total</th>
              </tr>
              </thead>
              <tbody>
              {tableData.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #fed7aa" }}>
                    <td style={{ padding: "12px 0", color: "#2b2b2b" }}>{row.date}</td>
                    <td style={{ textAlign: "center", color: "#2b2b2b" }}>{row.b} kg</td>
                    <td style={{ textAlign: "center", color: "#2b2b2b" }}>{row.l} kg</td>
                    <td style={{ textAlign: "center", color: "#2b2b2b" }}>{row.d} kg</td>
                    <td style={{ textAlign: "center", color: "#ef4444", fontWeight: 700 }}>{row.t} kg</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}