import StudentLayout from "../components/StudentLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MealHistory() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id || 1;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ status: "ALL", month: "ALL", year: "ALL" });

  const fetchMeals = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/meals/${userId}`);
      const meals = await res.json();
      setData(meals.map(m => ({ date: m.date, meal: m.mealType, status: m.status === "Eating" ? "Ate" : "Skipped" })));
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchMeals(); }, []);

  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    if (filter.status !== "ALL" && item.status !== filter.status) return false;
    if (filter.month !== "ALL" && itemDate.getMonth() !== parseInt(filter.month)) return false;
    if (filter.year !== "ALL" && itemDate.getFullYear().toString() !== filter.year) return false;
    return true;
  });

  const selectStyle = {
    padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #c7d2fe",
    background: "#f5f3ff", fontFamily: "'Poppins', sans-serif",
    fontSize: "13px", color: "#2b2b2b", outline: "none", cursor: "pointer", appearance: "none"
  };

  return (
      <StudentLayout active="meal">

        <button onClick={() => navigate("/student-dashboard")} style={{
          background: "rgba(99,102,241,0.1)", border: "none", padding: "8px 16px",
          borderRadius: "10px", color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
        }}>← Back</button>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Meal History</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "24px" }}>Track your past meal records</p>

        {/* FILTERS */}
        <div style={{
          background: "#ffffff", borderRadius: "14px", padding: "16px 20px",
          border: "1.5px solid #c7d2fe", marginBottom: "16px",
          display: "flex", gap: "16px", flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>Status</label>
            <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={selectStyle}>
              <option value="ALL">All Status</option>
              <option value="Ate">Ate</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>Month</label>
            <select value={filter.month} onChange={e => setFilter({ ...filter, month: e.target.value })} style={selectStyle}>
              <option value="ALL">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>Year</label>
            <select value={filter.year} onChange={e => setFilter({ ...filter, year: e.target.value })} style={selectStyle}>
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>Showing {filteredData.length} records</p>

        {/* TABLE */}
        <div style={{
          background: "#ffffff", borderRadius: "16px", padding: "24px",
          border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "8px", padding: "0 8px" }}>
            <span>Date</span><span>Meal</span><span>Status</span>
          </div>
          {filteredData.length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: "14px", padding: "12px 8px" }}>No meal history found</p>
          ) : (
              filteredData.map((item, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "12px 8px", borderTop: "1px solid #e0e7ff",
                    alignItems: "center", fontSize: "14px"
                  }}>
                    <span style={{ color: "#2b2b2b" }}>{item.date}</span>
                    <span style={{ color: "#2b2b2b" }}>{item.meal}</span>
                    <span style={{
                      display: "inline-block", padding: "4px 12px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: 500, width: "fit-content",
                      background: item.status === "Ate" ? "#f0fdf4" : "#fff1f2",
                      color: item.status === "Ate" ? "#22c55e" : "#ef4444"
                    }}>{item.status}</span>
                  </div>
              ))
          )}
        </div>
      </StudentLayout>
  );
}