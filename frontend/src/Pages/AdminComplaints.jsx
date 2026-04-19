import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityMap, setPriorityMap] = useState({});

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/complaints/all");
            const data = await res.json();
            setComplaints(data.reverse());
        } catch (err) { console.log(err); }
        finally { setLoading(false); }
    };

    const forwardComplaint = async (id) => {
        const priority = priorityMap[id] || "Medium";
        try {
            await fetch(`http://localhost:8080/api/admin/complaints/forward/${id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priority })
            });
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Forwarded", assignedTo: "STAFF", priority } : c));
        } catch (err) { console.log(err); }
    };

    const selectStyle = {
        padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #bbf7d0",
        background: "#f0fdf4", fontFamily: "'Poppins', sans-serif",
        fontSize: "13px", color: "#2b2b2b", outline: "none", cursor: "pointer"
    };

    return (
        <AdminLayout title="Complaints" backTo="/admin-dashboard">
            <div style={{ maxWidth: "1000px" }}>

                {loading && <p style={{ color: "#6b7280" }}>Loading...</p>}
                {!loading && complaints.length === 0 && <p style={{ color: "#6b7280" }}>No complaints found</p>}

                {!loading && complaints.map(c => (
                    <div key={c.id} style={{
                        background: "#ffffff", borderRadius: "16px", padding: "20px 24px",
                        marginBottom: "14px", border: "1.5px solid #bbf7d0",
                        boxShadow: "0 4px 16px rgba(34,197,94,0.07)"
                    }}>
                        {/* BADGES */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, background: "#f0fdf4", color: "#22c55e", border: "1px solid #bbf7d0" }}>
                  {c.category}
                </span>
                                <span style={{
                                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                                    background: c.status === "Pending" ? "#fffbeb" : c.status === "Forwarded" ? "#eff6ff" : "#f0fdf4",
                                    color: c.status === "Pending" ? "#f59e0b" : c.status === "Forwarded" ? "#3b82f6" : "#22c55e"
                                }}>{c.status}</span>
                                {c.priority && (
                                    <span style={{
                                        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                                        background: c.priority === "High" ? "#fff1f2" : c.priority === "Medium" ? "#fffbeb" : "#f0fdf4",
                                        color: c.priority === "High" ? "#ef4444" : c.priority === "Medium" ? "#f59e0b" : "#22c55e"
                                    }}>{c.priority}</span>
                                )}
                            </div>
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{c.date}</span>
                        </div>

                        <p style={{ fontSize: "14px", color: "#2b2b2b", margin: "0 0 4px" }}>{c.description}</p>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 8px" }}>👤 {c.user?.fullName}</p>

                        {c.status === "Resolved" && c.response && (
                            <p style={{ fontSize: "13px", color: "#22c55e", fontWeight: 500, margin: "0 0 8px" }}>✔ {c.response}</p>
                        )}

                        {c.imageUrl && (
                            <img src={`http://localhost:8080/uploads/${c.imageUrl}`} style={{ width: "112px", borderRadius: "10px", marginBottom: "12px" }} />
                        )}

                        {c.status === "Pending" && (
                            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                <select onChange={(e) => setPriorityMap({ ...priorityMap, [c.id]: e.target.value })} style={selectStyle}>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Low">Low</option>
                                </select>
                                <button onClick={() => forwardComplaint(c.id)} style={{
                                    padding: "8px 20px", borderRadius: "8px",
                                    background: "linear-gradient(to right, #22c55e, #16a34a)",
                                    border: "none", color: "#fff", fontWeight: 600,
                                    fontSize: "13px", cursor: "pointer", fontFamily: "'Poppins', sans-serif"
                                }}>Forward to Staff</button>
                            </div>
                        )}

                        {c.status === "Forwarded" && (
                            <p style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 500, marginTop: "8px" }}>✔ Sent to staff</p>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}