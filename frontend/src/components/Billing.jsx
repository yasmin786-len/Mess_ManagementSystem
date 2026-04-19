import StudentLayout from "../components/StudentLayout";
import { UtensilsCrossed, Ban, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Billing() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  if (!userId) return <h2>Please login</h2>;

  const [bill, setBill] = useState({});

  const fetchBill = async () => {
    try {
      const today = new Date();
      const res = await fetch(`http://localhost:8080/api/meals/bill/${userId}/${today.getFullYear()}/${today.getMonth() + 1}`);
      setBill(await res.json());
    } catch (e) { console.log(e); }
  };

  useEffect(() => { if (userId) fetchBill(); }, [userId]);

  const costPerMeal = 30;
  const totalMeals = bill?.totalMeals || 0;
  const taken = bill?.taken || 0;
  const skipped = bill?.skipped || 0;
  const saved = skipped * costPerMeal;
  const totalBill = bill?.total || 0;
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Mess Bill Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${user?.fullName || "Student"}`, 20, 40);
    doc.text(`Month: ${monthName} ${year}`, 20, 50);
    doc.text(`Total Meals: ${totalMeals}`, 20, 70);
    doc.text(`Meals Taken: ${taken}`, 20, 80);
    doc.text(`Meals Skipped: ${skipped}`, 20, 90);
    doc.text(`Cost Per Meal: ₹${costPerMeal}`, 20, 110);
    doc.text(`Saved: ₹${saved}`, 20, 120);
    doc.setFontSize(16); doc.text(`Total Bill: ₹${totalBill}`, 20, 140);
    doc.save("mess-bill.pdf");
  };

  const cardStyle = {
    background: "#ffffff", borderRadius: "16px", padding: "20px",
    border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
    display: "flex", alignItems: "center", gap: "14px"
  };

  return (
      <StudentLayout active="billing">

        <button onClick={() => navigate("/student-dashboard")} style={{
          background: "rgba(99,102,241,0.1)", border: "none", padding: "8px 16px",
          borderRadius: "10px", color: "#6366f1", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
        }}>← Back</button>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Billing</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: "28px" }}>Your mess bill details</p>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
          <div style={cardStyle}>
            <div style={{ background: "#f5f3ff", padding: "12px", borderRadius: "12px" }}>
              <UtensilsCrossed size={20} color="#6366f1" />
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>Meals Taken</p>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{taken}</h2>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ background: "#fff1f2", padding: "12px", borderRadius: "12px" }}>
              <Ban size={20} color="#ef4444" />
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>Meals Skipped</p>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{skipped}</h2>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "12px" }}>
              <IndianRupee size={20} color="#22c55e" />
            </div>
            <div>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>Saved</p>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>₹{saved}</h2>
            </div>
          </div>
        </div>

        {/* BILL BOX */}
        <div style={{
          background: "#ffffff", borderRadius: "16px", padding: "28px",
          border: "1.5px solid #c7d2fe", boxShadow: "0 4px 16px rgba(99,102,241,0.08)", maxWidth: "520px"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b", marginBottom: "20px" }}>
            Bill Breakdown — {monthName} {year}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
            {[
              { label: "Total Meals Available", value: totalMeals, color: "#2b2b2b" },
              { label: "Meals Taken",           value: taken,      color: "#22c55e" },
              { label: "Meals Skipped",         value: skipped,    color: "#ef4444" },
              { label: "Cost Per Meal",         value: "₹30",      color: "#2b2b2b" },
            ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid #e0e7ff" }}>
                  <span style={{ color: "#6b7280" }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.color }}>{row.value}</span>
                </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #c7d2fe", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontWeight: 600, color: "#2b2b2b", margin: 0 }}>Total Bill</h3>
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#6366f1", margin: 0 }}>₹{totalBill}</h2>
          </div>
          <button onClick={downloadPDF} style={{
            width: "100%", padding: "13px", borderRadius: "10px",
            background: "linear-gradient(to right, #6366f1, #ec4899)",
            border: "none", color: "#fff", fontWeight: 600, fontSize: "14px",
            cursor: "pointer", fontFamily: "'Poppins', sans-serif"
          }}>⬇ Download Bill</button>
        </div>
      </StudentLayout>
  );
}