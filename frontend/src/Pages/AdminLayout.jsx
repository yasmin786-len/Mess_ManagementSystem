import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, MessageSquare, BarChart3 } from "lucide-react";

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#14532d", transition: "all 0.2s",
  display: "flex", alignItems: "center", gap: "10px"
};

export default function AdminLayout({ children, title, backTo }) {
  const navigate = useNavigate();

  return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", background: "#ecfff5" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #bbf7d0", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e", marginBottom: "32px" }}>🛡️ Admin Portal</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { icon: <LayoutDashboard size={16} />, label: "Dashboard",      path: "/admin-dashboard" },
              { icon: <Users size={16} />,           label: "Admin Alerts",   path: "/admin-alerts" },
              { icon: <FileText size={16} />,        label: "Billing Reports",path: "/admin-billing" },
              { icon: <MessageSquare size={16} />,   label: "Complaints",     path: "/admin-complaints" },
              { icon: <BarChart3 size={16} />,       label: "Analytics",      path: "/admin-analytics" },
            ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)} style={sidebarItem}
                     onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ color: "#22c55e" }}>{item.icon}</span>
                  {item.label}
                </div>
            ))}
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

          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <button onClick={() => navigate(backTo || -1)} style={{
              background: "rgba(34,197,94,0.1)", border: "none", padding: "8px 16px",
              borderRadius: "10px", color: "#22c55e", cursor: "pointer",
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px"
            }}>← Back</button>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>{title}</h2>
              <p style={{ color: "#6b7280", fontSize: "13px", margin: 0 }}>System overview and management</p>
            </div>
          </div>

          {children}
        </div>
      </div>
  );
}