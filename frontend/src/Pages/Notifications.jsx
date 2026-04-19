import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, Bell } from "lucide-react";
import "./notification.css";

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    useEffect(() => { if (userId) fetchNotifications(); }, [userId]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/student/notifications/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch");
            setNotifications(await res.json() || []);
        } catch (e) { console.log("Fetch error:", e); }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/student/notifications/read/${id}`, { method: "PUT" });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (e) { console.log("Read error:", e); }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm("Delete permanently?")) return;
        try {
            await fetch(`http://localhost:8080/api/student/notifications/${id}`, { method: "DELETE" });
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) { console.log("Delete error:", e); }
    };

    return (
        <div className="notifications-page">

            {/* SIDEBAR */}
            <div className="sidebar">
                <h2>🎓 Student Portal</h2>
                <ul>
                    <li onClick={() => navigate("/student-dashboard")}>Dashboard</li>
                    <li onClick={() => navigate("/meal-history")}>Meal History</li>
                    <li onClick={() => navigate("/billing")}>Billing</li>
                    <li onClick={() => navigate("/complaints")}>Complaints</li>
                    <li className="active">Notifications</li>
                    <li onClick={() => navigate("/settings")}>Settings</li>
                </ul>
                <div className="logout" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}>
                    ← Logout
                </div>
            </div>

            {/* MAIN */}
            <div className="main-content">

                <button className="back-btn" onClick={() => navigate("/student-dashboard")}>
                    ← Back
                </button>

                <h1>Notifications</h1>
                <p className="subtitle">Stay updated with the latest alerts</p>

                {notifications.length === 0 ? (

                    /* EMPTY STATE */
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Bell size={32} color="#fff" />
                        </div>
                        <h2>No Notifications Yet</h2>
                        <p>You're all caught up! New alerts will appear here.</p>
                    </div>

                ) : (

                    <div className="notifications-container">

                        {/* UNREAD BADGE */}
                        {notifications.filter(n => !n.read).length > 0 && (
                            <div>
                <span className="unread-badge">
                  {notifications.filter(n => !n.read).length} unread
                </span>
                            </div>
                        )}

                        {/* CARDS */}
                        {notifications.map(n => (
                            <div key={n.id} className={`notification-card ${!n.read ? "unread" : ""}`}>

                                <div className="notif-header">
                                    <div>
                                        <div className="notif-title-row">
                                            {!n.read && <div className="unread-dot" />}
                                            <h3>{n.title}</h3>
                                        </div>
                                        <span className="date">{n.date}</span>
                                    </div>

                                    <div className="notif-icons">
                                        {!n.read && (
                                            <button className="icon-btn read-btn" onClick={() => markAsRead(n.id)} title="Mark as read">
                                                <Check size={16} color="#22c55e" />
                                            </button>
                                        )}
                                        <button className="icon-btn delete-btn" onClick={() => deleteNotification(n.id)} title="Delete">
                                            <Trash2 size={16} color="#ef4444" />
                                        </button>
                                    </div>
                                </div>

                                <p className="message">{n.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;