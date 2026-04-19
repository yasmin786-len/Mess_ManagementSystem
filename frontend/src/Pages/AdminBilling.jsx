import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminBilling() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/admin/billing?year=${year}&month=${month}`)
        .then(res => res.json()).then(data => { setStudents(data); setFiltered(data); setLoading(false); })
        .catch(() => setLoading(false));
  }, [month, year]);

  useEffect(() => {
    let temp = students;
    if (search.trim()) temp = temp.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.userId.toLowerCase().includes(search.toLowerCase()));
    if (branch !== "ALL") temp = temp.filter(s => s.branch === branch);
    setFiltered(temp);
  }, [search, branch, students]);

  const filterStyle = {
    padding: "10px 16px", borderRadius: "10px", border: "1.5px solid #bbf7d0",
    background: "#f0fdf4", fontFamily: "'Poppins', sans-serif",
    fontSize: "13px", color: "#2b2b2b", outline: "none"
  };

  return (
      <AdminLayout title="Billing Reports" backTo="/admin-dashboard">
        <div style={{ maxWidth: "1200px" }}>

          {/* FILTERS */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <input type="text" placeholder="Search by name or ID..." value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   style={{ ...filterStyle, width: "240px" }} />

            <select value={branch} onChange={(e) => setBranch(e.target.value)} style={filterStyle}>
              <option value="ALL">All Branches</option>
              <option value="PUC-1">PUC-1</option>
              <option value="PUC-2">PUC-2</option>
              <option value="BTECH-1">BTech 1st Year</option>
              <option value="BTECH-2">BTech 2nd Year</option>
              <option value="BTECH-3">BTech 3rd Year</option>
              <option value="BTECH-4">BTech 4th Year</option>
            </select>
          </div>

          {/* TABLE */}
          <div style={{
            background: "#ffffff", borderRadius: "16px", padding: "24px",
            border: "1.5px solid #bbf7d0", boxShadow: "0 4px 16px rgba(34,197,94,0.07)", overflowX: "auto"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
              <tr style={{ borderBottom: "2px solid #bbf7d0" }}>
                {["Student", "ID", "Branch", "Meals Taken", "Skipped", "Total Bill"].map((h, i) => (
                    <th key={h} style={{
                      padding: "12px 12px", color: "#6b7280", fontWeight: 600,
                      fontSize: "12px", textAlign: i >= 3 ? "center" : "left"
                    }}>{h}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {filtered.map((s, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0fdf4", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 12px", color: "#2b2b2b", fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "14px 12px", color: "#6b7280" }}>{s.userId}</td>
                    <td style={{ padding: "14px 12px", color: "#6b7280" }}>{s.branch}</td>
                    <td style={{ padding: "14px 12px", textAlign: "center", color: "#2b2b2b" }}>{s.taken}</td>
                    <td style={{ padding: "14px 12px", textAlign: "center", color: "#ef4444", fontWeight: 600 }}>{s.skipped}</td>
                    <td style={{ padding: "14px 12px", textAlign: "right", color: "#22c55e", fontWeight: 700 }}>₹{s.total}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
  );
}