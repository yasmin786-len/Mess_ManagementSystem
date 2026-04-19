import { useNavigate } from "react-router-dom";

export default function StaffLayout({ children, active }) {

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-purple-950 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-purple-900 p-5">

        <h2 className="text-lg font-bold mb-6">Staff Portal</h2>

        <ul className="space-y-4 text-sm">

          <li
            onClick={() => navigate("/staff-dashboard")}
            className={`p-2 rounded cursor-pointer ${active==="dashboard" && "bg-purple-700"}`}
          >
            Dashboard
          </li>

          <li
            onClick={() => navigate("/staff-menu")}
            className={`p-2 rounded cursor-pointer ${
              active === "menu" && "bg-purple-700"
            }`}
          >
            Menu
          </li>


          <li
            onClick={() => navigate("/staff-meals")}
            className={`p-2 rounded cursor-pointer ${active==="meals" && "bg-purple-700"}`}
          >
            Meals
          </li>

          <li
            onClick={() => navigate("/staff-wastage")}
            className={`p-2 rounded cursor-pointer ${active==="wastage" && "bg-purple-700"}`}
          >
            Wastage
          </li>

          <li
            onClick={() => navigate("/staff-complaints")}
            className={`p-2 rounded cursor-pointer ${active==="complaints" && "bg-purple-700"}`}
          >
            Complaints
          </li>

        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}