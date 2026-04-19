import { useNavigate } from "react-router-dom";

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#3730a3", transition: "all 0.2s",
  listStyle: "none"
};

const sidebarItemActive = {
  ...sidebarItem,
  background: "linear-gradient(to right, #6366f1, #ec4899)",
  color: "#ffffff", fontWeight: 600
};

export default function StudentLayout({ children, active }) {
  const navigate = useNavigate();

  return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", background: "#eef1ff" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #c7d2fe", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#6366f1", marginBottom: "32px" }}>🎓 Student Portal</p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Dashboard",    path: "/student-dashboard", key: "dashboard" },
              { label: "Meal History", path: "/meal-history",      key: "meal" },
              { label: "Billing",      path: "/billing",           key: "billing" },
              { label: "Complaints",   path: "/complaints",        key: "complaints" },
              { label: "Notifications",path: "/notifications",     key: "notifications" },
              { label: "Settings",     path: "/settings",          key: "settings" },
            ].map(item => (
                <li key={item.key} onClick={() => navigate(item.path)}
                    style={active === item.key ? sidebarItemActive : sidebarItem}
                    onMouseEnter={e => { if (active !== item.key) e.currentTarget.style.background = "#f5f3ff"; }}
                    onMouseLeave={e => { if (active !== item.key) e.currentTarget.style.background = "transparent"; }}>
                  {item.label}
                </li>
            ))}
          </ul>

          <div style={{ marginTop: "auto" }}>
            <div onClick={() => { localStorage.removeItem("user"); navigate("/"); }}
                 style={{ ...sidebarItem, color: "#ef4444", background: "#fff1f2" }}
                 onMouseEnter={e => e.currentTarget.style.background = "#ffe4e6"}
                 onMouseLeave={e => e.currentTarget.style.background = "#fff1f2"}>
              ← Logout
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
  );
}