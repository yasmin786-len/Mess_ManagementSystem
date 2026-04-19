import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  return (
      <div className="home-container">

        {/* Title */}
        <div className="title-section">
          <p className="badge">● Smart Hostel System</p>
          <h1>
            Smart Hostel <br />
            <span>Mess Management</span>
          </h1>
          <p className="subtitle">
            Digitize your hostel mess operations with real-time tracking,
            analytics, and smart management
          </p>
        </div>

        {/* Cards */}
        <div className="card-container">

          {/* Student */}
          <div className="card">
            <div className="icon-wrap purple">
              <svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
            </div>
            <h3>Student Portal</h3>
            <p>Track meals, view bills, manage your mess experience</p>
            <button className="btn student-btn" onClick={() => navigate("/student-login")}>
              Enter Portal
            </button>
          </div>

          {/* Staff */}
          <div className="card">
            <div className="icon-wrap orange">
              <svg viewBox="0 0 24 24"><path d="M18 6.6c0-2.2-2.7-4.1-6-4.1S6 4.4 6 6.6c0 1.2.8 2.3 2 3.1V11H7v2h1v8h8v-8h1V11h-1V9.7c1.2-.8 2-1.9 2-3.1zM12 4.5c2.4 0 4 1.2 4 2.1S14.4 8.7 12 8.7 8 7.5 8 6.6s1.6-2.1 4-2.1z"/></svg>
            </div>
            <h3>Staff Portal</h3>
            <p>Manage food preparation, track wastage, handle operations</p>
            <button className="btn staff-btn" onClick={() => navigate("/staff-login")}>
              Enter Portal
            </button>
          </div>

          {/* Admin */}
          <div className="card">
            <div className="icon-wrap green">
              <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>
            </div>
            <h3>Admin Portal</h3>
            <p>Monitor analytics, manage students, oversee everything</p>
            <button className="btn admin-btn" onClick={() => navigate("/admin-login")}>
              Enter Portal
            </button>
          </div>

        </div>

        <p className="footer">© 2026 Smart Hostel Mess Management System</p>
      </div>
  );
}