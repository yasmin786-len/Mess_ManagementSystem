import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Users, Utensils, MessageSquare, IndianRupee } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

const skipData  = [{ week: "W1", value: 42 }, { week: "W2", value: 38 }, { week: "W3", value: 55 }, { week: "W4", value: 30 }];
const wasteData = [{ week: "W1", value: 55 }, { week: "W2", value: 48 }, { week: "W3", value: 72 }, { week: "W4", value: 44 }];

export default function AdminDashboard() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/complaints/all")
            .then(res => res.json())
            .then(data => setComplaints(data.reverse().slice(0, 5)))
            .catch(err => console.log(err));
    }, []);

    const resolveComplaint = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/complaints/update/${id}`, { method: "PUT" });
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
        } catch (err) { console.log(err); }
    };

    return (
        <AdminLayout title="Admin Dashboard" backTo="/">

            {/* STAT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
                {[
                    { icon: <Users size={20} color="#22c55e" />,       label: "Total Students", value: "486",   bg: "#f0fdf4", border: "#bbf7d0" },
                    { icon: <Utensils size={20} color="#6366f1" />,    label: "Meals Today",    value: "342",   bg: "#f5f3ff", border: "#c7d2fe" },
                    { icon: <MessageSquare size={20} color="#f97316" />,label: "Complaints",    value: complaints.length, bg: "#fff7f0", border: "#fed7aa" },
                    { icon: <IndianRupee size={20} color="#22c55e" />, label: "Revenue",        value: "₹1.4L", bg: "#f0fdf4", border: "#bbf7d0" },
                ].map(card => (
                    <div key={card.label} style={{
                        background: "#ffffff", borderRadius: "16px", padding: "20px",
                        border: `1.5px solid ${card.border}`, boxShadow: "0 4px 16px rgba(34,197,94,0.07)",
                        display: "flex", alignItems: "center", gap: "14px"
                    }}>
                        <div style={{ background: card.bg, padding: "12px", borderRadius: "12px" }}>{card.icon}</div>
                        <div>
                            <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 4px" }}>{card.label}</p>
                            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* RECENT COMPLAINTS */}
            <div style={{
                background: "#ffffff", borderRadius: "16px", padding: "24px",
                border: "1.5px solid #bbf7d0", boxShadow: "0 4px 16px rgba(34,197,94,0.07)", marginBottom: "24px"
            }}>
                <h3 style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px", fontSize: "15px" }}>Recent Complaints</h3>
                {complaints.length === 0 ? (
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>No complaints yet</p>
                ) : (
                    complaints.map(c => (
                        <div key={c.id} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            background: "#f0fdf4", borderRadius: "10px", padding: "14px 16px",
                            marginBottom: "10px", border: "1px solid #bbf7d0"
                        }}>
                            <div>
                                <p style={{ fontSize: "14px", color: "#2b2b2b", margin: "0 0 2px" }}>{c.description}</p>
                                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>— {c.user?.fullName} ({c.user?.userId})</p>
                            </div>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                    background: c.status === "Pending" ? "#fffbeb" : "#f0fdf4",
                    color: c.status === "Pending" ? "#f59e0b" : "#22c55e"
                }}>{c.status}</span>
                                {c.status === "Pending" && (
                                    <button onClick={() => resolveComplaint(c.id)} style={{
                                        padding: "6px 16px", borderRadius: "8px",
                                        background: "linear-gradient(to right, #22c55e, #16a34a)",
                                        border: "none", color: "#fff", fontWeight: 600,
                                        fontSize: "12px", cursor: "pointer", fontFamily: "'Poppins', sans-serif"
                                    }}>Resolve</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* CHARTS */}
            <div style={{ display: "flex", gap: "20px" }}>
                {[
                    { title: "Skip Trends", data: skipData, type: "line" },
                    { title: "Wastage",     data: wasteData, type: "bar" },
                ].map(chart => (
                    <div key={chart.title} style={{
                        flex: 1, background: "#ffffff", borderRadius: "16px", padding: "24px",
                        border: "1.5px solid #bbf7d0", boxShadow: "0 4px 16px rgba(34,197,94,0.07)"
                    }}>
                        <p style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "16px" }}>{chart.title}</p>
                        <ResponsiveContainer width="100%" height={260}>
                            {chart.type === "line" ? (
                                <LineChart data={chart.data}>
                                    <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #bbf7d0", fontSize: "13px" }} />
                                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e" }} />
                                </LineChart>
                            ) : (
                                <BarChart data={chart.data}>
                                    <CartesianGrid stroke="#f3f4f7" strokeDasharray="3 3" />
                                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #bbf7d0", fontSize: "13px" }} />
                                    <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>

        </AdminLayout>
    );
}