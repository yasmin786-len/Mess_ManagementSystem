import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  if (!userId) { alert("User not logged in properly!"); navigate("/"); return null; }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().toISOString().split("T")[0];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [clickedMeals, setClickedMeals] = useState({});
  const [bill, setBill] = useState({});
  const [calendarStatus, setCalendarStatus] = useState({});
  const [notifications, setNotifications] = useState([]);

  const mealDeadlines = { Breakfast: 9, Lunch: 14, Dinner: 21 };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/student/notifications/${userId}`);
      setNotifications(await res.json());
    } catch (e) { console.log(e); }
  };

  const fetchTodayMeals = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/meals/${userId}`);
      const data = await res.json();
      const todayMeals = data.filter(m => m.date === today);
      const clicked = {};
      todayMeals.forEach(m => { clicked[m.mealType] = true; });
      setClickedMeals(clicked);
    } catch (e) { console.log(e); }
  };

  const markMeal = async (mealType, status) => {
    try {
      const res = await fetch(`http://localhost:8080/api/meals/mark/${userId}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType, status, date: today })
      });
      if (!res.ok) { alert(await res.text()); return; }
      setClickedMeals(prev => ({ ...prev, [mealType]: true }));
      fetchBill();
    } catch (e) { alert("Server error!"); }
  };

  const fetchBill = async () => {
    try {
      const today = new Date();
      const res = await fetch(`http://localhost:8080/api/meals/bill/${userId}/${today.getFullYear()}/${today.getMonth() + 1}`);
      setBill(await res.json());
    } catch (e) { console.log(e); }
  };

  const fetchCalendarStatus = async (day) => {
    try {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const res = await fetch(`http://localhost:8080/api/meals/calendar/${userId}/${date}`);
      const data = await res.json();
      setCalendarStatus(prev => ({ ...prev, [day]: data.status }));
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    fetchBill(); fetchTodayMeals(); fetchNotifications();
    for (let i = 1; i <= daysInMonth; i++) fetchCalendarStatus(i);
  }, [userId, month]);

  const attendance = bill?.totalMealsTillToday > 0
      ? ((bill.taken / bill.totalMealsTillToday) * 100).toFixed(2) : 100;
  const moneySaved = (bill?.skipped || 0) * 30;
  const totalMeals = bill?.totalMeals || 0;

  const cardStyle = {
    background: "#ffffff", borderRadius: "16px", padding: "20px 24px",
    border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)"
  };

  return (
      <StudentLayout active="dashboard">

        {/* BACK */}
        <button onClick={() => navigate("/")} style={{
          background: "rgba(99,102,241,0.1)", border: "none", padding: "8px 16px",
          borderRadius: "10px", color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
        }}>← Back</button>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Student Dashboard</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "28px" }}>
          Welcome back, {user?.fullName}!
        </p>

        {/* MEAL CARDS */}
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#2b2b2b", marginBottom: "14px" }}>Today's Meal Status</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {["Breakfast", "Lunch", "Dinner"].map(meal => (
              <div key={meal} style={cardStyle}>
                <p style={{ fontWeight: 600, color: "#6366f1", marginBottom: "14px", fontSize: "15px" }}>{meal}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button disabled={clickedMeals[meal]} onClick={() => markMeal(meal, "Eating")} style={{
                    flex: 1, padding: "8px", borderRadius: "8px", border: "none",
                    background: clickedMeals[meal] ? "#e0e7ff" : "linear-gradient(to right, #6366f1, #ec4899)",
                    color: clickedMeals[meal] ? "#6366f1" : "#fff",
                    fontWeight: 600, fontSize: "13px", cursor: clickedMeals[meal] ? "not-allowed" : "pointer",
                    fontFamily: "'Poppins', sans-serif"
                  }}>Eating</button>
                  <button
                      disabled={clickedMeals[meal] || new Date().getHours() >= mealDeadlines[meal]}
                      onClick={() => markMeal(meal, "Skip")} style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1.5px solid #fca5a5", background: "#fff1f2",
                    color: "#ef4444", fontWeight: 600, fontSize: "13px",
                    cursor: clickedMeals[meal] ? "not-allowed" : "pointer",
                    fontFamily: "'Poppins', sans-serif"
                  }}>Skip</button>
                </div>
              </div>
          ))}
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Meals", value: totalMeals,         color: "#6366f1", bg: "#f5f3ff", border: "#c7d2fe" },
            { label: "Skipped",     value: bill?.skipped || 0, color: "#ef4444", bg: "#fff1f2", border: "#fecdd3" },
            { label: "Money Saved", value: `₹${moneySaved}`,  color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
            { label: "Attendance",  value: `${attendance}%`,   color: "#6366f1", bg: "#f5f3ff", border: "#c7d2fe" },
          ].map(s => (
              <div key={s.label} style={{ ...cardStyle, border: `1.5px solid ${s.border}` }}>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: s.color, margin: "0 0 4px" }}>{s.value}</h2>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{s.label}</p>
              </div>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: "flex", gap: "20px" }}>

          {/* CALENDAR */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>
              Meal Calendar — {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 80px)", gap: "4px" }}>
              {[...Array(daysInMonth)].map((_, i) => (
                  <div key={i} style={{
                    width: "80px", height: "32px", borderRadius: "6px", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500,
                    background: calendarStatus[i + 1] === "RED" ? "#fee2e2" : "#f5f3ff",
                    color: calendarStatus[i + 1] === "RED" ? "#ef4444" : "#6366f1",
                    border: `1px solid ${calendarStatus[i + 1] === "RED" ? "#fca5a5" : "#c7d2fe"}`
                  }}>
                    {i + 1}
                  </div>
              ))}
            </div>
          </div>

          {/* BILL SUMMARY */}
          <div style={{ ...cardStyle, width: "280px", flexShrink: 0 }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Bill Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              {[
                { label: "Total Meals",   value: totalMeals,         color: "#2b2b2b" },
                { label: "Cost Per Meal", value: "₹30",              color: "#2b2b2b" },
                { label: "Meals Taken",   value: bill?.taken || 0,   color: "#22c55e" },
                { label: "Meals Skipped", value: bill?.skipped || 0, color: "#ef4444" },
              ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid #e0e7ff" }}>
                    <span style={{ color: "#6b7280" }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
                  </div>
              ))}
            </div>
            <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "2px solid #c7d2fe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#2b2b2b" }}>Total Bill</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#6366f1" }}>₹{bill?.total || 0}</span>
            </div>
            <button onClick={() => navigate("/billing")} style={{
              width: "100%", marginTop: "14px", padding: "10px", borderRadius: "10px",
              background: "linear-gradient(to right, #6366f1, #ec4899)",
              border: "none", color: "#fff", fontWeight: 600, fontSize: "13px",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif"
            }}>View Detailed Bill →</button>
          </div>
        </div>
      </StudentLayout>
  );
}