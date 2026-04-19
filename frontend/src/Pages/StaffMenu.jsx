import { useNavigate } from "react-router-dom";

const menu = [
  { day: "Sunday",    breakfast: "Idli, Chutney",      lunch: "Rice, Dal, Chicken Curry", dinner: "Chapati, Veg Curry" },
  { day: "Monday",    breakfast: "Dosa, Sambar",        lunch: "Rice, Sambar, Veg Curry",  dinner: "Rice, Rasam" },
  { day: "Tuesday",   breakfast: "Upma",                lunch: "Rice, Rasam, Egg Curry",   dinner: "Chapati, Paneer" },
  { day: "Wednesday", breakfast: "Puri",                lunch: "Rice, Dal, Paneer Curry",  dinner: "Rice, Veg Fry" },
  { day: "Thursday",  breakfast: "Dosa",                lunch: "Rice, Sambar, Fish Curry", dinner: "Chapati, Egg Curry" },
  { day: "Friday",    breakfast: "Idli",                lunch: "Rice, Dal, Chicken Fry",   dinner: "Rice, Veg Curry" },
  { day: "Saturday",  breakfast: "Upma",                lunch: "Veg Biryani",              dinner: "Chapati, Dal" },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

const sidebarItem = {
  padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
  fontSize: "14px", fontWeight: 500, color: "#7c3a00", transition: "all 0.2s"
};

const meals = [
  { key: "breakfast", label: "Breakfast", emoji: "🍳", color: "#f97316", bg: "#fff7f0", border: "#fed7aa", time: "7:00 – 9:00 AM" },
  { key: "lunch",     label: "Lunch",     emoji: "🍛", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", time: "12:30 – 2:30 PM" },
  { key: "dinner",    label: "Dinner",    emoji: "🌙", color: "#6366f1", bg: "#f5f3ff", border: "#c7d2fe", time: "7:30 – 9:30 PM" },
];

export default function StaffMenu() {
  const navigate = useNavigate();

  return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif", background: "#fff4ec" }}>

        {/* SIDEBAR */}
        <div style={{ width: "220px", background: "#ffffff", padding: "28px 20px", display: "flex", flexDirection: "column", borderRight: "1.5px solid #fed7aa", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#f97316", marginBottom: "32px" }}>🍳 Staff Portal</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Dashboard",  path: "/staff-dashboard" },
              { label: "Meals",      path: "/staff-meals" },
              { label: "Wastage",    path: "/staff-wastage" },
              { label: "Complaints", path: "/staff-complaints" },
            ].map(item => (
                <div key={item.label} onClick={() => navigate(item.path)} style={sidebarItem}
                     onMouseEnter={e => e.currentTarget.style.background = "#fff7f0"}
                     onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  {item.label}
                </div>
            ))}
            <div style={{ ...sidebarItem, background: "linear-gradient(to right, #f97316, #ef4444)", color: "#fff", fontWeight: 600 }}>
              Menu
            </div>
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

          {/* BACK */}
          <button onClick={() => navigate(-1)} style={{
            background: "rgba(249,115,22,0.1)", border: "none", padding: "8px 16px",
            borderRadius: "10px", color: "#f97316", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", marginBottom: "20px"
          }}>← Back</button>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#2b2b2b", margin: 0 }}>Weekly Menu</h1>
              <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Hostel mess meal plan — Sunday to Saturday</p>
            </div>
            {/* Today badge */}
            <div style={{
              background: "linear-gradient(to right, #f97316, #ef4444)",
              borderRadius: "12px", padding: "10px 20px", textAlign: "center"
            }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: "0 0 2px", fontWeight: 500 }}>TODAY</p>
              <p style={{ fontSize: "15px", color: "#fff", fontWeight: 700, margin: 0 }}>{today}</p>
            </div>
          </div>

          {/* MEAL TIME LEGEND */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
            {meals.map(m => (
                <div key={m.key} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "#ffffff", border: `1.5px solid ${m.border}`,
                  borderRadius: "10px", padding: "8px 14px"
                }}>
                  <span style={{ fontSize: "16px" }}>{m.emoji}</span>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: m.color, margin: 0 }}>{m.label}</p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{m.time}</p>
                  </div>
                </div>
            ))}
          </div>

          {/* MENU TABLE */}
          <div style={{
            background: "#ffffff", borderRadius: "20px",
            border: "1.5px solid #fed7aa", overflow: "hidden",
            boxShadow: "0 4px 24px rgba(249,115,22,0.08)"
          }}>

            {/* TABLE HEADER */}
            <div style={{
              display: "grid", gridTemplateColumns: "140px 1fr 1fr 1fr",
              background: "linear-gradient(to right, #f97316, #ef4444)",
              padding: "14px 24px"
            }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>Day</p>
              {meals.map(m => (
                  <p key={m.key} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", margin: 0 }}>
                    {m.emoji} {m.label}
                  </p>
              ))}
            </div>

            {/* TABLE ROWS */}
            {menu.map((m, i) => {
              const isToday = m.day === today;
              return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "140px 1fr 1fr 1fr",
                    padding: "16px 24px", alignItems: "center",
                    background: isToday ? "#fff7f0" : i % 2 === 0 ? "#ffffff" : "#fafafa",
                    borderTop: "1px solid #fed7aa",
                    borderLeft: isToday ? "4px solid #f97316" : "4px solid transparent",
                    transition: "background 0.2s"
                  }}>
                    {/* DAY */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <p style={{
                        fontSize: "14px", fontWeight: isToday ? 700 : 600,
                        color: isToday ? "#f97316" : "#2b2b2b", margin: 0
                      }}>{m.day}</p>
                      {isToday && (
                          <span style={{
                            fontSize: "10px", fontWeight: 700, color: "#fff",
                            background: "#f97316", borderRadius: "6px", padding: "2px 6px"
                          }}>TODAY</span>
                      )}
                    </div>

                    {/* BREAKFAST */}
                    <div style={{ paddingRight: "16px" }}>
                      <p style={{ fontSize: "13px", color: "#2b2b2b", margin: 0 }}>{m.breakfast}</p>
                    </div>

                    {/* LUNCH */}
                    <div style={{ paddingRight: "16px" }}>
                      <p style={{ fontSize: "13px", color: "#2b2b2b", margin: 0 }}>{m.lunch}</p>
                    </div>

                    {/* DINNER */}
                    <div>
                      <p style={{ fontSize: "13px", color: "#2b2b2b", margin: 0 }}>{m.dinner}</p>
                    </div>
                  </div>
              );
            })}
          </div>

          {/* FOOTER NOTE */}
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "16px", textAlign: "center" }}>
            * Menu is subject to change based on availability. Contact mess staff for queries.
          </p>

        </div>
      </div>
  );
}