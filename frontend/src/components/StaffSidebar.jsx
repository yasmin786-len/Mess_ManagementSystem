import { useNavigate, useLocation } from "react-router-dom";

export default function StaffSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/staff-dashboard" },
    { name: "Meals", path: "/staff-meals" },
    { name: "Wastage", path: "/staff-wastage" },
    { name: "Complaints", path: "/staff-complaints" },
  ];

  return (
    <div className="w-64 bg-[#1c0033] p-6 flex flex-col">
      <h2 className="text-pink-500 font-semibold mb-10">Staff Portal</h2>

      <div className="space-y-3 text-sm">
        {menu.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              location.pathname === item.path
                ? "bg-gradient-to-r from-pink-500 to-purple-500"
                : "text-gray-300 hover:bg-purple-800/40"
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}