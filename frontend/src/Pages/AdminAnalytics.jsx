import AdminLayout from "./AdminLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

const skipData    = [{ m: "Oct", v: 170 }, { m: "Nov", v: 160 }, { m: "Dec", v: 220 }, { m: "Jan", v: 200 }, { m: "Feb", v: 150 }, { m: "Mar", v: 170 }];
const wasteData   = [{ m: "Oct", v: 300 }, { m: "Nov", v: 285 }, { m: "Dec", v: 380 }, { m: "Jan", v: 340 }, { m: "Feb", v: 260 }, { m: "Mar", v: 310 }];
const compareData = [{ m: "Oct", skips: 170, waste: 300 }, { m: "Nov", skips: 160, waste: 285 }, { m: "Dec", skips: 220, waste: 380 }, { m: "Jan", skips: 200, waste: 340 }, { m: "Feb", skips: 150, waste: 260 }, { m: "Mar", skips: 170, waste: 310 }];

const tooltipStyle = { borderRadius: "10px", border: "1px solid #bbf7d0", fontSize: "13px" };
const chartCard = {
  background: "#ffffff", borderRadius: "16px", padding: "24px",
  border: "1.5px solid #bbf7d0", boxShadow: "0 4px 16px rgba(34,197,94,0.07)"
};

export default function AdminAnalytics() {
  return (
      <AdminLayout title="Analytics" backTo="/admin-dashboard">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* STAT CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {[
              { label: "Total Skips (March)", value: "170",    color: "#6366f1", bg: "#f5f3ff", border: "#c7d2fe" },
              { label: "Total Wastage",       value: "310 kg", color: "#ef4444", bg: "#fff1f2", border: "#fecdd3" },
              { label: "Skip Change",         value: "-13%",   color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "Efficiency",          value: "87%",    color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" },
            ].map(s => (
                <div key={s.label} style={{
                  background: "#ffffff", borderRadius: "16px", padding: "20px",
                  border: `1.5px solid ${s.border}`, boxShadow: "0 4px 16px rgba(34,197,94,0.07)"
                }}>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 6px" }}>{s.label}</p>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</h2>
                </div>
            ))}
          </div>

          {/* SKIP TRENDS */}
          <div style={chartCard}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Meal Skip Trends</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={skipData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis domain={[0, 220]} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: "#22c55e" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* WASTAGE TRENDS */}
          <div style={chartCard}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>Wastage Trends</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={wasteData}>
                <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis domain={[0, 400]} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="v" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MONTHLY COMPARISON */}
          <div style={chartCard}>
            <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "8px" }}>Monthly Comparison</p>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>— Skips</span>
              <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>— Wastage</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={compareData}>
                <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="skips" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e" }} />
                <Line type="monotone" dataKey="waste" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </AdminLayout>
  );
}